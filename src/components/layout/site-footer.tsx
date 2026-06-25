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

          {/* 注：about/privacy/terms 页面尚未创建，先以纯文本展示，避免 Next.js prefetch 不存在的 RSC 路由导致 404 中断 hydration */}
          <div className="flex flex-col gap-2 text-sm text-zinc-400 dark:text-zinc-500">
            <span>{t("links.about")}</span>
            <span>{t("links.privacy")}</span>
            <span>{t("links.terms")}</span>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-6 text-xs text-zinc-400 dark:border-zinc-800">
          © {new Date().getFullYear()} GTA6 Companion. {t("rights")}.
        </div>
      </div>
    </footer>
  );
}
