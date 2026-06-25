// 根 layout：仅转发 children 到 [locale] 路由
// 真正的 HTML 文档结构由 [locale]/layout.tsx 提供
// 此文件满足 Next.js App Router 根布局要求
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
