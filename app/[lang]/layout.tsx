import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales } from "@/lib/i18n-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
});

type Props = LayoutProps<"/[lang]">;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <Preloader />
        <SmoothScroll />
        <ScrollProgress />
        <CursorGlow />
        <div className="grain-overlay" aria-hidden="true" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
        <LocaleProvider locale={lang} dict={dict}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
