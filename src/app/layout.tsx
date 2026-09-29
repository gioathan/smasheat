import type { Metadata, Viewport } from "next";
import { Archivo_Narrow, Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const headlineFont = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

const labelFont = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const copyFont = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smasheat · Smash Burgers in Patras · Notara 60",
  description:
    "Smasheat is the smash burger house of Patras. 100% beef patties smashed to order, buttermilk fried chicken burgers, loaded fries and seven house dips. Notara 60 · Tue–Sun 17:00–00:00.",
};

export const viewport: Viewport = {
  themeColor: "#FFF4E6",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${headlineFont.variable} ${labelFont.variable} ${copyFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
