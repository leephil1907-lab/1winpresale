import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "1win Token ($1WIN) — Token Presale on TRON",
  description:
    "$1WIN is a TRC-20 utility token on TRON powering rewards, cashback, staking and exclusive experiences across the 1win ecosystem. Join the presale.",
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
