import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// 内容集合工具：加载 Markdown 文件并解析 frontmatter
// 内容目录结构：src/content/<collection>/<slug>.md
// 每个 collection 有对应的 frontmatter schema

export const CONTENT_DIR = path.join(process.cwd(), "src", "content");

// js-yaml 会将未加引号的 ISO 日期（如 2026-06-25）解析为 Date 对象，
// 但 frontmatter schema 中 last_updated / date 声明为 string，需还原为字符串
function coerceDates(data: Record<string, unknown>) {
  for (const key of Object.keys(data)) {
    if (data[key] instanceof Date) {
      data[key] = (data[key] as Date).toISOString().slice(0, 10);
    }
  }
  return data;
}

// 已定义的内容集合
export const collections = [
  "characters",
  "vehicles",
  "activities",
  "news",
] as const;
export type Collection = (typeof collections)[number];

// 通用 frontmatter 字段
interface BaseFrontmatter {
  slug: string;
  title: string;
  title_en: string;
  last_updated: string;
  status: "confirmed" | "speculated" | "leaked";
  summary: string;
  summary_en?: string;
  sources?: { label: string; url: string }[];
}

// 角色集合 frontmatter
export interface CharacterFrontmatter extends BaseFrontmatter {
  type: "protagonist" | "supporting";
  abilities: string[];
  background?: string;
}

// 载具集合 frontmatter
export interface VehicleFrontmatter extends BaseFrontmatter {
  category: "car" | "motorcycle" | "boat" | "aircraft" | "special";
  brand?: string;
  features?: string[];
}

// 活动集合 frontmatter
export interface ActivityFrontmatter extends BaseFrontmatter {
  category: "sports" | "water" | "nightlife" | "gambling" | "criminal" | "social";
  details?: string;
}

// 新闻集合 frontmatter
export interface NewsFrontmatter extends BaseFrontmatter {
  date: string;
  author?: string;
}

export type Frontmatter =
  | CharacterFrontmatter
  | VehicleFrontmatter
  | ActivityFrontmatter
  | NewsFrontmatter;

interface ContentEntry<T extends Frontmatter> {
  slug: string;
  frontmatter: T;
  content: string;
}

// 读取单个 collection 的所有条目
export function getAllEntries<T extends Frontmatter>(
  collection: Collection,
): ContentEntry<T>[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        frontmatter: { slug, ...coerceDates(data) } as T,
        content,
      };
    });
}

// 读取单个条目
export function getEntry<T extends Frontmatter>(
  collection: Collection,
  slug: string,
): ContentEntry<T> | null {
  const filePath = path.join(CONTENT_DIR, collection, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    frontmatter: { slug, ...coerceDates(data) } as T,
    content,
  };
}

// 按 locale 切分 markdown 正文
// 约定：文件正文中可用独立成行的 `---` 作为中英分隔符，
// 分隔符之前为中文章节，之后为英文章节（通常以 `## Overview` 开头）。
// 若无分隔符，则所有 locale 返回全文（向后兼容纯中文文件）。
// 兼容 LF (\n) 与 CRLF (\r\n) 换行符，并容忍 `---` 行的尾随空格。
const LOCALE_SEPARATOR = /\r?\n---[ \t]*\r?\n/;

export function splitLocaleContent(
  content: string,
  locale: "zh" | "en",
): string {
  const parts = content.split(LOCALE_SEPARATOR);
  if (parts.length < 2) {
    // 无分隔符：返回全文（兼容现有纯中文文件）
    return content.trim();
  }
  // parts[0] = 中文段，parts[1] = 英文段
  const zhContent = parts[0].trim();
  const enContent = parts.slice(1).join("\n---\n").trim();
  return locale === "zh" ? zhContent : enContent;
}
