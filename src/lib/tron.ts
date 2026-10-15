/**
 * Minimal TRON/TronLink helpers (client-side only usage).
 */
import type { SaleNetwork } from "../config";

declare global {
  interface Window {
    tronLink?: any;
    tronWeb?: any;
  }
}

/** Returns the injected tronWeb instance if a TRON wallet is available. */
export function getTronWeb(): any | null {
  if (typeof window === "undefined") return null;
  if (window.tronWeb) return window.tronWeb;
  if (window.tronLink?.tronWeb) return window.tronLink.tronWeb;
  return null;
}

export function shortenAddress(addr: string): string {
  return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

/**
 * Parse a decimal string (e.g. "12.5") into an integer string of the
 * token's smallest unit ("12500000" for 6 decimals). BigInt-safe and free
 * of float rounding errors.
 */
export function toBaseUnits(amount: string, decimals: number): string {
  const clean = amount.trim();
  if (!/^\d+(\.\d+)?$/.test(clean)) return "0";
  const [intPart, fracPart = ""] = clean.split(".");
  const frac = (fracPart + "0".repeat(decimals)).slice(0, decimals);
  const digits = `${intPart}${frac}`.replace(/^0+/, "");
  return digits || "0";
}

/** Human label for the configured network. */
export function networkLabel(network: SaleNetwork): string {
  return network === "nile" ? "TRON Nile testnet" : "TRON Mainnet";
}

/**
 * Heuristic check that the wallet's full node matches the configured
 * network (TronGrid hostnames). Providers that hide their host are allowed
 * through — TronLink enforces the user's selected network at signing time.
 */
export function isExpectedNetwork(tronWeb: any, network: SaleNetwork): boolean {
  try {
    const host: string = tronWeb?.fullNode?.host || "";
    if (!host) return true;
    if (network === "nile") return /nile\.trongrid\.io/i.test(host);
    return /trongrid\.io/i.test(host) && !/nile\./i.test(host);
  } catch {
    return true;
  }
}

export function tronscanTx(txid: string, network: SaleNetwork): string {
  const base =
    network === "nile" ? "https://nile.tronscan.org" : "https://tronscan.org";
  return `${base}/#/transaction/${txid}`;
}
