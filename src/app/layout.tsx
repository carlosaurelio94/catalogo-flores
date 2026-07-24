import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Dancing_Script,
  Great_Vibes,
  Jost,
  Lora,
  Parisienne,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--f-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const playfair = Playfair_Display({
  variable: "--f-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const lora = Lora({
  variable: "--f-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const jost = Jost({
  variable: "--f-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});
const parisienne = Parisienne({
  variable: "--f-parisienne",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const greatVibes = Great_Vibes({
  variable: "--f-greatvibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const dancing = Dancing_Script({
  variable: "--f-dancing",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Editor de catálogo",
  description: "Editá tu catálogo y descargá las 4 páginas en PDF",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${playfair.variable} ${lora.variable} ${jost.variable} ${parisienne.variable} ${greatVibes.variable} ${dancing.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
