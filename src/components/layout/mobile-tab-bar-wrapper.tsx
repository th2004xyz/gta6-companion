import { getTranslations } from "next-intl/server";
import MobileTabBar from "./mobile-tab-bar";

// 移动端底部导航的服务器包装
// 负责读取翻译，将静态 items 传入客户端组件
export default async function MobileTabBarWrapper({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations("nav");

  const items = [
    { href: "/", label: t("home"), icon: "home" as const },
    { href: "/map", label: t("map"), icon: "map" as const },
    { href: "/characters", label: t("characters"), icon: "users" as const },
    { href: "/activities", label: t("activities"), icon: "sparkles" as const },
    { href: "/news", label: t("news"), icon: "news" as const },
  ];

  return <MobileTabBar items={items} locale={locale} />;
}
