import type { Metadata, Viewport } from "next";
import "./../styles/tokens.css";
import "./../styles/app.css";

export const metadata: Metadata = {
  title: "grindr-plus-plus-mt — the mod, measured",
  description:
    "An open-source client fork for Grindr: spoofed build, rewritten experiment claims, five client-side primitives. GPL-3.0.",
  robots: { index: true, follow: true },
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
