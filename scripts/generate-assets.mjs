/**
 * Generates all app/share iconography from public/coin.png:
 *   src/app/apple-icon.png              (180×180 — iOS / macOS touch icon)
 *   public/icons/icon-192.png           (PWA icon)
 *   public/icons/icon-512.png           (PWA icon)
 *   public/icons/icon-512-maskable.png  (PWA maskable icon)
 *   public/og.png                       (1200×630 — Open Graph / Twitter card)
 *
 * Run:  node scripts/generate-assets.mjs
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const COIN = "public/coin.png";
mkdirSync("public/icons", { recursive: true });

/* ---------- 1) square icons — center-crop of the coin artwork ---------- */
const meta = await sharp(COIN).metadata();
const side = Math.min(meta.width, meta.height);
const crop = sharp(COIN).extract({
  left: Math.floor((meta.width - side) / 2),
  top: Math.floor((meta.height - side) / 2),
  width: side,
  height: side,
});

await crop.clone().resize(180, 180).png().toFile("src/app/apple-icon.png");
await crop.clone().resize(192, 192).png().toFile("public/icons/icon-192.png");
await crop.clone().resize(512, 512).png().toFile("public/icons/icon-512.png");

// maskable: ~78% safe zone — coin at 400px centered on the brand background
const maskBase = Buffer.from(
  `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
     <rect width="512" height="512" fill="#080506"/>
   </svg>`
);
const coinSmall = await crop.clone().resize(400, 400).png().toBuffer();
await sharp(maskBase)
  .composite([{ input: coinSmall, left: 56, top: 56 }])
  .png()
  .toFile("public/icons/icon-512-maskable.png");

/* ---------- 2) Open Graph share card (1200×630) ---------- */
const ogSvg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e080b"/>
      <stop offset="1" stop-color="#080506"/>
    </linearGradient>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff8a8a"/>
      <stop offset="0.45" stop-color="#ff2433"/>
      <stop offset="1" stop-color="#f6c453"/>
    </linearGradient>
    <filter id="blur80" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="rgba(255,130,130,0.055)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <ellipse cx="290" cy="300" rx="310" ry="300" fill="#e50914" opacity="0.20" filter="url(#blur80)"/>
  <ellipse cx="1120" cy="640" rx="280" ry="240" fill="#f6c453" opacity="0.08" filter="url(#blur80)"/>

  <!-- wordmark -->
  <text x="540" y="182" font-family="DejaVu Sans, sans-serif" font-size="26" font-weight="bold"
        fill="#ff8a8a" letter-spacing="7">1WIN TOKEN · TRC-20</text>

  <!-- headline -->
  <text x="536" y="318" font-family="DejaVu Sans, sans-serif" font-size="112" font-weight="bold"
        fill="url(#grad)" letter-spacing="2">$1WIN</text>
  <text x="540" y="386" font-family="DejaVu Sans, sans-serif" font-size="36" font-weight="bold"
        fill="#ffffff" letter-spacing="3">PRESALE LIVE ON TRON</text>

  <!-- stage pill -->
  <rect x="540" y="428" width="246" height="54" rx="27" fill="#e50914"/>
  <circle cx="571" cy="455" r="7" fill="#ffffff"/>
  <text x="592" y="463" font-family="DejaVu Sans, sans-serif" font-size="21" font-weight="bold"
        fill="#ffffff" letter-spacing="2">STAGE 1 LIVE</text>

  <!-- tagline + domain -->
  <text x="540" y="538" font-family="DejaVu Sans, sans-serif" font-size="20"
        fill="#94a3b8">Rewards, cashback &amp; staking in the 1win ecosystem</text>
  <text x="1140" y="592" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="bold"
        fill="#64748b" text-anchor="end">1wintoken.com</text>
</svg>`);

// coin with feathered (radial-fade) alpha so it blends into the card backdrop
const ogCoinRaw = await crop.clone().resize(460, 460).png().toBuffer();
const radialMask = Buffer.from(
  `<svg width="460" height="460" xmlns="http://www.w3.org/2000/svg">
     <radialGradient id="fade" cx="50%" cy="48%" r="52%">
       <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
       <stop offset="64%" stop-color="#ffffff" stop-opacity="1"/>
       <stop offset="97%" stop-color="#ffffff" stop-opacity="0"/>
     </radialGradient>
     <rect width="460" height="460" fill="url(#fade)"/>
   </svg>`
);
const ogCoin = await sharp(ogCoinRaw)
  .composite([{ input: radialMask, blend: "dest-in" }])
  .png()
  .toBuffer();
await sharp(ogSvg)
  .composite([{ input: ogCoin, left: 55, top: 85 }])
  .png()
  .toFile("public/og.png");

console.log("ASSETS_OK");
console.log(" - src/app/apple-icon.png (180)");
console.log(" - public/icons/icon-192.png / icon-512.png / icon-512-maskable.png");
console.log(" - public/og.png (1200×630)");
