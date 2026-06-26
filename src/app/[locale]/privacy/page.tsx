import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
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
  const t = await getTranslations({ locale, namespace: "pages.privacy" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pages.privacy" });

  return (
    <main className="flex-1">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <article className="prose prose-zinc max-w-none dark:prose-invert">
          <h2>{t("collectTitle")}</h2>
          <p>{t("collect")}</p>

          <h2>{t("useTitle")}</h2>
          <p>{t("use")}</p>

          <h2>{t("shareTitle")}</h2>
          <p>{t("share")}</p>

          <h2>{t("retainTitle")}</h2>
          <p>{t("retain")}</p>

          <h2>{t("rightsTitle")}</h2>
          <p>{t("rights")}</p>

          <h2>{t("contactTitle")}</h2>
          <p>{t("contact")}</p>
        </article>
      </div>
    </main>
  );
}
