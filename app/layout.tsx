import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tenex Market | Trade Forex, Metals, Crypto & Indices",
  description:
    "Trade forex, metals, crypto, indices, stocks and commodities on MT5 with tight spreads, fast execution and 24/7 support.",
};

export const viewport: Viewport = { themeColor: "#0866C5", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
