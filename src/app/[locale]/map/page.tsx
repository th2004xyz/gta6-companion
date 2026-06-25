import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import mapMarkersData from "@/data/map-markers.json";
import { type MapMarker } from "@/lib/map";
import MapView from "@/components/map/map-view-client";

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.map" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pages.map" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tStatus = await getTranslations({ locale, namespace: "common.status" });

  // 转换 JSON 数据为 MapMarker 类型
  const markers = mapMarkersData.markers as unknown as MapMarker[];

  return (
    <main className="flex-1">
      {/* 地图页头（紧凑型） */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* 地图主体 */}
      <MapView
        markers={markers}
        locale={locale}
        labels={{
          legend: t("legend"),
          noMarkers: t("noMarkers"),
          sources: tCommon("sources"),
          status: {
            confirmed: tStatus("confirmed"),
            speculated: tStatus("speculated"),
            leaked: tStatus("leaked"),
          },
        }}
      />

      {/* 发售日预告条 */}
      <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        {t("comingSoon")}
      </div>
    </main>
  );
}
