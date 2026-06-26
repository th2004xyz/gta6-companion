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
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pages.about" });

  return (
    <main className="flex-1">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <article className="prose prose-zinc max-w-none dark:prose-invert">
          <h2>{t("missionTitle")}</h2>
          <p>{t("mission")}</p>

          <h2>{t("whatWeDoTitle")}</h2>
          <ul>
            <li>{t("feature1")}</li>
            <li>{t("feature2")}</li>
            <li>{t("feature3")}</li>
            <li>{t("feature4")}</li>
          </ul>

          <h2>{t("disclaimerTitle")}</h2>
          <p>{t("disclaimer")}</p>
        </article>
      </div>
    </main>
  );
}
