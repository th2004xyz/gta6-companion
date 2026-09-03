import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAllEntries, type NewsFrontmatter } from "@/lib/content";
import { PageHeader } from "@/components/content/page-header";
import NewsFilterList, { type NewsFilterItem } from "./news-filter";

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
  const tStatus = await getTranslations({ locale, namespace: "common.status" });

  const news = getAllEntries<NewsFrontmatter>("news").sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  );

  // 序列化为客户端组件可用的扁平数据（title/summary 按语言取好）
  const items: NewsFilterItem[] = news.map((item) => ({
    slug: item.slug,
    date: item.frontmatter.date,
    author: item.frontmatter.author,
    title:
      locale === "zh" ? item.frontmatter.title : item.frontmatter.title_en,
    summary:
      locale === "zh"
        ? item.frontmatter.summary
        : item.frontmatter.summary_en || item.frontmatter.summary,
    status: item.frontmatter.status,
    tags: item.frontmatter.tags || [],
  }));

  return (
    <main className="flex-1">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <NewsFilterList
          items={items}
          locale={locale}
          labels={{
            all: locale === "zh" ? "全部" : "All",
            confirmed: tStatus("confirmed"),
            speculated: tStatus("speculated"),
            leaked: tStatus("leaked"),
          }}
        />
      </div>
    </main>
  );
}
