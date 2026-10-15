import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { site } from "@/config";

const title = `${site.tokenName} (${site.ticker}) — Token Presale on TRON`;
const description =
  "Independent TRON-based concept for a $1WIN-style token sale. This is not the official 1win token sale; sale participation remains unavailable until contract and terms are verified.";

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: {
    default: title,
    template: `%s · ${site.tokenName}`,
  },
  description,
  applicationName: site.tokenName,
  keywords: [
    "1win token",
    "$1WIN",
    "1win presale",
    "TRC-20",
    "TRON token",
    "crypto presale",
    "1win ecosystem",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.tokenName,
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.tokenName} — independent TRON concept; sale not configured`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#080506",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
