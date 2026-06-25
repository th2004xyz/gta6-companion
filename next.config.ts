import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

// next-intl 插件：自动配置 Next.js 以支持国际化路由与 message 加载
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// PWA 插件：生成 Service Worker、离线缓存策略
// - disable: 开发环境禁用（避免热更新冲突）
// - dest: SW 输出目录
// - cacheOnFrontEndNav: 前端导航时缓存页面
// - aggressiveFrontEndNavCaching: 移动端体验优化
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // 自定义缓存策略：优先网络、回退缓存
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // P1 阶段无需额外配置
  // 后续图片优化等配置在引入对应依赖后追加
};

export default withPWA(withNextIntl(nextConfig));
