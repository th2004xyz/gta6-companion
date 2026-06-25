import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext Cloudflare 适配器配置
//
// 本项目为纯 SSG 静态站点（52 个预渲染页面）+ 单个无状态 POST API（/api/subscribe）：
//   - 无 ISR / 无 on-demand revalidation
//   - 无 next/image 优化（地图瓦片与 OG 图均为静态资源）
//   - 无缓存失效需求
//
// 因此使用默认配置：incrementalCache / tagCache / queue / cdnInvalidation 均为
// 内置的 "dummy" no-op 实现，部署时无需创建 R2 存储桶，也无需启用 Cloudflare Images。
// middleware 使用 next-intl 的 Edge Runtime 中间件（middleware.ts），被 OpenNext 支持。
export default defineCloudflareConfig({});
