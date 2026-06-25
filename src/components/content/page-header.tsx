// 列表页通用页头：标题 + 副标题
// 用于角色/载具/活动/新闻等列表页统一头部样式
export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// 详情页通用面包屑
export function DetailBreadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {idx > 0 && <span className="text-zinc-300 dark:text-zinc-600">/</span>}
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-zinc-900 dark:text-zinc-100">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
