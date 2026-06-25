"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 移动端底部导航栏的客户端部分
// 需要根据当前路径高亮激活的 tab
// 这是移动优先 PWA 的关键导航入口，确保玩家单手可达所有核心页面
export default function MobileTabBar({
  items,
  locale,
}: {
  items: { href: string; label: string; icon: IconName }[];
  locale: string;
}) {
  const pathname = usePathname();
  const localePrefix = `/${locale}`;
  // 标准化当前路径用于匹配（去掉 locale 前缀）
  const currentPath = pathname.startsWith(localePrefix)
    ? pathname.slice(localePrefix.length) || "/"
    : pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:hidden">
      <div className="mx-auto flex h-14 max-w-5xl items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          // 当前路径是否匹配此 tab
          const isActive =
            item.href === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <TabIcon name={item.icon} active={isActive} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

type IconName = "home" | "map" | "users" | "sparkles" | "news";

function TabIcon({ name, active }: { name: IconName; active: boolean }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6a1 1 0 011-1h4a1 1 0 011 1v6h3a1 1 0 001-1V10" />,
    map: <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />,
    users: <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 10-4-4 4 4 0 004 4z" />,
    sparkles: <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
    news: <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 0a2 2 0 012 2v9a2 2 0 01-2 2M9 9h4m-4 4h4m-4 4h4m6-8h.01M5 9h.01M5 13h.01M5 17h.01" />,
  };
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
    >
      {paths[name]}
    </svg>
  );
}
