# 工作交接文档（2026-09-03）

> 项目：GTA6 Companion（https://github.com/th2004xyz/gta6-companion）
> 当日工作：P1 档案补录 + 每周更新机制 + 新闻页 JSON-LD + 话题标签筛选器
> 仓库状态：全部改动已通过 PR #1 合并至 main（合并提交 `99797cb`），构建验证通过

---

## 一、今日完成内容

### 1. P1 档案补录（commit `240fe3f`）
- 角色档案 5 → 10、载具档案 9 → 24、活动档案 18 → 20，全部双语
- 修复 6 个文件的 YAML 解析错误（`summary_en` 值含冒号未加引号）：
  - `src/content/activities/couple-activities.md`、`pet-interactions.md`
  - `src/content/characters/cal-hampton.md` 等

### 2. 每周更新例行机制（commit `240fe3f`）
- 新增 `.github/workflows/weekly-update-check.yml`：每周一自动检查并开 Issue 提醒更新
- 推送时遇到 workflow 权限问题，已用 `gh auth refresh --scopes workflow` 解决

### 3. 新闻页 NewsArticle JSON-LD
- `src/components/seo/json-ld.tsx`：新增 `NewsArticleJsonLd` 组件（headline / datePublished / dateModified / author / publisher / mainEntityOfPage）
- `src/app/[locale]/news/[slug]/page.tsx`：详情页挂载 NewsArticle + Breadcrumb JSON-LD，含 FAQ 的文章输出 FAQPage 结构化数据；`generateMetadata` 标记 OpenGraph `type: "article"`

### 4. 新闻话题标签筛选器（commit `b915e30`）
- `src/lib/content.ts`：`NewsFrontmatter` 新增 `tags?: string[]` 字段（受控词表）
- `src/app/[locale]/news/news-filter.tsx`：状态 + 标签双重过滤（标签多选、命中任一即展示、可清除、`aria-pressed` 无障碍标记）；卡片展示标签徽章；`NEWS_TAG_LABELS` 维护 8 个受控标签双语文案（release/gameplay/characters/vehicles/marketing/industry/online/leaks）
- `src/app/[locale]/news/page.tsx`：向筛选组件透传 `tags` 字段
- 28 篇新闻 frontmatter 批量补充标签（临时脚本 `scripts/add-news-tags.mjs` 已用完删除）

### 5. 构建与发布
- `npm run build` 验证通过，全部页面 SSG 零错误
- 分支 `trae/agent-B7v3qo` 推送远程，PR #1 已合并 main

---

## 二、中途撤销的改动（勿恢复）

- favicon / icons / apple-touch-icon / `scripts/gen-icons.mjs`：已按用户要求撤销（commit `3626b9e`）。favicon 霓虹化仍在待办清单中，**重新做时必须先征得用户确认**

---

## 三、延后事项（人工/账号类，用户明确暂缓）

- [ ] **Amazon Associates 等联盟注册**：拿到 ID 后回填 `src/data/purchase-links.json` 各渠道 `affiliateQuery` 字段即可生效，无需改代码
- [ ] **Resend 域名验证 + 生产环境变量**：配置 `RESEND_FROM` / `WAKEUP_SECRET` 到 Vercel/Cloudflare 与 GitHub Secrets。⚠️ **必须在 11-12 预载日前完成**，否则唤醒邮件发不出去

---

## 四、后续待办（按优先级）

- [ ] P1: 每周更新例行机制落地（每周一更新 `weekly-updates.json`，已有 Actions 提醒）
- [ ] P1: 档案补录持续（待 Trailer 3 / 媒体试玩新信息）
- [ ] P2: favicon 霓虹化重设计（需用户确认后再做）
- [ ] P3: 发售周决战准备（预载指南页、首页「已发售」模式、Wiki 化 SPEC v2.0）

---

## 五、关键文件索引

| 用途 | 路径 |
|---|---|
| 项目总说明书 | `SPEC.md`（变更记录见第 7 节，已更新至 v1.3） |
| 内容 schema | `src/lib/content.ts` |
| JSON-LD 组件 | `src/components/seo/json-ld.tsx` |
| 新闻列表筛选器 | `src/app/[locale]/news/news-filter.tsx` |
| 新闻内容目录 | `src/content/news/`（28 篇，均已打标签） |
| 预购链接配置 | `src/data/purchase-links.json` |
| 每周更新检查 | `.github/workflows/weekly-update-check.yml` |
| 邮件唤醒序列 | `src/app/api/email-wakeup/` + `.github/workflows/email-wakeup.yml` |

---

## 六、协作注意事项（用户明确要求）

1. **推送/长命令超时必须先告知**：git push、部署、安装依赖等命令超过 2 分钟未成功（或第一次失败），必须立即停止并告知用户，等待决定
2. **不得擅自安装软件或改动代码**：未经用户明确同意，不安装新依赖、不开展用户未安排的改动
3. **遇阻即报告**：认证缺失、权限不足、网络失败等阻塞，发现后第一时间告知用户
