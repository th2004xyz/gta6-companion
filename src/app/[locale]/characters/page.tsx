import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAllEntries, type CharacterFrontmatter } from "@/lib/content";
import { PageHeader } from "@/components/content/page-header";
import { StatusBadge } from "@/components/content/status-badge";

// 预生成所有 locale 的静态列表页
export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function CharactersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pages.characters");
  const tCommon = await getTranslations("common");
  const tStatus = await getTranslations({ locale, namespace: "common.status" });

  const characters = getAllEntries<CharacterFrontmatter>("characters");

  return (
    <main className="flex-1">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {characters.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            {tCommon("noContent")}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {characters.map((char) => (
              <Link
                key={char.slug}
                href={`/${locale}/characters/${char.slug}`}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {char.frontmatter.type === "protagonist"
                        ? t("protagonist")
                        : t("supporting")}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                      {locale === "zh"
                        ? char.frontmatter.title
                        : char.frontmatter.title_en}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {locale === "zh"
                        ? char.frontmatter.summary
                        : char.frontmatter.summary_en || char.frontmatter.summary}
                    </p>
                  </div>
                  <StatusBadge
                    status={char.frontmatter.status}
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
