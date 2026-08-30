import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/routing";
import LanguageSwitcher from "./language-switcher";

export default async function SiteHeader({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations("nav");

  // 链接统一携带 locale 前缀，避免中间件二次重定向（SEO 友好）
  const navItems = [
    { href: `/${locale}/map`, label: t("map") },
    { href: `/${locale}/characters`, label: t("characters") },
    { href: `/${locale}/vehicles`, label: t("vehicles") },
    { href: `/${locale}/activities`, label: t("activities") },
    { href: `/${locale}/news`, label: t("news") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ff2d78] text-sm font-bold text-zinc-950">
            6
          </span>
          <span className="hidden sm:inline">GTA6 Companion</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {/* 桌面端导航 */}
          <div className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* LanguageSwitcher 内部使用 useSearchParams，需 Suspense 包裹 */}
          <Suspense fallback={<div className="h-8 w-16" />}>
            <LanguageSwitcher currentLocale={locale} locales={locales} />
          </Suspense>

          <Link
            href={`/${locale}/subscribe`}
            className="ml-1 inline-flex h-8 items-center justify-center rounded-full bg-[#ff2d78] px-3 text-sm font-medium text-zinc-950 transition hover:bg-[#ff5c9a]"
          >
            {t("subscribe")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
