import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Countdown from "./_components/countdown";
import { VideoGameJsonLd, FaqJsonLd } from "@/components/seo/json-ld";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tFaq = await getTranslations({ locale, namespace: "faq" });

  // FAQ 内容用于结构化数据与页面渲染
  const faqItems = tFaq.raw("items") as { question: string; answer: string }[];

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

      {/* 特性区块 */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard
            title={t("features.mapTitle")}
            desc={t("features.mapDesc")}
            icon="map"
          />
          <FeatureCard
            title={t("features.syncTitle")}
            desc={t("features.syncDesc")}
            icon="sync"
          />
          <FeatureCard
            title={t("features.seoTitle")}
            desc={t("features.seoDesc")}
            icon="info"
          />
        </div>
      </section>

      {/* 订阅 CTA */}
      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
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

      {/* FAQ 区块 */}
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

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: "map" | "sync" | "info";
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <FeatureIcon name={icon} />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
    </div>
  );
}

function FeatureIcon({ name }: { name: "map" | "sync" | "info" }) {
  const paths: Record<string, React.ReactNode> = {
    map: (
      <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    ),
    sync: (
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    ),
    info: (
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  };
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      {paths[name]}
    </svg>
  );
}
