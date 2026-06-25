"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

// 语言切换器：切换 locale 并保留当前路径与查询参数
export default function LanguageSwitcher({
  currentLocale,
  locales,
}: {
  currentLocale: string;
  locales: readonly string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onChange = (nextLocale: string) => {
    if (nextLocale === currentLocale) return;

    // 替换路径中的 locale 段：/zh/xxx -> /en/xxx
    const segments = pathname.split("/");
    if (segments.length > 1 && locales.includes(segments[1])) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }
    const newPath = segments.join("/");

    const query = searchParams.toString();
    const target = query ? `${newPath}?${query}` : newPath;

    startTransition(() => {
      router.push(target);
    });
  };

  return (
    <label className="relative inline-flex items-center">
      <select
        value={currentLocale}
        onChange={(e) => onChange(e.target.value)}
        disabled={isPending}
        aria-label="Language"
        className="h-8 cursor-pointer appearance-none rounded-md border border-zinc-200 bg-transparent pl-2 pr-7 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === "zh" ? "中文" : "EN"}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 h-4 w-4 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </label>
  );
}
