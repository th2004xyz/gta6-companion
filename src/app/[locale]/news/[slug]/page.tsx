import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntry, getAllEntries, splitLocaleContent, type NewsFrontmatter } from "@/lib/content";
import { StatusBadge, SourceList } from "@/components/content/status-badge";
import { DetailBreadcrumb } from "@/components/content/page-header";
import { MarkdownContent } from "@/components/content/markdown-content";
import { PurchaseLinks } from "@/components/content/purchase-links";
import { NewsArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";

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
  const tFaq = await getTranslations("faq");

  const entry = getEntry<NewsFrontmatter>("news", slug);
  if (!entry) notFound();

  const fm = entry.frontmatter;
  const title = locale === "zh" ? fm.title : fm.title_en;
  const faqs = (fm.faqs || []).map((f) => ({
    question: locale === "zh" ? f.question.zh : f.question.en,
    answer: locale === "zh" ? f.answer.zh : f.answer.en,
  }));

  return (
    <main className="flex-1">
      <NewsArticleJsonLd
        title={title}
        description={locale === "zh" ? fm.summary : fm.summary_en || fm.summary}
        datePublished={fm.date}
        dateModified={fm.last_updated}
        author={fm.author}
        url={`https://gta6.sohou.xyz/${locale}/news/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: t("title"), url: `https://gta6.sohou.xyz/${locale}/news` },
          { name: title, url: `https://gta6.sohou.xyz/${locale}/news/${slug}` },
        ]}
      />
      {faqs.length > 0 && <FaqJsonLd faqs={faqs} />}
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

        {faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">{tFaq("title")}</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-white/10 bg-[#14141c] px-4 py-3 open:border-fuchsia-500/40"
                >
                  <summary className="cursor-pointer list-none text-sm font-medium text-zinc-100 marker:hidden [&::-webkit-details-marker]:hidden">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {fm.purchaseLinks && <PurchaseLinks locale={locale as "zh" | "en"} />}

        <SourceList sources={fm.sources || []} label={tCommon("sources")} locale={locale as "zh" | "en"} />

        <div className="mt-8">
          <Link
            href={`/${locale}/news`}
            className="text-sm font-medium text-cyan-400 hover:underline"
          >
            ← {tCommon("backToList")}
          </Link>
        </div>
      </article>
    </main>
  );
}
