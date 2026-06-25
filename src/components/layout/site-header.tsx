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

  const navItems = [
    { href: "/map", label: t("map") },
    { href: "/characters", label: t("characters") },
    { href: "/vehicles", label: t("vehicles") },
    { href: "/activities", label: t("activities") },
    { href: "/news", label: t("news") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-sm font-bold text-zinc-950">
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
            href="/subscribe"
            className="ml-1 inline-flex h-8 items-center justify-center rounded-full bg-emerald-500 px-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
          >
            {t("subscribe")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
