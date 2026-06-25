import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAllEntries, type NewsFrontmatter } from "@/lib/content";
import { PageHeader } from "@/components/content/page-header";
import { StatusBadge } from "@/components/content/status-badge";

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pages.news");
  const tCommon = await getTranslations("common");
  const tStatus = await getTranslations({ locale, namespace: "common.status" });

  const news = getAllEntries<NewsFrontmatter>("news").sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  );

  return (
    <main className="flex-1">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {news.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            {tCommon("noContent")}
          </p>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group block rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <time dateTime={item.frontmatter.date}>
                        {item.frontmatter.date}
                      </time>
                      {item.frontmatter.author && (
                        <span>· {item.frontmatter.author}</span>
                      )}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                      {locale === "zh"
                        ? item.frontmatter.title
                        : item.frontmatter.title_en}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {locale === "zh"
                        ? item.frontmatter.summary
                        : item.frontmatter.summary_en || item.frontmatter.summary}
                    </p>
                  </div>
                  <StatusBadge
                    status={item.frontmatter.status}
                    labels={{ confirmed: tStatus("confirmed"), speculated: tStatus("speculated"), leaked: tStatus("leaked") }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
