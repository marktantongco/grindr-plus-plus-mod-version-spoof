import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://web-theta-livid-46.vercel.app"),
  title: "Grindr++ Version Spoof Mod — compiled 26.24.0 spoof + JWT engine",
  description:
    "Grindr++ fork with the 26.24.0/195444 version spoof compiled into the build, a client-side JWT experiment engine, and a repaired album path. Device-measured. GPL-3.0.",
  keywords: [
    "grindr plus plus",
    "grindr mod",
    "version spoof",
    "grindrplus",
    "lspatch module",
    "android",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://marktantongco.github.io/grindr-plus-plus-mod-version-spoof/",
  },
  openGraph: {
    type: "website",
    title: "Grindr++ Version Spoof Mod — compiled 26.24.0 spoof + JWT engine",
    description:
      "Compiled version spoof, client-side JWT experiment engine, repaired album path. Device-measured.",
    url: "https://marktantongco.github.io/grindr-plus-plus-mod-version-spoof/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#12100f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
