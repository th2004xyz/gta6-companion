/**
 * GTA6 News Auto-Fetcher
 *
 * Fetches RSS feeds from gaming media, filters for GTA6-related articles,
 * and generates bilingual draft markdown files in src/content/news/.
 *
 * Usage:
 *   npx tsx scripts/fetch-news.ts
 *
 * Output:
 *   - Draft .md files in src/content/news/ with filename YYYY-MM-DD-<slug>.md
 *   - Each draft contains English content from RSS; Chinese sections are placeholders
 *   - Existing files are NOT overwritten (idempotent)
 *
 * Editor workflow (after GitHub Actions commits drafts to news-drafts branch):
 *   1. git fetch origin && git checkout news-drafts
 *   2. For each new draft:
 *      - Translate `title` field to Chinese (currently English)
 *      - Translate `summary` field to Chinese
 *      - Fill in Chinese body above the --- separator
 *      - Update `status` if needed (confirmed/speculated/leaked)
 *      - Remove the AUTO-FETCHED DRAFT comment
 *   3. Move reviewed file to main: git checkout main && git add ... && git commit
 */

import RSSParser from "rss-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEWS_DIR = path.join(__dirname, "..", "src", "content", "news");

// RSS sources — verified working as of 2026-06-29.
// All are English-language gaming media; Rockstar has no official RSS.
const SOURCES = [
  { name: "Eurogamer", url: "https://www.eurogamer.net/feed" },
  { name: "VGC", url: "https://www.videogameschronicle.com/feed/" },
  { name: "Push Square", url: "https://www.pushsquare.com/feeds/news" },
  { name: "GameSpot", url: "https://www.gamespot.com/feeds/mashup/" },
  { name: "IGN", url: "https://feeds.feedburner.com/ign/games-all" },
] as const;

// GTA6 keyword filter — case-insensitive match against title / categories / snippet.
// "rockstar" is included because most Rockstar news is GTA6-related;
// editor can filter false positives during review.
const GTA6_KEYWORDS = [
  "gta 6",
  "gta6",
  "grand theft auto 6",
  "grand theft auto vi",
  "rockstar",
];

// Only fetch articles published within the last N days (inclusive of today).
// Prevents old RSS items from reappearing as drafts every day after the
// news-drafts branch is rebuilt from main.
const MAX_AGE_DAYS = 3;

function isRecent(item: FeedItem): boolean {
  const dateStr = item.isoDate || item.pubDate;
  if (!dateStr) return false;
  const itemDate = new Date(dateStr);
  if (isNaN(itemDate.getTime())) return false;
  // Cutoff = start of (today - (MAX_AGE_DAYS - 1)). For MAX_AGE_DAYS=3 that
  // means today, yesterday, and the day before yesterday are all included.
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (MAX_AGE_DAYS - 1));
  return itemDate >= cutoff;
}

const parser = new RSSParser();

const FETCH_HEADERS = {
  "User-Agent": "gta6-companion-news-bot/1.0 (+https://gta6.sohou.xyz)",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
};

const FETCH_TIMEOUT_MS = 20000;

async function fetchFeedXml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

interface FeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  categories?: string[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .replace(/^-|-$/g, "");
}

function isGTA6Related(item: FeedItem): boolean {
  const haystack = [
    item.title || "",
    (item.categories || []).join(" "),
    item.contentSnippet || "",
  ]
    .join(" ")
    .toLowerCase();
  return GTA6_KEYWORDS.some((kw) => haystack.includes(kw));
}

function buildMarkdown(item: FeedItem, sourceName: string): string {
  const date = (item.isoDate || new Date().toISOString()).slice(0, 10);
  const title = (item.title || "Untitled").trim();
  const author = (item.creator || sourceName).trim();
  const summary = (item.contentSnippet || "")
    .replace(/\n+/g, " ")
    .slice(0, 280)
    .trim();
  const englishBody = stripHtml(item.content || item.contentSnippet || "")
    .slice(0, 4000)
    .trim();

  const sourceUrl = item.link || "";

  return `---
title: ${title}
title_en: ${title}
status: speculated
last_updated: ${date}
date: ${date}
author: ${author}
summary: ${summary}
summary_en: ${summary}
sources:
  - label:
      zh: ${sourceName}
      en: ${sourceName}
    url: ${sourceUrl}
---

<!-- AUTO-FETCHED DRAFT
  - This file was generated by scripts/fetch-news.ts from ${sourceName} RSS.
  - Editor TODO:
    1. Translate \`title\` and \`summary\` fields to Chinese (keep title_en/summary_en as-is)
    2. Replace the Chinese placeholder below with a real Chinese summary/body
    3. Update \`status\` if needed (confirmed / speculated / leaked)
    4. Remove this comment block before publishing
-->

## 中文正文（待编辑）

> 此为自动抓取的英文草稿，请补充中文摘要与正文。建议参考下方英文内容进行翻译与扩充。

---

## Overview

${englishBody || "(英文正文待补充)"}

## Source

- Original: [${title}](${sourceUrl})
`;
}

async function fetchFromSource(source: (typeof SOURCES)[number]): Promise<FeedItem[]> {
  try {
    const xml = await fetchFeedXml(source.url);
    const feed = await parser.parseString(xml);
    console.log(`  ✓ ${source.name}: ${feed.items?.length || 0} items fetched`);
    return (feed.items || []) as FeedItem[];
  } catch (err) {
    console.warn(`  ✗ ${source.name}: failed — ${(err as Error).message}`);
    return [];
  }
}

async function main() {
  console.log("=== GTA6 News Auto-Fetcher ===");
  console.log(`Time: ${new Date().toISOString()}`);
  console.log("");

  if (!fs.existsSync(NEWS_DIR)) {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
  }

  // Track existing files to skip duplicates
  const existingFiles = new Set(
    fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".md")),
  );

  let totalFetched = 0;
  let totalDrafts = 0;
  const draftsWritten: string[] = [];

  for (const source of SOURCES) {
    const items = await fetchFromSource(source);
    totalFetched += items.length;

    const gta6Items = items.filter((item) => isGTA6Related(item) && isRecent(item));
    console.log(`  → ${gta6Items.length} recent GTA6-related items from ${source.name} (last ${MAX_AGE_DAYS} days)`);

    for (const item of gta6Items) {
      const date = (item.isoDate || new Date().toISOString()).slice(0, 10);
      const slug = slugify(item.title || "untitled");
      if (!slug) continue;
      const filename = `${date}-${slug}.md`;

      if (existingFiles.has(filename)) {
        console.log(`  ↺ skip (exists): ${filename}`);
        continue;
      }

      const markdown = buildMarkdown(item, source.name);
      fs.writeFileSync(path.join(NEWS_DIR, filename), markdown, "utf8");
      draftsWritten.push(filename);
      totalDrafts++;
      console.log(`  ✓ draft: ${filename}`);
    }
  }

  console.log("");
  console.log("=== Summary ===");
  console.log(`Total RSS items fetched: ${totalFetched}`);
  console.log(`Drafts written: ${totalDrafts}`);
  if (draftsWritten.length > 0) {
    console.log("Files:");
    draftsWritten.forEach((f) => console.log(`  - ${f}`));
  } else {
    console.log("No new drafts (all duplicates or no GTA6 content today).");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
