import { defineRouting } from "next-intl/routing";

// 国际化路由配置
// 定义支持的语言、默认语言、locale 前缀策略
export const routing = defineRouting({
  // 支持的语言：中文（默认）、英文
  locales: ["zh", "en"] as const,

  // 默认语言
  defaultLocale: "zh",

  // 始终在 URL 中显示 locale 前缀（如 /zh、/en）
  // 有利于 SEO 与清晰的 URL 结构
  localePrefix: "always",
});

// 直接导出 locales，便于其他模块直接引用
export const locales = routing.locales;

export type Locale = (typeof routing.locales)[number];
