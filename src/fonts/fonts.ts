import localFont from "next/font/local";

// Self hosted Latin subsets (incl. ä ö ü ß €), SIL Open Font License, see OFL-*.txt.
// Source: Fontsource variable packages (wght axis), see docs/DECISIONS.md.

export const googleSansFlex = localFont({
  src: "./GoogleSansFlex-latin-wght.woff2",
  weight: "100 1000",
  style: "normal",
  display: "swap",
  variable: "--font-google-sans-flex",
});

export const inter = localFont({
  src: "./Inter-latin-wght.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
});
