import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-sm font-bold text-zinc-950">
                6
              </span>
              GTA6 Companion
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t("disclaimer")}
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <Link
              href="/about"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {t("links.about")}
            </Link>
            <Link
              href="/privacy"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {t("links.privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {t("links.terms")}
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-6 text-xs text-zinc-400 dark:border-zinc-800">
          © {new Date().getFullYear()} GTA6 Companion. {t("rights")}.
        </div>
      </div>
    </footer>
  );
}
