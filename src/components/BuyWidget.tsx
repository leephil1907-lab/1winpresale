"use client";

import { useState } from "react";
import { referenceRatesUsd, sale, saleIntegration, site } from "@/config";
import { useTronWallet } from "@/components/WalletProvider";
import {
  getTronWeb,
  isExpectedNetwork,
  networkLabel,
  shortenAddress,
  toBaseUnits,
  tronscanTx,
} from "@/lib/tron";

type TxState = "idle" | "signing" | "success" | "error";

export default function BuyWidget() {
  const wallet = useTronWallet();
  const [currency, setCurrency] = useState("TRX");
  const [amount, setAmount] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [txState, setTxState] = useState<TxState>("idle");
  const [txid, setTxid] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  /** checkout is only active once the audited contract is configured */
  const live = saleIntegration.live && Boolean(saleIntegration.contractAddress);
  const net = saleIntegration.network;
  const netName = networkLabel(net);

  const currencies = Object.keys(referenceRatesUsd);
  const pay = Number.parseFloat(amount) || 0;
  const usd = pay * (referenceRatesUsd[currency] ?? 1);
  const base = usd / sale.tokenPriceUsd;
  const bonusAmount = (base * sale.stageBonusPct) / 100;
  const receive = base + bonusAmount;
  const belowMin = pay > 0 && usd < sale.minContributionUsd;
  const progress = Math.min(100, (sale.raisedUsd / sale.goalUsd) * 100);

  const fmt = (n: number, max = 2) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);

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
        // Native TRX: sign + broadcast a plain transfer to the sale contract
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
        // Stablecoins: exact-amount approve, then buyWithToken() on the
        // presale contract (see contracts/OneWinPresale.sol).
        const tokenAddress = saleIntegration.tokens[net]?.[currency];
        if (!tokenAddress) {
          throw new Error(`${currency} is not supported on ${netName}.`);
        }
        const units = toBaseUnits(amount, 6);
        const token = await tw.contract().at(tokenAddress);

        // Tether (TRC-20, like ERC-20 USDT) rejects changing a non-zero
        // allowance straight to another non-zero value — reset to 0 first.
        const allowanceRaw = await token
          .allowance(wallet.address, saleIntegration.contractAddress)
          .call();
        const currentAllowance = BigInt(allowanceRaw?.toString?.() ?? "0");
        const needed = BigInt(units);
        if (currentAllowance > BigInt(0) && currentAllowance !== needed) {
          await token
            .approve(saleIntegration.contractAddress, "0")
            .send({ feeLimit: 20_000_000 });
        }
        if (currentAllowance !== needed) {
          await token
            .approve(saleIntegration.contractAddress, units)
            .send({ feeLimit: 20_000_000 });
        }

        const saleContract = await tw.contract(
          saleIntegration.abi,
          saleIntegration.contractAddress
        );
        const result = await saleContract
          .buyWithToken(tokenAddress, units)
          .send({ feeLimit: 80_000_000 });
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
      <div
        id="buy"
        className="card relative z-10 w-full max-w-md p-6 shadow-[0_0_90px_-24px_rgba(229,9,20,0.55)] sm:p-7"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white">Buy {site.ticker}</h3>
          <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-[11px] font-bold tracking-wide text-gold-300">
            +{sale.stageBonusPct}% BONUS
          </span>
        </div>

        {/* progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Raised <b className="text-white">${fmt(sale.raisedUsd, 0)}</b>
            </span>
            <span>Goal ${fmt(sale.goalUsd, 0)}</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="progress-shine h-full rounded-full bg-gradient-to-r from-flame-500 via-flame-400 to-gold-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              1 {site.ticker} ={" "}
              <b className="text-flame-300">${sale.tokenPriceUsd}</b>
            </span>
            <span className="text-slate-500">
              Next stage ${sale.nextStagePriceUsd}
            </span>
          </div>
        </div>

        {/* currency selector */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {currencies.map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                currency === c
                  ? "border-flame-400/60 bg-flame-500/15 text-white"
                  : "border-line bg-white/[0.03] text-slate-400 hover:-translate-y-0.5 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* pay input */}
        <label
          htmlFor="pay-amount"
          className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
        >
          You pay
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-ink-900/80 px-4 py-3 transition-colors focus-within:border-flame-400/60">
          <input
            id="pay-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            placeholder="0.00"
            className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-slate-600"
          />
          <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">
            {currency}
          </span>
        </div>
        {belowMin && (
          <p className="mt-2 text-xs text-gold-300">
            Minimum contribution is ${sale.minContributionUsd}.
          </p>
        )}

        {/* receive */}
        <div className="mt-4 rounded-xl border border-line bg-ink-900/60 px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            You receive (est.)
          </div>
          <div className="mt-1 text-xl font-extrabold text-white">
            <span
              key={pay > 0 ? Math.round(receive) : "zero"}
              className="tick-pop inline-block"
            >
              {pay > 0 ? `≈ ${fmt(receive, 0)}` : "0"} {site.ticker}
            </span>
          </div>
          {pay > 0 && (
            <div className="mt-0.5 text-xs text-slate-500">
              includes {fmt(bonusAmount, 0)} {site.ticker} stage bonus
            </div>
          )}
        </div>

        {/* primary action — depends on integration state */}
        {!live ? (
          <button
            onClick={() => setInfoOpen(true)}
            className="btn-primary mt-5 w-full py-3.5 text-base"
          >
            Connect wallet
          </button>
        ) : wallet.status !== "connected" ? (
          <button
            onClick={
              wallet.installed === false
                ? () =>
                    window.open("https://www.tronlink.org", "_blank", "noreferrer")
                : wallet.connect
            }
            disabled={wallet.status === "connecting"}
            className="btn-primary mt-5 w-full py-3.5 text-base"
          >
            {wallet.installed === false
              ? "Install TronLink"
              : wallet.status === "connecting"
                ? "Connecting…"
                : "Connect TronLink"}
          </button>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-line bg-ink-900/70 px-4 py-2.5 text-xs">
              <span className="flex items-center gap-2 font-mono text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {shortenAddress(wallet.address!)}
              </span>
              <button
                onClick={wallet.disconnect}
                className="font-semibold text-slate-500 transition-colors hover:text-white"
              >
                Disconnect
              </button>
            </div>
            <button
              onClick={() => {
                resetTx();
                setConfirmOpen(true);
              }}
              disabled={pay <= 0 || belowMin}
              className="btn-primary w-full py-3.5 text-base"
            >
              Review purchase
            </button>
          </div>
        )}
        {wallet.error && (
          <p className="mt-2 text-center text-xs text-flame-300">
            {wallet.error}
          </p>
        )}

        <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-600">
          Estimated amount using reference rates — the final quote is set at
          checkout. Crypto assets are high risk; nothing here is financial
          advice.
        </p>
      </div>

      {/* pre-launch info modal */}
      {infoOpen && (
        <div
          className="modal-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setInfoOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="card modal-card w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500/15 text-flame-300">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h4 className="mt-4 text-lg font-bold text-white">
              Presale checkout isn&apos;t live yet
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              The official {site.network} sale contract launches with the
              announced sale date and will be published and verifiable on this
              page. We will never DM you an address or ask for your recovery
              phrase.
            </p>
            <button
              className="btn-primary mt-5 w-full py-2.5"
              onClick={() => setInfoOpen(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* confirm / tx-status modal (only reachable when integration is live) */}
      {confirmOpen && live && (
        <div
          className="modal-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => txState !== "signing" && setConfirmOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="card modal-card w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {txState === "idle" && (
              <>
                <h4 className="text-lg font-bold text-white">
                  Confirm purchase
                </h4>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">You pay</dt>
                    <dd className="font-semibold text-white">
                      {amount} {currency}{" "}
                      <span className="text-slate-500">(≈ ${fmt(usd)})</span>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">You receive (est.)</dt>
                    <dd className="font-semibold text-white">
                      {fmt(receive, 0)} {site.ticker}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Network</dt>
                    <dd className="font-semibold text-white">{netName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Sale contract</dt>
                    <dd className="font-mono text-xs text-gold-300">
                      {shortenAddress(saleIntegration.contractAddress)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 rounded-lg bg-white/[0.04] px-3 py-2 text-[11px] leading-relaxed text-slate-500">
                  You review and sign this in TronLink — nothing is sent
                  automatically, and we never see your keys.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    className="rounded-xl border border-line py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => setConfirmOpen(false)}
                  >
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
                <h4 className="mt-4 font-bold text-white">
                  Check TronLink to sign…
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Review the transaction details carefully before approving.
                </p>
              </div>
            )}

            {txState === "success" && (
              <div className="py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="mt-4 font-bold text-white">
                  Transaction broadcast
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Your {site.ticker} allocation will be credited according to
                  the sale terms.
                </p>
                {txid && (
                  <a
                    href={tronscanTx(txid, net)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block max-w-full truncate font-mono text-xs text-flame-300 underline decoration-flame-400/40 underline-offset-4 hover:text-flame-400"
                  >
                    {txid}
                  </a>
                )}
                <button
                  className="btn-primary mt-5 w-full py-2.5"
                  onClick={() => {
                    setConfirmOpen(false);
                    setAmount("");
                    resetTx();
                  }}
                >
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
                <h4 className="mt-4 font-bold text-white">
                  Transaction failed
                </h4>
                <p className="mt-1 break-words text-sm text-slate-400">
                  {txError}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    className="rounded-xl border border-line py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    className="btn-primary py-2.5 text-sm"
                    onClick={() => setTxState("idle")}
                  >
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
