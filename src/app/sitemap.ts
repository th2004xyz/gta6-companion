import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

// 站点地图：列出所有 locale 下的核心页面
// 包含 hreflang 替代链接，帮助搜索引擎理解多语言版本关系
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gta6-companion.example.com";
  const lastModified = new Date();

  // P1 阶段核心页面路径
  const routes = [
    "",
    "/map",
    "/characters",
    "/vehicles",
    "/activities",
    "/news",
    "/subscribe",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // 为每个路由生成所有语言版本，并标注 hreflang alternates
    const alternates: Record<string, string> = {};
    for (const locale of routing.locales) {
      alternates[locale] = `${baseUrl}/${locale}${route}`;
    }

    for (const locale of routing.locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified,
        changeFrequency: route === "/news" ? "daily" : "weekly",
        priority: route === "" ? 1 : route === "/map" ? 0.9 : 0.7,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
