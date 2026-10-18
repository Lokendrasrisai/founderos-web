import localFont from "next/font/local";

/**
 * Self-hosted Geist (SIL OFL) from the official `geist` package — no third-party font requests.
 * Sans is preloaded (it renders the headline/LCP). Mono is used only for small metadata, so it ships
 * as a single static weight and is not preloaded.
 */
export const fontSans = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const fontMono = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2",
  variable: "--font-geist-mono",
  weight: "400",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
