import Link from "next/link";

// 数据可信度三态徽章
// 用于在内容卡片与详情页统一标注数据来源可信度
export function StatusBadge({
  status,
  labels,
}: {
  status: "confirmed" | "speculated" | "leaked";
  labels: { confirmed: string; speculated: string; leaked: string };
}) {
  const config = {
    confirmed: {
      label: labels.confirmed,
      className: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:text-emerald-400",
    },
    speculated: {
      label: labels.speculated,
      className: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:text-amber-400",
    },
    leaked: {
      label: labels.leaked,
      className: "bg-rose-500/15 text-rose-700 ring-rose-500/30 dark:text-rose-400",
    },
  } as const;

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

// 来源链接列表
export function SourceList({
  sources,
  label,
}: {
  sources: { label: string; url: string }[];
  label: string;
}) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <ul className="mt-2 space-y-1">
        {sources.map((source, idx) => (
          <li key={idx}>
            <Link
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-700 hover:underline dark:text-emerald-400"
            >
              {source.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 最后更新时间
export function LastUpdated({
  date,
  label,
}: {
  date: string;
  label: string;
}) {
  return (
    <div className="text-xs text-zinc-500 dark:text-zinc-400">
      {label}: {date}
    </div>
  );
}
