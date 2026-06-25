import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// next-intl 中间件：处理 locale 检测、URL 重写与重定向
// 根据请求路径与浏览器偏好自动匹配语言，并保持 URL 中的 locale 前缀
export default createMiddleware(routing);

export const config = {
  // 匹配除以下路径外的所有路径：
  // - /api/*（API 路由不需要 i18n）
  // - /_next/*（Next.js 内部资源）
  // - /.*\.(.*)*（静态文件，如 favicon.ico、manifest.json、图标等）
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
