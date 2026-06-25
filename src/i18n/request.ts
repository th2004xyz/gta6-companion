import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// 请求时加载对应语言的 messages 文件
// next-intl 会在每个请求中调用此函数以决定使用哪套翻译
export default getRequestConfig(async ({ requestLocale }) => {
  // 从请求上下文中获取 locale（由 middleware 注入）
  let locale = await requestLocale;

  // 若未获取到或获取到的 locale 不在支持列表中，回退到默认语言
  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
