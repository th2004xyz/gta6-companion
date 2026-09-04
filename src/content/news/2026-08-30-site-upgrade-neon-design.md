---
title: "站点升级：Vice City 霓虹视觉系统上线"
title_en: "Site upgrade: Vice City neon design system live"
status: confirmed
last_updated: 2026-08-30
date: 2026-08-30
author: GTA6 Companion Editorial
summary: "全站切换为霓虹夜色主题（霓虹粉 / 青 / 紫），修复导航与 SEO 元数据缺陷，倒计时距发售 81 天。"
summary_en: "Site-wide neon night theme (pink / cyan / violet), navigation & SEO metadata fixes, and 81 days on the countdown."
sources:
  - label:
      zh: 站点变更日志
      en: Site changelog
    url: https://github.com/th2004xyz/gta6-companion/commits/main
---

## 升级内容

- **设计系统**：全局替换为 Vice City 霓虹夜色（深色基底 + 霓虹粉 / 青 / 紫渐变点缀）
- **导航**：全站链接补上 locale 前缀，修复裸路径跳转 404
- **SEO 元数据**：metadataBase 回退值修正为 `https://gta6.sohou.xyz`，OG 图重新设计为霓虹风格
- **新闻管线**：修复 RSS 抓取在 YAML 冒号 / MDX HTML 注释 / 含 URL 尖括号上的三处炸弹，新增 frontmatter 前置校验脚本

---

## Overview

**What changed**: a full visual refresh to a Vice City neon-night theme (pink/cyan/violet accents on a deep midnight base), all in-site links now carry locale prefixes, the OG image is redesigned, and the RSS auto-fetch pipeline is hardened against three recurring Markdown pitfalls with a new pre-flight validator.

**Why**: the site was starting to feel like a generic template (zinc grey + emerald). GTA6 players expect dark, cinematic UI; the new palette matches the Leonida brand without sacrificing readability.
