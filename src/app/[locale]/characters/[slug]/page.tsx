import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntry, getAllEntries, splitLocaleContent, type CharacterFrontmatter } from "@/lib/content";
import { StatusBadge, SourceList, LastUpdated } from "@/components/content/status-badge";
import { DetailBreadcrumb } from "@/components/content/page-header";
import { MarkdownContent } from "@/components/content/markdown-content";

// 预生成所有角色详情页
export function generateStaticParams() {
  const entries = getAllEntries<CharacterFrontmatter>("characters");
  return [
    ...entries.map((e) => ({ locale: "zh", slug: e.slug })),
    ...entries.map((e) => ({ locale: "en", slug: e.slug })),
  ];
}

// 动态 SEO metadata：每个角色独立标题描述
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry<CharacterFrontmatter>("characters", slug);
  if (!entry) return {};

  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
  };
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pages.characters");
  const tCommon = await getTranslations("common");
  const tStatus = await getTranslations({ locale, namespace: "common.status" });

  const entry = getEntry<CharacterFrontmatter>("characters", slug);
  if (!entry) notFound();

  const fm = entry.frontmatter;
  const title = locale === "zh" ? fm.title : fm.title_en;

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <DetailBreadcrumb
          items={[
            { label: t("title"), href: `/${locale}/characters` },
            { label: title },
          ]}
        />

        <header className="mt-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {fm.type === "protagonist"
                  ? t("protagonist")
                  : t("supporting")}
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
            </div>
            <StatusBadge status={fm.status} labels={{ confirmed: tStatus("confirmed"), speculated: tStatus("speculated"), leaked: tStatus("leaked") }} />
          </div>

          <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300">
            {locale === "zh" ? fm.summary : fm.summary_en || fm.summary}
          </p>

          {/* 能力列表 */}
          {fm.abilities && fm.abilities.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {tCommon("abilities")}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {fm.abilities.map((ability, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {locale === "zh" ? ability.zh : ability.en}
                  </span>
                ))}
              </div>
            </div>
          )}

          <LastUpdated date={fm.last_updated} label={tCommon("lastUpdated")} />
        </header>

        <MarkdownContent content={splitLocaleContent(entry.content, locale as "zh" | "en")} />

        <SourceList sources={fm.sources || []} label={tCommon("sources")} locale={locale as "zh" | "en"} />

        <div className="mt-8">
          <Link
            href={`/${locale}/characters`}
            className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            ← {tCommon("backToList")}
          </Link>
        </div>
      </article>
    </main>
  );
}
