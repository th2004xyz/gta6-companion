import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import MobileTabBarWrapper from "@/components/layout/mobile-tab-bar-wrapper";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // FOIT 避免，提升 LCP
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// 预生成所有 locale 的静态页面，利于 SEO
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 动态 metadata：根据 locale 渲染对应语言的标题与描述
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gta6-companion.example.com"),
    manifest: "/manifest.json",
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "GTA6 Companion",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      images: ["/og/default.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og/default.jpg"],
    },
  };
}

// viewport 配置：themeColor 移至此处（Next.js 16 要求）
export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 校验 locale 合法性，非法则 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // 启用静态渲染，告知当前 locale
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <SiteHeader locale={locale} />
          <div className="flex flex-1 flex-col pb-14 sm:pb-0">{children}</div>
          <SiteFooter />
          <MobileTabBarWrapper locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
