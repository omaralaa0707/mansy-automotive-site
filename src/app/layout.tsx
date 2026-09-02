import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Lalezar, Alexandria } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/i18n/locale-provider";
import { ScrollProvider } from "@/components/motion/scroll-provider";
import { ar } from "@/content/ar";
import { en } from "@/content/en";

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
});
const lalezar = Lalezar({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  variable: "--font-lalezar",
});
const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-alexandria",
});

export const metadata: Metadata = {
  title: "Mansy Automotive — Specifications, and nothing else",
  description:
    "Four cars, four powertrains, and no adjectives anywhere. A comparison built entirely from the figures they publish.",
  metadataBase: new URL("https://mansy-automotive-site.vercel.app"),
  icons: { icon: "/mark.svg" },
  openGraph: {
    title: "Mansy Automotive — Specifications, and nothing else",
    description: "Four cars compared on the figures they published.",
    images: ["/media/showroom.jpg"],
    locale: "ar_EG",
    type: "website",
  },
  other: { "theme-color": "#f0ecea" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // translate="no": the page ships hand-written Arabic and English, and
    // Chrome's auto-translate rewrites `lang`, which would also break every
    // [dir="rtl"] correction if the CSS were keyed off language instead.
    <html
      lang="ar"
      dir="rtl"
      translate="no"
      className={`notranslate ${syne.variable} ${jakarta.variable} ${lalezar.variable} ${alexandria.variable}`}
    >
      <body className="bg-plaster text-ink antialiased">
        {/* Figures read out under an intersection observer, so without
            scripting every one of them would stay at opacity 0. */}
        <noscript>
          <style>{`[data-readout],[data-rule]{opacity:1!important;transform:none!important;animation:none!important}`}</style>
        </noscript>
        <LocaleProvider dictionaries={{ ar, en }} defaultLocale="ar">
          <ScrollProvider />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
