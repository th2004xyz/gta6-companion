import { MDXRemote } from "next-mdx-remote/rsc";

// Markdown 正文渲染组件
// 使用 next-mdx-remote 的 RSC 版本，支持服务端渲染
// 自定义 components 可在此扩展（如自定义标题、链接样式等）
export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-8 prose-h2:text-xl prose-h3:mt-6 prose-h3:text-lg prose-p:leading-relaxed prose-a:text-emerald-700 hover:prose-a:underline dark:prose-a:text-emerald-400 prose-li:my-1 prose-ul:my-2 prose-ol:my-2">
      <MDXRemote source={content} />
    </div>
  );
}
