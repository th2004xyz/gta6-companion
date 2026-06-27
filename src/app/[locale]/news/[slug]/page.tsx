import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntry, getAllEntries, splitLocaleContent, type NewsFrontmatter } from "@/lib/content";
import { StatusBadge, SourceList } from "@/components/content/status-badge";
import { DetailBreadcrumb } from "@/components/content/page-header";
import { MarkdownContent } from "@/components/content/markdown-content";

export function generateStaticParams() {
  const entries = getAllEntries<NewsFrontmatter>("news");
  return [
    ...entries.map((e) => ({ locale: "zh", slug: e.slug })),
    ...entries.map((e) => ({ locale: "en", slug: e.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry<NewsFrontmatter>("news", slug);
  if (!entry) return {};

  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
    // 新闻类页面标记为 article 类型，利于搜索引擎与社交分享
    openGraph: {
      type: "article",
      title: entry.frontmatter.title,
      description: entry.frontmatter.summary,
      publishedTime: entry.frontmatter.date,
      authors: entry.frontmatter.author ? [entry.frontmatter.author] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pages.news");
  const tCommon = await getTranslations("common");
  const tStatus = await getTranslations({ locale, namespace: "common.status" });

  const entry = getEntry<NewsFrontmatter>("news", slug);
  if (!entry) notFound();

  const fm = entry.frontmatter;
  const title = locale === "zh" ? fm.title : fm.title_en;

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <DetailBreadcrumb
          items={[
            { label: t("title"), href: `/${locale}/news` },
            { label: title },
          ]}
        />

        <header className="mt-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <time dateTime={fm.date}>{fm.date}</time>
                {fm.author && (
                  <span>· {fm.author}</span>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
            </div>
            <StatusBadge status={fm.status} labels={{ confirmed: tStatus("confirmed"), speculated: tStatus("speculated"), leaked: tStatus("leaked") }} />
          </div>

          <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300">
            {locale === "zh" ? fm.summary : fm.summary_en || fm.summary}
          </p>
        </header>

        <MarkdownContent content={splitLocaleContent(entry.content, locale as "zh" | "en")} />

        <SourceList sources={fm.sources || []} label={tCommon("sources")} />

        <div className="mt-8">
          <Link
            href={`/${locale}/news`}
            className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            ← {tCommon("backToList")}
          </Link>
        </div>
      </article>
    </main>
  );
}
