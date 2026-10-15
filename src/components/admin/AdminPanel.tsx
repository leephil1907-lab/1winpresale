"use client";

import { useCallback, useEffect, useState } from "react";
import { saleIntegration, site } from "@/config";
import { useTronWallet } from "@/components/WalletProvider";
import {
  getTronWeb,
  isExpectedNetwork,
  networkLabel,
  shortenAddress,
} from "@/lib/tron";

/** TRON zero address (base58 form of address(0)) — used to sweep native TRX. */
const ZERO_ADDRESS = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";

interface StageRow {
  priceUsd: number;
  bonusBps: number;
  start: number;
  end: number;
}

interface ContractInfo {
  owner: string;
  paused: boolean;
  trxPriceUsd: string;
  minContributionUsd: string;
  fundsWallet: string;
  totalUsdRaised: string;
  totalTokensAllocated: string;
  claimEnabled: boolean;
  saleToken: string;
  stageCount: number;
  stages: StageRow[];
  stables: Array<{ currency: string; address: string; accepted: boolean }>;
  contractTrx: string; // SUN
}

type View = "setup" | "connect" | "denied" | "admin";

const n = (v: any): string => (v?.toString?.() ?? String(v ?? "0"));
const num = (v: any): number => Number(n(v));
const fmtUsd6 = (v: string) =>
  `$${(Number(v) / 1e6).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const fmtTok18 = (v: string) =>
  `${(Number(v) / 1e18).toLocaleString("en-US", { maximumFractionDigits: 4 })}`;
const tsToDate = (s: number) => new Date(s * 1000).toLocaleString();

export default function AdminPanel() {
  const wallet = useTronWallet();
  const configured = Boolean(saleIntegration.contractAddress);
  const net = saleIntegration.network;
  const netName = networkLabel(net);
  const scanBase = net === "nile" ? "https://nile.tronscan.org" : "https://tronscan.org";

  const [view, setView] = useState<View>(configured ? "connect" : "setup");
  const [info, setInfo] = useState<ContractInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: "ok" | "err" | "info"; text: string; tx?: string } | null>(null);

  // form state
  const [fStage, setFStage] = useState({ price: "100000", bonus: "1000", start: "", end: "" });
  const [fTrxPrice, setFTrxPrice] = useState("330000");
  const [fMin, setFMin] = useState("25000000");
  const [fFunds, setFFunds] = useState("");
  const [fStable, setFStable] = useState({ address: "", accepted: true });
  const [fSweep, setFSweep] = useState(ZERO_ADDRESS);
  const [fClaimToken, setFClaimToken] = useState("");

  const contract = useCallback(() => {
    const tw = getTronWeb();
    if (!tw) throw new Error("TronLink not available");
    return tw.contract(saleIntegration.abi, saleIntegration.contractAddress);
  }, []);

  const refresh = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    setNotice(null);
    try {
      const c = await contract();
      const [owner, paused, trxPriceUsd, minContributionUsd, fundsWallet, raised, allocated, claimEnabled, saleToken, stageCount] =
        await Promise.all([
          c.owner().call(),
          c.paused().call(),
          c.trxPriceUsd().call(),
          c.minContributionUsd().call(),
          c.fundsWallet().call(),
          c.totalUsdRaised().call(),
          c.totalTokensAllocated().call(),
          c.claimEnabled().call(),
          c.saleToken().call(),
          c.stageCount().call(),
        ]);

      const stages: StageRow[] = [];
      for (let i = 0; i < num(stageCount); i++) {
        const s = await c.stages(i).call();
        stages.push({
          priceUsd: num(s[0] ?? s.tokenPriceUsd),
          bonusBps: num(s[1] ?? s.bonusBps),
          start: num(s[2] ?? s.startTime),
          end: num(s[3] ?? s.endTime),
        });
      }

      const stables = [];
      for (const [currency, address] of Object.entries(saleIntegration.tokens[net] ?? {})) {
        stables.push({ currency, address, accepted: Boolean(await c.acceptedStable(address).call()) });
      }

      const tw = getTronWeb();
      const ownerB58 = tw.address.fromHex(n(owner));
      const contractTrx = await tw.trx.getBalance(saleIntegration.contractAddress);

      const data: ContractInfo = {
        owner: ownerB58,
        paused: Boolean(paused),
        trxPriceUsd: n(trxPriceUsd),
        minContributionUsd: n(minContributionUsd),
        fundsWallet: n(fundsWallet).startsWith("T") ? n(fundsWallet) : tw.address.fromHex(n(fundsWallet)),
        totalUsdRaised: n(raised),
        totalTokensAllocated: n(allocated),
        claimEnabled: Boolean(claimEnabled),
        saleToken: n(saleToken),
        stageCount: num(stageCount),
        stages,
        stables,
        contractTrx: String(contractTrx),
      };
      setInfo(data);
      setView(
        wallet.address && wallet.address.toLowerCase() === ownerB58.toLowerCase()
          ? "admin"
          : "denied"
      );
    } catch (e: any) {
      setNotice({ kind: "err", text: String(e?.message || e).slice(0, 220) });
    } finally {
      setLoading(false);
    }
  }, [configured, contract, wallet.address, net]);

  // verify ownership whenever the connected account changes
  useEffect(() => {
    if (configured && wallet.status === "connected") refresh();
    else if (configured) setView("connect");
  }, [configured, wallet.status, wallet.address, refresh]);

  async function run(key: string, label: string, fn: () => Promise<any>) {
    setBusy(key);
    setNotice({ kind: "info", text: `${label}: confirm in TronLink…` });
    try {
      if (!isExpectedNetwork(getTronWeb(), net)) {
        throw new Error(`Switch TronLink to ${netName} first.`);
      }
      const result = await fn();
      const tx = typeof result === "string" ? result : result?.txid ?? result?.transaction;
      setNotice({ kind: "ok", text: `${label} succeeded.`, tx: typeof tx === "string" ? tx : undefined });
      await refresh();
    } catch (e: any) {
      setNotice({ kind: "err", text: `${label} failed: ${String(e?.message || e).slice(0, 200)}` });
    } finally {
      setBusy(null);
    }
  }

  /* ------------------------------- views ------------------------------- */

  if (view === "setup") {
    return (
      <Shell>
        <h1 className="text-2xl font-extrabold text-white">Owner console — setup required</h1>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-300">
          <li>Deploy <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">contracts/OneWinPresale.sol</code> (Nile testnet first — see README).</li>
          <li>Paste the address into <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">src/config.ts → saleIntegration.contractAddress</code></li>
          <li>Set <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">network</code> to match (<code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">&quot;nile&quot;</code> while testing)</li>
          <li>Reload this page and connect the owner wallet</li>
        </ol>
        <p className="mt-6 text-xs text-slate-500">
          Access control is enforced on-chain by the contract itself (onlyOwner) —
          this page checks <code className="rounded bg-white/10 px-1 py-0.5 font-mono">owner()</code> against your connected wallet.
          This route renders no public navigation and is excluded from indexing (noindex).
        </p>
      </Shell>
    );
  }

  if (view === "connect") {
    return (
      <Shell>
        <h1 className="text-2xl font-extrabold text-white">Owner console</h1>
        <p className="mt-3 text-sm text-slate-400">
          Connect the wallet that deployed the presale contract on {netName} to manage it.
        </p>
        <button
          onClick={wallet.installed === false ? () => window.open("https://www.tronlink.org", "_blank", "noreferrer") : wallet.connect}
          disabled={wallet.status === "connecting"}
          className="btn-primary mt-6 px-8 py-3 text-sm"
        >
          {wallet.installed === false ? "Install TronLink" : wallet.status === "connecting" ? "Connecting…" : "Connect TronLink"}
        </button>
        {wallet.error && <p className="mt-3 text-xs text-flame-300">{wallet.error}</p>}
        <p className="mt-6 font-mono text-xs text-slate-600">
          contract: {saleIntegration.contractAddress}
        </p>
      </Shell>
    );
  }

  if (view === "denied") {
    return (
      <Shell>
        <h1 className="text-2xl font-extrabold text-white">Not the owner wallet</h1>
        <p className="mt-3 text-sm text-slate-400">
          Connected <span className="font-mono text-flame-300">{wallet.address ? shortenAddress(wallet.address) : "—"}</span>,
          but the contract owner is{" "}
          <a className="font-mono text-gold-300 underline underline-offset-4" href={`${scanBase}/#/address/${info?.owner}`} target="_blank" rel="noreferrer">
            {info?.owner ? shortenAddress(info.owner) : "…"}
          </a>
          . Switch accounts in TronLink and retry.
        </p>
        <button onClick={refresh} className="btn-primary mt-6 px-8 py-3 text-sm">Re-check</button>
      </Shell>
    );
  }

  /* ----------------------------- admin view ---------------------------- */

  return (
    <Shell wide>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Owner console <span className="gradient-text">{site.ticker}</span> presale
          </h1>
          <p className="mt-1 font-mono text-xs text-slate-500">
            {shortenAddress(saleIntegration.contractAddress)} · {netName}
            {info?.paused && (
              <span className="ml-2 rounded-full bg-flame-500/15 px-2 py-0.5 font-sans text-[10px] font-extrabold uppercase tracking-wider text-flame-300">
                Paused
              </span>
            )}
            {info?.claimEnabled && (
              <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 font-sans text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                Claims open
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.04] px-3.5 py-2 font-mono text-xs text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {wallet.address ? shortenAddress(wallet.address) : ""}
          </span>
          <button onClick={refresh} disabled={loading} className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-flame-400/40 hover:text-white disabled:opacity-50">
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {notice && (
        <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
          notice.kind === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : notice.kind === "err" ? "border-flame-500/30 bg-flame-500/10 text-flame-300"
          : "border-line bg-white/[0.04] text-slate-300"
        }`}>
          {notice.text}
          {notice.tx && (
            <a href={`${scanBase}/#/transaction/${notice.tx}`} target="_blank" rel="noreferrer" className="ml-2 font-mono text-xs underline underline-offset-4">
              view tx
            </a>
          )}
        </div>
      )}

      {/* state */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total raised" value={fmtUsd6(info?.totalUsdRaised ?? "0")} />
        <Stat label="Tokens allocated" value={`${fmtTok18(info?.totalTokensAllocated ?? "0")} ${site.ticker}`} />
        <Stat label="TRX reference price" value={fmtUsd6(info?.trxPriceUsd ?? "0")} />
        <Stat label="Min. contribution" value={fmtUsd6(info?.minContributionUsd ?? "0")} />
        <Stat label="Contract TRX balance" value={`${(Number(info?.contractTrx ?? 0) / 1e6).toLocaleString()} TRX`} />
        <Stat label="Stages" value={String(info?.stageCount ?? 0)} />
        <Stat label="Funds wallet" value={info?.fundsWallet ? shortenAddress(info.fundsWallet) : "—"} mono />
        <Stat label="Sale token" value={info?.claimEnabled && info.saleToken ? shortenAddress(info.saleToken) : info?.claimEnabled ? "enabled" : "not set"} mono />
      </div>

      {/* stages table */}
      <div className="card mt-6 p-5">
        <h2 className="font-bold text-white">Stages</h2>
        {info && info.stages.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-2 pr-4">#</th>
                  <th className="pb-2 pr-4">Price</th>
                  <th className="pb-2 pr-4">Bonus</th>
                  <th className="pb-2 pr-4">Start</th>
                  <th className="pb-2">End</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {info.stages.map((s, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="py-2.5 pr-4 font-mono text-xs">{i}</td>
                    <td className="py-2.5 pr-4">{fmtUsd6(String(s.priceUsd))}</td>
                    <td className="py-2.5 pr-4">{s.bonusBps / 100}%</td>
                    <td className="py-2.5 pr-4">{tsToDate(s.start)}</td>
                    <td className="py-2.5">{tsToDate(s.end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No stages yet — add the first one below. Purchases revert until a stage is active.</p>
        )}
      </div>

      {/* accepted stables */}
      <div className="card mt-6 p-5">
        <h2 className="font-bold text-white">Accepted stablecoins</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {info?.stables.map((s) => (
            <li key={s.currency} className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${s.accepted ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-slate-400"}`}>
                {s.accepted ? "Accepted" : "Disabled"}
              </span>
              <span className="font-semibold text-white">{s.currency}</span>
              <span className="font-mono text-xs text-slate-500">{shortenAddress(s.address)}</span>
            </li>
          ))}
          {(!info || info.stables.length === 0) && (
            <li className="text-sm text-slate-500">No payment tokens configured for {netName} in config.</li>
          )}
        </ul>
      </div>

      {/* actions */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ActionCard title="Add stage" busy={busy === "addStage"}>
          <Field label="Price (USD, 6dp — $0.10 = 100000)" value={fStage.price} onChange={(v) => setFStage({ ...fStage, price: v })} mono />
          <Field label="Bonus (bps — 10% = 1000)" value={fStage.bonus} onChange={(v) => setFStage({ ...fStage, bonus: v })} mono />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start" type="datetime-local" value={fStage.start} onChange={(v) => setFStage({ ...fStage, start: v })} />
            <Field label="End" type="datetime-local" value={fStage.end} onChange={(v) => setFStage({ ...fStage, end: v })} />
          </div>
          <Submit
            disabled={busy !== null || !fStage.start || !fStage.end}
            busy={busy === "addStage"}
            onClick={() =>
              run("addStage", "Add stage", async () =>
                (await contract()).addStage(
                  fStage.price,
                  fStage.bonus,
                  Math.floor(new Date(fStage.start).getTime() / 1000),
                  Math.floor(new Date(fStage.end).getTime() / 1000)
                ).send({ feeLimit: 50_000_000 })
              )
            }
          >
            Add stage
          </Submit>
        </ActionCard>

        <ActionCard title="Pricing & limits" busy={busy === "pricing"}>
          <Field label="TRX price (USD, 6dp — $0.33 = 330000)" value={fTrxPrice} onChange={setFTrxPrice} mono />
          <Field label="Min. contribution (USD, 6dp — $25 = 25000000)" value={fMin} onChange={setFMin} mono />
          <div className="grid grid-cols-2 gap-3">
            <Submit disabled={busy !== null} busy={busy === "trxPrice"} small onClick={() => run("trxPrice", "Set TRX price", async () => (await contract()).setTrxPriceUsd(fTrxPrice).send({ feeLimit: 30_000_000 }))}>
              Set TRX price
            </Submit>
            <Submit disabled={busy !== null} busy={busy === "min"} small onClick={() => run("min", "Set minimum", async () => (await contract()).setMinContributionUsd(fMin).send({ feeLimit: 30_000_000 }))}>
              Set minimum
            </Submit>
          </div>
        </ActionCard>

        <ActionCard title="Stablecoin whitelist" busy={busy === "stable"}>
          <Field label="Token contract address (T…)" value={fStable.address} onChange={(v) => setFStable({ ...fStable, address: v })} mono placeholder="TR7NHqje…" />
          <div className="grid grid-cols-2 gap-3">
            <Submit disabled={busy !== null || !fStable.address} busy={busy === "stableOn"} small onClick={() => run("stableOn", "Enable stable", async () => (await contract()).setAcceptedStable(fStable.address, true).send({ feeLimit: 30_000_000 }))}>
              Enable
            </Submit>
            <Submit disabled={busy !== null || !fStable.address} busy={busy === "stableOff"} small onClick={() => run("stableOff", "Disable stable", async () => (await contract()).setAcceptedStable(fStable.address, false).send({ feeLimit: 30_000_000 }))}>
              Disable
            </Submit>
          </div>
        </ActionCard>

        <ActionCard title="Funds wallet" busy={busy === "funds"}>
          <Field label="New funds wallet (T…)" value={fFunds} onChange={setFFunds} mono placeholder="T…" />
          <Submit disabled={busy !== null || !fFunds} busy={busy === "funds"} onClick={() => run("funds", "Set funds wallet", async () => (await contract()).setFundsWallet(fFunds).send({ feeLimit: 30_000_000 }))}>
            Update funds wallet
          </Submit>
        </ActionCard>

        <ActionCard title="Sweep proceeds" busy={busy === "sweep"}>
          <Field label={`Asset (${ZERO_ADDRESS === fSweep ? "native TRX" : "TRC-20 address"})`} value={fSweep} onChange={setFSweep} mono />
          <p className="text-[11px] text-slate-500">
            Native TRX = zero address prefilled. For a stablecoin, paste its contract address. Tokens reserved for open claims can never be swept.
          </p>
          <Submit disabled={busy !== null || !fSweep} busy={busy === "sweep"} onClick={() => run("sweep", "Sweep", async () => (await contract()).sweep(fSweep).send({ feeLimit: 50_000_000 }))}>
            Sweep to funds wallet
          </Submit>
        </ActionCard>

        <ActionCard title="TGE — enable claims" busy={busy === "claim"}>
          <Field label="$1WIN token contract (T…)" value={fClaimToken} onChange={setFClaimToken} mono placeholder="T…" />
          <p className="text-[11px] text-slate-500">
            Deposit tokens ≥ total allocated to this contract first, then enable. Buyers claim() themselves.
          </p>
          <Submit disabled={busy !== null || !fClaimToken} busy={busy === "claim"} onClick={() => run("claim", "Enable claims", async () => (await contract()).enableClaim(fClaimToken).send({ feeLimit: 50_000_000 }))}>
            Enable claims
          </Submit>
        </ActionCard>

        <ActionCard title="Emergency pause" busy={busy === "pause"}>
          <p className="text-[11px] text-slate-500">
            Pauses all new contributions immediately. Entitlements already recorded are unaffected.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Submit disabled={busy !== null} busy={busy === "pause"} small onClick={() => run("pause", "Pause", async () => (await contract()).pause().send({ feeLimit: 30_000_000 }))}>
              Pause
            </Submit>
            <Submit disabled={busy !== null} busy={busy === "unpause"} small onClick={() => run("unpause", "Unpause", async () => (await contract()).unpause().send({ feeLimit: 30_000_000 }))}>
              Unpause
            </Submit>
          </div>
        </ActionCard>
      </div>

      <p className="mt-8 text-center font-mono text-[11px] text-slate-600">
        /admin · owner-gated by the contract (onlyOwner) · never share your keys · {netName}
      </p>
    </Shell>
  );
}

/* ------------------------------ ui atoms ------------------------------ */

function Shell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="relative min-h-screen py-16">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="animate-glow pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-flame-500/15 blur-[140px]" />
      <div className={`relative mx-auto w-full px-4 sm:px-6 ${wide ? "max-w-5xl" : "max-w-2xl pt-10"}`}>
        {children}
      </div>
    </main>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="card card-hover p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className={`mt-1.5 truncate font-bold text-white ${mono ? "font-mono text-sm text-gold-300" : ""}`}>{value}</div>
    </div>
  );
}

function ActionCard({ title, busy, children }: { title: string; busy: boolean; children: React.ReactNode }) {
  return (
    <div className={`card flex flex-col gap-3 p-5 transition-opacity ${busy ? "opacity-70" : ""}`}>
      <h3 className="font-bold text-white">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, mono = false, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; mono?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-line bg-ink-900/80 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-flame-400/60 ${mono ? "font-mono" : ""} ${type === "datetime-local" ? "[color-scheme:dark]" : ""}`}
      />
    </label>
  );
}

function Submit({ children, onClick, disabled, busy, small = false }: {
  children: React.ReactNode; onClick: () => void; disabled: boolean; busy: boolean; small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary mt-1 ${small ? "py-2.5 text-xs" : "py-3 text-sm"}`}
    >
      {busy ? "Waiting for wallet…" : children}
    </button>
  );
}
