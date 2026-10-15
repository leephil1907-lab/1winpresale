# 1win Token ($1WIN) — Presale Website + Smart Contract

Next.js 15 + Tailwind CSS v4 landing page for the $1WIN TRC-20 token presale on
TRON, plus the audited-candidate Solidity presale contract. Dark TRX-style
theme (red / black / gold), full motion design, and a TronLink checkout that is
**gated off until the contract is configured**.

## Run it

```bash
npm install
npm run dev                # http://localhost:3000
npm run build              # production website build
npm run compile:contract   # compile contracts/OneWinPresale.sol → contracts/artifacts/
```

## Project layout

| Path | Purpose |
|---|---|
| `src/components/Header.tsx` | Sticky header, nav, wallet connect (shares wallet state) |
| `src/components/Hero.tsx` + `Countdown.tsx` | Hero, live countdown, stats |
| `src/components/BuyWidget.tsx` | Estimator + TronLink checkout (gated) |
| `src/components/WalletProvider.tsx` | Single TronLink state for header + widget |
| `src/components/Reveal.tsx` | Scroll-reveal motion system |
| `src/components/{About,HowToBuy,Tokenomics,Roadmap,Faq,Footer,Marquee}.tsx` | Page sections |
| `src/lib/tron.ts` | tronWeb detection, unit math, network checks |
| `src/config.ts` | **All public numbers/strings — edit before launch** |
| `contracts/OneWinPresale.sol` | Presale smart contract (TVM-safe, EVM "paris") |
| `contracts/artifacts/` | Compiled ABI + bytecode (input for deployment) |
| `scripts/compile-contract.mjs` | solc-js compile script |
| `public/coin.png` | Coin artwork |

## The presale contract

`contracts/OneWinPresale.sol` is self-contained (no external imports) and
compiles for TRON with `evmVersion: "paris"` (no Shanghai `PUSH0`, which
current TVM releases reject).

**Flow**

| Actor | Function | Notes |
|---|---|---|
| Buyer (TRX) | `buyWithTrx()` / plain transfer (`receive()`) | Priced via owner-set `trxPriceUsd` |
| Buyer (stable) | `approve()` → `buyWithToken(token, amount)` | Whitelisted TRC-20s, 6 decimals |
| Owner | `addStage(priceUsd, bonusBps, start, end)` | Multi-stage pricing |
| Owner | `setAcceptedStable / setTrxPriceUsd / setMinContributionUsd / setFundsWallet` | Config |
| Owner | `sweep(asset)` | Withdraw proceeds; tokens reserved for claims can never be swept |
| Owner | `enableClaim(saleToken)` | After depositing $1WIN at TGE |
| Buyer | `claim()` / `claimable(addr)` | Self-serve distribution |
| Anyone | `previewTokens(usdValue)` | Front-end quote source |

**Safety properties**

- Checks-effects-interactions + reentrancy guard on every value-moving path
- Pausable contributions; entitlements can never be altered by anyone
- Exact-amount approvals, USDT non-zero-allowance quirk handled in the widget
- Contract only *records* entitlements; distribution is buyer-initiated `claim()`

> ⚠️ This is a starting implementation, **not an audit**. Get a professional
> audit before mainnet, and test the full lifecycle on Nile first.

## Deploying (Nile testnet first)

1. `npm run compile:contract` → artifacts in `contracts/artifacts/`
2. Deploy via **TronBox** (`tronbox migrate --network nile`), **Remix + TRON
   plugin**, or `tronweb.contract.new(...)` — constructor args:
   `(_fundsWallet = your treasury address, _minContributionUsd = 25_000_000)` ($25)
3. Post-deploy setup transactions:
   - `addStage(100000, 1000, <startUnix>, <endUnix>)` — $0.10, 10% bonus
   - `setAcceptedStable(<NILE_USDT>, true)`
   - `setTrxPriceUsd(330000)` — $0.33/TRX reference (update per your oracle)
4. Configure the site: `src/config.ts → saleIntegration`
   `network: "nile"`, `contractAddress: "<deployed address>"`, `live: true`
5. Switch TronLink to Nile, fund from the Nile faucet, run a real purchase,
   verify the `Contributed` event + `tokenEntitlement()` on nile.tronscan.org
6. After a clean test + audit: redeploy to mainnet, set `network: "mainnet"`

## Motion design

Pure CSS + IntersectionObserver (`globals.css`, `Reveal.tsx`): staggered hero
entrances, scroll reveals with left/right variants, digit "pops" on value
changes, progress-bar shine, button shine sweeps, card lift/glow hovers,
animated grid backdrop, floating coin, pause-on-hover marquee, donut segment
growth — all disabled under `prefers-reduced-motion`.

## Owner console (`/admin`)

Hidden operator route — **no links to it exist anywhere on the public site**,
it is excluded from search indexing (`noindex`), and access control is enforced
**on-chain**: the page reads `owner()` from the deployed contract and only the
connected wallet that matches sees the dashboard (anyone else gets a
"not the owner wallet" screen; writes revert at the contract level via
`onlyOwner` regardless of the UI).

It shows live contract state (raised, allocations, stages, prices, balances,
stablecoin whitelist, pause/claim status) and exposes every `onlyOwner`
function as a guarded action card: add stage, set TRX price, set minimum,
stablecoin whitelist, funds wallet, sweep, enable claims (TGE), emergency
pause/unpause. All go through TronLink signing — no keys anywhere.

Until a contract address is configured, `/admin` displays the deployment
setup steps instead.

## ⚠️ Before launch checklist

- [ ] `src/config.ts`: real sale numbers, `saleEndDate`, social/whitepaper/audit links
- [ ] Replace `referenceRatesUsd` with live oracle prices (or accept est. quotes)
- [ ] Contract: deploy to Nile → full lifecycle test → professional audit → mainnet
- [ ] Set `links.contractAddress` to the deployed contract (keep "Announced soon" until then)
- [ ] Legal: terms page, restricted jurisdictions, KYC/AML if applicable
- [ ] Only then set `saleIntegration.live: true` + `network: "mainnet"`

## Notes

- Dev server binds `0.0.0.0:3000`; `next.config.ts` allows the sandbox preview host (`*.e2b.app`)
- Fully self-contained (no external fonts/scripts) except `public/coin.png`
