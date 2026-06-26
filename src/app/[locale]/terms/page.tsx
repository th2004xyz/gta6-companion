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
  const t = await getTranslations({ locale, namespace: "pages.terms" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pages.terms" });

  return (
    <main className="flex-1">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <article className="prose prose-zinc max-w-none dark:prose-invert">
          <h2>{t("acceptTitle")}</h2>
          <p>{t("accept")}</p>

          <h2>{t("serviceTitle")}</h2>
          <p>{t("service")}</p>

          <h2>{t("ipTitle")}</h2>
          <p>{t("ip")}</p>

          <h2>{t("limitationTitle")}</h2>
          <p>{t("limitation")}</p>

          <h2>{t("changesTitle")}</h2>
          <p>{t("changes")}</p>
        </article>
      </div>
    </main>
  );
}
