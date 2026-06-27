import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import SubscribeForm from "@/components/subscribe/subscribe-form";
import { PageHeader } from "@/components/content/page-header";

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.subscribe" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pages.subscribe" });

  return (
    <main className="flex-1">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* 价值主张 */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">
            {t("benefitsTitle")}
          </h2>
          <ul className="space-y-3">
            {(["benefit1", "benefit2", "benefit3", "benefit4"] as const).map((key) => (
              <li key={key} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500/15 text-sm text-emerald-600 dark:text-emerald-400">
                  ✓
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {t(key)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 订阅表单 */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <SubscribeForm
            labels={{
              emailLabel: t("emailLabel"),
              emailPlaceholder: t("emailPlaceholder"),
              submitButton: t("submitButton"),
              submitting: t("submitting"),
              success: t("success"),
              error: t("error"),
              invalidEmail: t("invalidEmail"),
            }}
          />
        </section>

        {/* 信任提示 */}
        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {t("privacyNote")}
        </p>
      </div>
    </main>
  );
}
