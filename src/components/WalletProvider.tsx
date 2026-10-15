"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getTronWeb } from "@/lib/tron";

export type WalletStatus = "idle" | "connecting" | "connected";

interface WalletContextValue {
  /** null = still detecting, false = no TronLink found */
  installed: boolean | null;
  address: string | null;
  status: WalletStatus;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

/**
 * Single source of truth for the TronLink connection, shared by the header
 * and the buy widget. Detects the (asynchronously injected) provider, tracks
 * account changes broadcast by TronLink, and exposes connect/disconnect.
 */
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<WalletStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let tries = 0;
    const poll = setInterval(() => {
      const tw = getTronWeb();
      if (tw) {
        setInstalled(true);
        const addr = tw.defaultAddress?.base58;
        if (addr) {
          setAddress(addr);
          setStatus("connected");
        }
        clearInterval(poll);
      } else if (++tries > 25) {
        setInstalled(false);
        clearInterval(poll);
      }
    }, 160);

    // TronLink broadcasts account changes via window message events
    const onMessage = (e: MessageEvent) => {
      const msg = (e.data as any)?.message;
      if (!msg || typeof msg !== "object") return;
      if (msg.action === "setAccount") {
        const addr: string | undefined = msg.data?.address;
        setAddress(addr ?? null);
        setStatus(addr ? "connected" : "idle");
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      clearInterval(poll);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    const tronLink = window.tronLink;
    if (!tronLink) {
      setInstalled(false);
      setError("TronLink not detected in this browser.");
      return;
    }
    setStatus("connecting");
    try {
      const res = await tronLink.request({ method: "tron_requestAccounts" });
      const addr = getTronWeb()?.defaultAddress?.base58;
      if (addr) {
        setAddress(addr);
        setStatus("connected");
      } else if (res && res.code !== 200) {
        throw new Error(res.message || "Connection request was rejected");
      } else {
        throw new Error("No account returned — is TronLink unlocked?");
      }
    } catch (err: any) {
      setStatus("idle");
      setError(String(err?.message || "Connection failed"));
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setStatus("idle");
  }, []);

  return (
    <WalletContext.Provider
      value={{ installed, address, status, error, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useTronWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useTronWallet must be used inside <WalletProvider>");
  }
  return ctx;
}
