import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Countdown from "./_components/countdown";
import { VideoGameJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import {
  getAllEntries,
  type CharacterFrontmatter,
  type VehicleFrontmatter,
  type ActivityFrontmatter,
  type NewsFrontmatter,
  type Collection,
} from "@/lib/content";
import weeklyUpdates from "@/data/weekly-updates.json";
import type { Locale } from "@/i18n/routing";

// 本周更新数据结构（与 src/data/weekly-updates.json 对应）
interface WeeklyUpdateItem {
  date: string;
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
  link?: { collection: Collection; slug: string };
}
interface WeeklyUpdatesData {
  weekLabel: { zh: string; en: string };
  updates: WeeklyUpdateItem[];
}

const WEEKLY_UPDATES = weeklyUpdates as WeeklyUpdatesData;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const t = await getTranslations("home");
  const tFaq = await getTranslations({ locale, namespace: "faq" });

  // FAQ 内容用于结构化数据与页面渲染
  const faqItems = tFaq.raw("items") as { question: string; answer: string }[];

  // 最新情报：取最新 2 条 news（按 date 倒序）
  const latestNews = getAllEntries<NewsFrontmatter>("news")
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
    .slice(0, 2);

  // 内容统计：confirmed / total 双数字
  const characterStats = countByStatus(getAllEntries<CharacterFrontmatter>("characters"));
  const vehicleStats = countByStatus(getAllEntries<VehicleFrontmatter>("vehicles"));
  const activityStats = countByStatus(getAllEntries<ActivityFrontmatter>("activities"));

  return (
    <main className="flex-1">
      <VideoGameJsonLd />
      <FaqJsonLd faqs={faqItems} />

      {/* Hero 区块 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
              {t("heroTitle")}
            </h1>

            <p className="max-w-2xl text-base text-zinc-300 sm:text-lg">
              {t("heroSubtitle")}
            </p>

            {/* 双倒计时组件：预购状态 + 距发售日 */}
            <Countdown
              labels={{
                preorderLive: t("preorderLive"),
                preorderUpcoming: t("preorderUpcoming"),
                releaseCountdown: t("releaseCountdown"),
                released: t("released"),
                days: t("days"),
                hours: t("hours"),
                minutes: t("minutes"),
                seconds: t("seconds"),
              }}
            />

            {/* 最新情报：server component，直渲最新 2 条 news 标题 + 日期 */}
            <div className="mt-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
                  {t("latestIntel")}
                </h2>
                <Link
                  href={`/${locale}/news`}
                  className="text-xs text-zinc-400 transition hover:text-emerald-400"
                >
                  {t("latestIntelViewAll")} →
                </Link>
              </div>
              <ul className="mt-3 space-y-2">
                {latestNews.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/${locale}/news/${item.slug}`}
                      className="flex items-baseline justify-between gap-3 text-sm transition hover:text-emerald-400"
                    >
                      <span className="line-clamp-1 text-zinc-200">
                        {locale === "zh"
                          ? item.frontmatter.title
                          : item.frontmatter.title_en}
                      </span>
                      <time
                        dateTime={item.frontmatter.date}
                        className="shrink-0 text-xs text-zinc-500"
                      >
                        {item.frontmatter.date}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/map"
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-500 px-6 font-medium text-zinc-950 transition hover:bg-emerald-400"
              >
                {t("exploreMap")}
              </Link>
              <Link
                href="/subscribe"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-700 px-6 font-medium text-white transition hover:border-zinc-600 hover:bg-zinc-800"
              >
                {t("cta.subscribe")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 内容统计入口（替代原 FeatureCard） */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <StatsCard
            href={`/${locale}/characters`}
            confirmed={characterStats.confirmed}
            total={characterStats.total}
            label={t("stats.charactersLabel")}
            icon="character"
          />
          <StatsCard
            href={`/${locale}/vehicles`}
            confirmed={vehicleStats.confirmed}
            total={vehicleStats.total}
            label={t("stats.vehiclesLabel")}
            icon="vehicle"
          />
          <StatsCard
            href={`/${locale}/activities`}
            confirmed={activityStats.confirmed}
            total={activityStats.total}
            label={t("stats.activitiesLabel")}
            icon="activity"
          />
        </div>
      </section>

      {/* 本周更新时间线 */}
      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("weeklyUpdates")}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {WEEKLY_UPDATES.weekLabel[typedLocale]}
          </p>

          <ol className="mt-8 space-y-6 border-l border-zinc-200 pl-6 dark:border-zinc-700">
            {WEEKLY_UPDATES.updates.map((item, idx) => {
              const title = item.title[typedLocale];
              const summary = item.summary[typedLocale];
              const content = (
                <div className="group">
                  <div className="flex items-baseline gap-2">
                    <time
                      dateTime={item.date}
                      className="text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      {item.date}
                    </time>
                  </div>
                  <h3 className="mt-1 font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {summary}
                  </p>
                </div>
              );
              return (
                <li key={idx} className="relative">
                  {/* 时间线节点圆点 */}
                  <span className="absolute -left-[1.625rem] top-1 h-3 w-3 rounded-full border-2 border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900" />
                  {item.link ? (
                    <Link
                      href={`/${locale}/${item.link.collection}/${item.link.slug}`}
                      className="block"
                    >
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 订阅 CTA */}
      <section className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("cta.subscribe")}
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            {t("cta.subscribeDesc")}
          </p>
          <Link
            href="/subscribe"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {t("cta.subscribe")}
          </Link>
        </div>
      </section>

      {/* FAQ 区块（移至页面最底部） */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          {tFaq("title")}
        </h2>
        <div className="space-y-6">
          {faqItems.map((faq, idx) => (
            <div key={idx}>
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// 按 status 统计 confirmed 数量与总数
function countByStatus<T extends { frontmatter: { status: string } }>(
  entries: T[],
): { confirmed: number; total: number } {
  return {
    confirmed: entries.filter((e) => e.frontmatter.status === "confirmed").length,
    total: entries.length,
  };
}

function StatsCard({
  href,
  confirmed,
  total,
  label,
  icon,
}: {
  href: string;
  confirmed: number;
  total: number;
  label: string;
  icon: "character" | "vehicle" | "activity";
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <StatsIcon name={icon} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums">{confirmed}</span>
        <span className="text-lg font-medium text-zinc-400">/ {total}</span>
      </div>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
    </Link>
  );
}

function StatsIcon({ name }: { name: "character" | "vehicle" | "activity" }) {
  const paths: Record<string, React.ReactNode> = {
    // 角色：人形
    character: (
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    // 载具：汽车轮廓
    vehicle: (
      <path d="M3 13l1.5-4.5A2 2 0 016.4 7h11.2a2 2 0 011.9 1.5L21 13M3 13h18M3 13v4a1 1 0 001 1h1a1 1 0 001-1v-1m12 1a1 1 0 001 1h1a1 1 0 001-1v-1M6 18h12M6 18v1m12-1v1" />
    ),
    // 活动：星星
    activity: (
      <path d="M11.48 3.5a.6.6 0 011.04 0l2.2 4.46 4.92.72a.6.6 0 01.33 1.02l-3.56 3.47.84 4.9a.6.6 0 01-.87.63L12 16.9l-4.4 2.32a.6.6 0 01-.87-.63l.84-4.9L3.99 9.7a.6.6 0 01.33-1.02l4.92-.72 2.24-4.46z" />
    ),
  };
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
