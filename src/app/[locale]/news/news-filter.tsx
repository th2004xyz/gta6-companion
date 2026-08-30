"use client";

import { useState } from "react";
import Link from "next/link";

// 新闻列表客户端筛选器：按可信度标签过滤
// 服务端只负责把数据序列化传进来，交互过滤在客户端完成

export interface NewsFilterItem {
  slug: string;
  date: string;
  author?: string;
  title: string;
  summary: string;
  status: "confirmed" | "speculated" | "leaked";
}

export interface NewsFilterLabels {
  all: string;
  confirmed: string;
  speculated: string;
  leaked: string;
}

export default function NewsFilterList({
  items,
  locale,
  labels,
}: {
  items: NewsFilterItem[];
  locale: string;
  labels: NewsFilterLabels;
}) {
  const [filter, setFilter] = useState<"all" | "confirmed" | "speculated" | "leaked">("all");

  const tabs: { key: typeof filter; label: string }[] = [
    { key: "all", label: labels.all },
    { key: "confirmed", label: labels.confirmed },
    { key: "speculated", label: labels.speculated },
    { key: "leaked", label: labels.leaked },
  ];

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div>
      {/* 筛选 Tab */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count =
            tab.key === "all" ? items.length : items.filter((i) => i.status === tab.key).length;
          const active = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
                active
                  ? "bg-[#ff2d78]/15 text-[#ff5c9a] ring-[#ff2d78]/40"
                  : "bg-transparent text-zinc-400 ring-zinc-700 hover:text-zinc-200 hover:ring-zinc-600"
              }`}
            >
              {tab.label}
              <span className="text-xs tabular-nums opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">—</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/news/${item.slug}`}
              className="neon-glow-hover group block rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-[#ff2d78]/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#ff2d78]/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <time dateTime={item.date}>{item.date}</time>
                    {item.author && <span>· {item.author}</span>}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold group-hover:text-cyan-400">
                    {item.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.summary}
                  </p>
                </div>
                <StatusChip status={item.status} labels={labels} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// 轻量状态徽章（文案由父级传入，随语言切换）
function StatusChip({
  status,
  labels,
}: {
  status: "confirmed" | "speculated" | "leaked";
  labels: NewsFilterLabels;
}) {
  const styles: Record<typeof status, string> = {
    confirmed: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
    speculated: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    leaked: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
  };
  const text: Record<typeof status, string> = {
    confirmed: labels.confirmed,
    speculated: labels.speculated,
    leaked: labels.leaked,
  };
  return (
    <span
      className={`inline-flex h-fit shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {text[status]}
    </span>
  );
}
