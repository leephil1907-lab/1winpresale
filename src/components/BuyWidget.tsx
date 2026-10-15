"use client";

import { useEffect, useRef, useState } from "react";
import { publicSale, referenceRatesUsd, saleIntegration, site } from "@/config";
import { useTronWallet } from "@/components/WalletProvider";
import Countdown from "./Countdown";
import {
  getTronWeb,
  isExpectedNetwork,
  networkLabel,
  shortenAddress,
  toBaseUnits,
  tronscanTx,
} from "@/lib/tron";

type TxState = "idle" | "signing" | "success" | "error";

const usdFmt = (n: number) =>
  `US$${new Intl.NumberFormat("en-US").format(n)}`;
const fmt = (n: number, max = 2) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);

export default function BuyWidget() {
  const wallet = useTronWallet();
  const [currency, setCurrency] = useState("USDC");
  const [amount, setAmount] = useState("10");
  const [curOpen, setCurOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [txState, setTxState] = useState<TxState>("idle");
  const [txid, setTxid] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const live = saleIntegration.live && Boolean(saleIntegration.contractAddress);
  const net = saleIntegration.network;
  const netName = networkLabel(net);

  const currencies = Object.keys(referenceRatesUsd);
  const pay = Number.parseFloat(amount) || 0;
  const usd = pay * (referenceRatesUsd[currency] ?? 1);
  const base = usd / publicSale.priceUsd;
  const bonus = (base * publicSale.stageBonusPct) / 100;
  const receive = base + bonus;
  const belowMin = pay > 0 && usd < publicSale.minContributionUsd;
  const statsAvailable = false; // Keep public figures hidden until an authoritative sale data source is connected.
  const progress = statsAvailable && publicSale.goalUsd > 0 ? (publicSale.raisedUsd / publicSale.goalUsd) * 100 : 0;

  // close the currency dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setCurOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function resetTx() {
    setTxState("idle");
    setTxid(null);
    setTxError(null);
  }

  async function executePurchase() {
    const tw = getTronWeb();
    if (!tw || !wallet.address) {
      setTxState("error");
      setTxError("Wallet not connected.");
      return;
    }
    try {
      if (!isExpectedNetwork(tw, net)) {
        throw new Error(`Please switch TronLink to ${netName} first.`);
      }
      setTxState("signing");
      if (currency === "TRX") {
        const sun = toBaseUnits(amount, 6);
        const tx = await tw.transactionBuilder.sendTrx(
          saleIntegration.contractAddress,
          sun,
          wallet.address
        );
        const signed = await tw.trx.sign(tx);
        const receipt = await tw.trx.sendRawTransaction(signed);
        if (!receipt?.result) throw new Error(receipt?.code || "Broadcast failed");
        setTxid(receipt.txid ?? null);
      } else {
        const tokenAddress = saleIntegration.tokens[net]?.[currency];
        if (!tokenAddress) throw new Error(`${currency} is not supported on ${netName}.`);
        const units = toBaseUnits(amount, 6);
        const token = await tw.contract().at(tokenAddress);

        // Tether quirk: non-zero → non-zero allowance changes must pass through 0
        const allowanceRaw = await token
          .allowance(wallet.address, saleIntegration.contractAddress)
          .call();
        const currentAllowance = BigInt(allowanceRaw?.toString?.() ?? "0");
        const needed = BigInt(units);
        if (currentAllowance > BigInt(0) && currentAllowance !== needed) {
          await token.approve(saleIntegration.contractAddress, "0").send({ feeLimit: 20_000_000 });
        }
        if (currentAllowance !== needed) {
          await token.approve(saleIntegration.contractAddress, units).send({ feeLimit: 20_000_000 });
        }

        const saleContract = await tw.contract(saleIntegration.abi, saleIntegration.contractAddress);
        const result = await saleContract.buyWithToken(tokenAddress, units).send({ feeLimit: 80_000_000 });
        setTxid(typeof result === "string" ? result : result?.txid ?? null);
      }
      setTxState("success");
    } catch (err: any) {
      setTxError(String(err?.message || err || "Transaction rejected").slice(0, 180));
      setTxState("error");
    }
  }

  return (
    <>
      <div className="relative z-10 w-full space-y-4">
        {/* ---- sale status card ---- */}
        <div className="card p-6 text-center sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Token Sale ends in
          </h2>
          <div className="mt-4">
            <Countdown />
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-ink-800/80 p-5 text-left">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white sm:text-3xl">
                {statsAvailable ? usdFmt(publicSale.raisedUsd) : "Awaiting verified data"}
              </span>
              {statsAvailable && <span className="text-sm text-slate-500">of {usdFmt(publicSale.goalUsd)}</span>}
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              {statsAvailable && <div
                className="progress-shine progress-spectrum h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, progress)}%` }}
              />}
            </div>
            <dl className="mt-4 divide-y divide-line text-sm">
              <div className="flex items-center justify-between py-2.5">
                <dt className="flex items-center gap-1.5 text-slate-400">
                  Oversubscription
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/10 text-[9px] text-slate-400" title="Raised amount vs. pool target">i</span>
                </dt>
                <dd className="font-bold text-white">{statsAvailable && publicSale.goalUsd > 0 ? `x${(publicSale.raisedUsd / publicSale.goalUsd).toFixed(2)}` : "Not available"}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-400">Participants</dt>
                <dd className="font-bold text-white">{statsAvailable ? publicSale.participants.toLocaleString("en-US") : "Not available"}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="flex items-center gap-1.5 text-slate-400">
                  Supply
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/10 text-[9px] text-slate-400" title="Tokens allocated to this sale">i</span>
                </dt>
                <dd className="font-bold text-white">{publicSale.supplyOnSale}</dd>
              </div>
            </dl>
          </div>
        </div>

        {!live && <div className="rounded-2xl border border-amber-400/20 bg-amber-300/[0.06] px-4 py-3 text-center text-sm leading-relaxed text-amber-100/80">Purchases are disabled until a verified TRON contract, sale terms, and claim flow are published.</div>}

        {/* ---- deposit card ---- */}
        <div className="card p-6 sm:p-7">
          <div className="rounded-2xl border border-line bg-ink-800/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <label htmlFor="deposit-amount" className="mb-1 block text-xs font-medium text-slate-500">
                  Deposit
                </label>
                <input
                  id="deposit-amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full bg-transparent text-xl font-bold text-white outline-none placeholder:text-slate-600"
                />
              </div>

              {/* currency picker */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setCurOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  aria-expanded={curOpen}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flame-500/20 text-[10px] font-extrabold text-flame-300">
                    {currency[0]}
                  </span>
                  {currency}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`text-slate-400 transition-transform ${curOpen ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {curOpen && (
                  <div className="menu-in absolute right-0 top-full z-20 mt-2 w-36 overflow-hidden rounded-xl border border-line bg-ink-800 shadow-xl">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setCurOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-white/5 ${
                          c === currency ? "text-flame-300" : "text-slate-300"
                        }`}
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-flame-500/20 text-[9px] font-extrabold">
                          {c[0]}
                        </span>
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* rate + estimate */}
          <p className="mt-4 text-center text-sm font-semibold text-slate-300">
            1WIN = {publicSale.priceUsd.toFixed(2).replace(".", ",")} USDC
          </p>
          {pay > 0 && (
            <p className="mt-1.5 text-center text-xs text-slate-500">
              You receive ≈ <b className="text-white">{fmt(receive, 0)} {site.ticker}</b>
              {publicSale.stageBonusPct > 0 && (
                <> · incl. {fmt(bonus, 0)} bonus ({publicSale.stageBonusPct}%)</>
              )}
            </p>
          )}
          {belowMin && (
            <p className="mt-1.5 text-center text-xs text-gold-300">
              Minimum deposit is ${publicSale.minContributionUsd}.
            </p>
          )}

          {/* primary CTA */}
          {!live ? (
            <button onClick={() => setInfoOpen(true)} className="btn-primary mt-5 w-full py-4 text-base">
              Deposit
            </button>
          ) : wallet.status !== "connected" ? (
            <button
              onClick={wallet.installed === false ? () => window.open("https://www.tronlink.org", "_blank", "noreferrer") : wallet.connect}
              disabled={wallet.status === "connecting"}
              className="btn-primary mt-5 w-full py-4 text-base"
            >
              {wallet.installed === false ? "Install TronLink" : wallet.status === "connecting" ? "Connecting…" : "Deposit"}
            </button>
          ) : (
            <button
              onClick={() => {
                resetTx();
                setConfirmOpen(true);
              }}
              disabled={pay <= 0 || belowMin}
              className="btn-primary mt-5 w-full py-4 text-base"
            >
              Deposit
            </button>
          )}

          {wallet.status === "connected" && wallet.address && (
            <p className="mt-3 text-center font-mono text-[11px] text-slate-500">
              connected: {shortenAddress(wallet.address)}{" "}
              <button onClick={wallet.disconnect} className="font-semibold text-slate-400 underline underline-offset-2 hover:text-white">
                disconnect
              </button>
            </p>
          )}
          {wallet.error && <p className="mt-2 text-center text-xs text-flame-300">{wallet.error}</p>}

          <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-600">
            Estimates use reference rates; the final quote is set at checkout.
            Crypto assets are high risk — nothing here is financial advice.
          </p>
        </div>
      </div>

      {/* pre-launch info modal */}
      {infoOpen && (
        <div
          className="modal-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setInfoOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="card modal-card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500/15 text-flame-300">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h4 className="mt-4 text-lg font-bold text-white">Token sale deposit isn&apos;t open yet</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              The official {site.network} sale contract opens with the announced
              date and will be published and verifiable on this page. We will
              never DM you an address or ask for your recovery phrase.
            </p>
            <button className="btn-primary mt-5 w-full py-2.5" onClick={() => setInfoOpen(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* confirm / tx modal */}
      {confirmOpen && live && (
        <div
          className="modal-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => txState !== "signing" && setConfirmOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="card modal-card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            {txState === "idle" && (
              <>
                <h4 className="text-lg font-bold text-white">Confirm deposit</h4>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">You deposit</dt>
                    <dd className="font-semibold text-white">
                      {amount} {currency} <span className="text-slate-500">(≈ ${fmt(usd)})</span>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">You receive (est.)</dt>
                    <dd className="font-semibold text-white">{fmt(receive, 0)} {site.ticker}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Network</dt>
                    <dd className="font-semibold text-white">{netName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Sale contract</dt>
                    <dd className="font-mono text-xs text-gold-300">{shortenAddress(saleIntegration.contractAddress)}</dd>
                  </div>
                </dl>
                <p className="mt-4 rounded-lg bg-white/[0.04] px-3 py-2 text-[11px] leading-relaxed text-slate-500">
                  You review and sign this in TronLink — nothing is sent automatically, and we never see your keys.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button className="rounded-xl border border-line py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white" onClick={() => setConfirmOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary py-2.5 text-sm" onClick={executePurchase}>
                    Confirm &amp; sign
                  </button>
                </div>
              </>
            )}

            {txState === "signing" && (
              <div className="py-4 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-line border-t-flame-400" />
                <h4 className="mt-4 font-bold text-white">Check TronLink to sign…</h4>
                <p className="mt-1 text-sm text-slate-400">Review the transaction details carefully before approving.</p>
              </div>
            )}

            {txState === "success" && (
              <div className="py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="mt-4 font-bold text-white">Transaction broadcast</h4>
                <p className="mt-1 text-sm text-slate-400">
                  Your {site.ticker} allocation will be credited according to the sale terms.
                </p>
                {txid && (
                  <a href={tronscanTx(txid, net)} target="_blank" rel="noreferrer" className="mt-3 inline-block max-w-full truncate font-mono text-xs text-flame-300 underline decoration-flame-400/40 underline-offset-4 hover:text-flame-400">
                    {txid}
                  </a>
                )}
                <button className="btn-primary mt-5 w-full py-2.5" onClick={() => { setConfirmOpen(false); setAmount("10"); resetTx(); }}>
                  Done
                </button>
              </div>
            )}

            {txState === "error" && (
              <div className="py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-flame-500/15 text-flame-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </div>
                <h4 className="mt-4 font-bold text-white">Transaction failed</h4>
                <p className="mt-1 break-words text-sm text-slate-400">{txError}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button className="rounded-xl border border-line py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white" onClick={() => setConfirmOpen(false)}>
                    Close
                  </button>
                  <button className="btn-primary py-2.5 text-sm" onClick={() => setTxState("idle")}>
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
