import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAllEntries, type ActivityFrontmatter } from "@/lib/content";
import { PageHeader } from "@/components/content/page-header";
import { StatusBadge } from "@/components/content/status-badge";

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pages.activities");
  const tCommon = await getTranslations("common");
  const tStatus = await getTranslations({ locale, namespace: "common.status" });

  const activities = getAllEntries<ActivityFrontmatter>("activities");

  // 按类别分组以便浏览
  const categories = ["sports", "water", "nightlife", "gambling", "criminal", "social"] as const;
  const grouped = categories.map((cat) => ({
    category: cat,
    label: t(`categories.${cat}`),
    items: activities.filter((a) => a.frontmatter.category === cat),
  }));

  return (
    <main className="flex-1">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {activities.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            {tCommon("noContent")}
          </p>
        ) : (
          <div className="space-y-10">
            {grouped.map(
              (group) =>
                group.items.length > 0 && (
                  <section key={group.category}>
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {group.label}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {group.items.map((activity) => (
                        <Link
                          key={activity.slug}
                          href={`/activities/${activity.slug}`}
                          className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                              {locale === "zh"
                                ? activity.frontmatter.title
                                : activity.frontmatter.title_en}
                            </h3>
                            <StatusBadge
                              status={activity.frontmatter.status}
                              labels={{ confirmed: tStatus("confirmed"), speculated: tStatus("speculated"), leaked: tStatus("leaked") }}
                            />
                          </div>
                          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                            {locale === "zh"
                              ? activity.frontmatter.summary
                              : activity.frontmatter.summary_en || activity.frontmatter.summary}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}
