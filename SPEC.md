# GTA6 Companion 系统总说明书（Master SPEC）

> 版本：v1.0 ｜ 日期：2026-08-30 ｜ 状态：生效
> 本文档是项目的唯一总说明书：战略定位、内容规划、技术架构、设计规范、路线图全部以此为准。后续任何优化/迭代先读本文件。

---

## 0. 一句话定位

**GTA6 Companion 是发售前抢搜索流量、发售后转型攻略 Wiki 的双语 GTA6 内容站，以「情报可信度标签 + 轻量互动工具」为差异化，用 81 天倒计时窗口完成流量原始积累。**

---

## 1. 战略层

### 1.1 方向裁决（头脑风暴结论）

原方向「游戏工具类网站」**需要调整**，理由：

| 维度 | 纯工具站 | 内容+轻工具双轮（采纳） |
|---|---|---|
| 窗口期适配 | 工具开发慢，81 天内难出爆品 | 内容生产快，当日可蹭热点 |
| 流量来源 | 工具词搜索量低且被大厂垄断 | 情报/解析长尾词海量且竞争窗口开放 |
| 竞品形态 | gta6map.io 等已占位 | Leonida Ledger 走「答案层」刚起步，可超越 |
| 发售后延续性 | 工具易被官方/大厂替代 | 转型 Wiki/攻略站（GTA Fandom 月访百万级模式） |

**结论：工具不砍，降级为「差异化资产」**——互动地图是全站最强护城河（"GTA 6 map" 是顶级搜索词），发售后升级为可标注的互动地图工具；但流量发动机换成内容。

### 1.2 市场环境（2026-08-30 时点情报）

- 发售日：**2026-11-19**（PS5 / Xbox Series X|S），距今 **81 天**；PC 版预计 2027 年底
- 8-27 Netflix 独家首播 26 分钟实机《An Extended Look》，全球直播峰值 397 万人同时观看，Twitch 一度宕机——**史上最高热度的游戏营销事件**
- 预购已破 450 万份（约 4.5 亿美元），标准版 $79.99 / 终极版 $99.99
- 数字版 **11-12 开放预载**（第二个流量峰值）
- Zelnick 确认后续还有「主菜和甜点」级物料（Trailer 3 / Online 揭示 / 媒体试玩），8-28 → 11-18 是连续热点期
- 关键判断：**SEO 页面需要 4-8 周才能排上名，所有核心页面必须在 9 月底前上线**，否则赶不上发售周流量洪峰

### 1.3 流量飞轮

```
RSS 抓取（已有管线）→ AI 辅助双语改写 + 可信度标签
   → 热点快讯（24h 内发布，抢 Google News / 社媒）
   → 沉淀为常青指南（evergreen，长期吃搜索）
   → 内链汇聚到互动地图 / 档案库（差异化，提停留时长）
   → 邮件订阅沉淀私域（发售日唤醒）
   → 发售后转型攻略 Wiki（流量二次变现）
```

### 1.4 商业化路径（分层，按流量门槛解锁）

| 阶段 | 门槛 | 变现手段 | 预期 |
|---|---|---|---|
| L0 现在-发售 | 无 | 预购联盟链接（Amazon/零售商 affiliate）、邮件列表 | 赚经验 > 赚钱 |
| L1 发售后 1-3 月 | 月会话 10K+ | Google AdSense → Ezoic/Mediavine（RPM 高数倍） | 覆盖服务器成本 |
| L2 发售 3 月+ | 月会话 50K+ | 攻略 Sponsored 位、游戏周边联盟、付费去广告 | 月入数百刀起 |
| L3 长期 | 品牌成立 | 反哺 Zephyr 主站矩阵（gta6 子域名已是案例） | 方法论复用 |

> 老板底线目标「不赚钱也要积累引流方法论」→ 本站同时是 **Zephyr 内容站矩阵的试验田**：RSS→AI 双语→SSG 发布的管线可直接复用到下一个热点 IP。

### 1.5 竞争格局与差异化

| 竞品 | 打法 | 我们的空档 |
|---|---|---|
| GTA Fandom / IGN | 大而全，发售后垄断 | 发售前它们不卷长尾问答 |
| Leonida Ledger | 「答案层」+ 来源标签，刚起步 | 我们有双语（中文玩家被所有英文站忽视） |
| gta6map.io | 纯地图工具 | 我们地图+内容内链闭环 |
| GTABoom 等新闻站 | 快讯+抽奖 | 我们可信度标签体系（confirmed/rumor/speculation）建立信任 |

**差异化三板斧：① 中英双语（抢中文搜索真空）② 可信度标签体系（每条信息标注 confirmed/unknown/speculation）③ 互动地图。**

---

## 2. 内容战略

### 2.1 内容矩阵（五大支柱）

| 支柱 | 目录 | 发售前职责 | 发售后职责 |
|---|---|---|---|
| 新闻情报 | `news/` | 热点快讯，24h 内双语上线 | 更新日志/DLC 情报 |
| 角色档案 | `characters/` | 主角+配角解析（蹭剧情猜测流量） | 角色支线攻略 |
| 载具档案 | `vehicles/` | 实机演示逐帧扒车 | 改装/性能数据 |
| 活动玩法 | `activities/` | 已确认玩法（钓鱼/健身/夜店/篮球） | 赚钱攻略、100% 完成度 |
| 互动地图 | `map/` | 预告片地点考据 | 收集品/彩蛋标注工具（核心护城河） |

### 2.2 关键词地图（优先级排序，英文为主战场）

**P0 抢排名（9 月底前必须上线独立页面）：**
- `GTA 6 release date` / `GTA 6 countdown`（首页已有倒计时 ✓）
- `GTA 6 map` / `GTA 6 Leonida map` / `Vice City map GTA 6`（地图页扩容）
- `GTA 6 pre-order` / `GTA 6 price` / `GTA 6 editions`（affiliate 变现页）
- `GTA 6 PC release date`（谣言澄清页——长尾金矿，所有人都在搜）
- `GTA 6 Trailer 3` / `GTA 6 gameplay` / `Extended Look breakdown`

**P1 常青指南（10 月补齐）：**
- `GTA 6 characters`（Jason / Lucia / 配角各一页）
- `GTA 6 vehicles list` / `confirmed vehicles`
- `GTA 6 Online`（Online 揭示前占位，揭示后爆发）
- `GTA 6 PS5 Pro` / `60fps`（性能话题持续有流量）

**P2 中文真空区（低成本捡流量）：**
- `GTA6 发售时间` / `GTA6 预购` / `GTA6 实机演示解析` / `GTA6 PC版什么时候出`

### 2.3 发布节奏（对齐营销节点）

| 时间 | 节点 | 动作 |
|---|---|---|
| 8-31 ~ 9-5 | 实机演示余热 | 补发 Extended Look 解析 3 篇（中英）+ 全站数据更新 |
| 9 月 | Trailer 3 / 新物料（传闻窗口） | 热点当日快讯 + P0 页面全部上线 |
| 10 月 | 媒体试玩/评测 embargo | 汇总页「Everything We Know」+ P1 常青页 |
| 11-12 | 预载开启 | 预载指南 + 配置/容量页（搜索峰值） |
| 11-19 | 发售日 | 邮件推送唤醒 + 首页切换「已发售」模式 |
| 11-19 后 | 转型期 | 启动 Wiki 化：攻略/收集品/彩蛋，地图开放标注 |

### 2.4 可信度标签体系（信任资产）

所有内容条目必须标注三档标签（已有 `status` 字段基础，需扩展）：
- `confirmed`：官方来源（Rockstar/Take-Two/PS Store）
- `reported`：可信媒体报道（需附来源链接）
- `speculation`：推测/社区理论（明确标注，绝不混淆）

> 这是对抗 AI 垃圾内容时代的核心资产——Google 和用户都奖励「敢标注不确定性」的站。

---

## 3. 技术架构

### 3.1 现状栈（保留，不动骨架）

- Next.js 16 App Router + 全量 SSG ｜ next-intl 双语（`/zh` `/en`）｜ Tailwind v4 ｜ PWA
- 内容源：Markdown + gray-matter，双语 frontmatter + `---` 分隔正文
- 管线：GitHub Actions 每日抓 RSS → `news-drafts` 分支 → 人工翻译 → main 自动部署 Vercel
- 线上：`https://gta6.sohou.xyz`

### 3.2 已知缺陷清单（P0 修复，按序执行）

| # | 问题 | 位置 | 修复方案 |
|---|---|---|---|
| B1 | Hero 区 CTA 链接丢失 locale（`/map`、`/subscribe` 裸路径） | `src/app/[locale]/page.tsx` L125/L131/L231 | 改为 `` `/${locale}/map` `` 等，或统一用 next-intl 的 `Link` |
| B2 | `metadataBase` 回退到 example.com | `[locale]/layout.tsx` L42 | 部署环境配 `NEXT_PUBLIC_SITE_URL=https://gta6.sohou.xyz`，代码回退值同步改 |
| B3 | 新闻管线停摆（最新一条 7-10，错过 8-27 实机演示） | `news-drafts` 分支 / Actions | 排查 fetch-news workflow 日志，补发 Extended Look 专题 |
| B4 | `weekly-updates.json` 停留在 6-23~6-27 | `src/data/weekly-updates.json` | 更新为 8-24~8-30 周（实机演示+预购数据），并建立每周例行更新机制 |
| B5 | 档案数据薄：角色 5 / 载具 7，远低于实机演示已确认信息量 | `src/content/*` | 按实机演示补录（见 2.3 九月动作） |

### 3.3 SEO 技术规范（硬要求）

1. 每个页面唯一 `title`/`description`，双语各自优化（不是互译，是按各自语言搜索词写）
2. `sitemap.ts` 自动包含所有 content 条目，`robots.ts` 放行
3. JSON-LD：首页 VideoGame + FAQ（已有 ✓），新闻页加 `NewsArticle` schema（**待加**）
4. hreflang 双语互指（next-intl 配好，需验证 sitemap 输出）
5. 内链规则：每篇新闻至少 2 条内链到档案/地图页；档案页互相串联
6. Core Web Vitals：LCP < 2.5s（SSG 已保障），Leaflet 地图懒加载（已 dynamic import，保持）

### 3.4 数据流图

```
RSS (5 英文媒体)                    人工/Kimi 写作
     │                                   │
     ▼                                   ▼
fetch-news.ts ──► news-drafts 分支 ──► 双语润色 + status 标签
                                          │
                                          ▼
                              src/content/news/*.md ──► main 分支
                                          │
                                          ▼
                              Vercel SSG 构建 ──► gta6.sohou.xyz
                                          │
              ┌───────────────────────────┼───────────────────┐
              ▼                           ▼                   ▼
        sitemap/JSON-LD            内链到档案/地图         邮件订阅 API
```

---

## 4. 设计系统与交互规范

### 4.1 视觉方向裁决

现状：zinc 灰 + emerald 绿 = 通用模板感，与 GTA6 品牌零关联。
目标：**Vice City 霓虹夜色**——深色基底 + 霓虹粉/青/紫渐变点缀，呼应 Leonida 的迈阿密霓虹美学，同时保证内容可读性。

### 4.2 色彩 Token（替换 globals.css 变量）

| Token | 值 | 用途 |
|---|---|---|
| `--bg-base` | `#0a0a0f` | 页面底色（深夜） |
| `--bg-surface` | `#14141c` | 卡片/区块 |
| `--accent-primary` | `#ff2d78`（霓虹粉） | 主 CTA、强调 |
| `--accent-secondary` | `#22d3ee`（霓虹青） | 次强调、链接 hover |
| `--accent-glow` | `#a855f7`（紫） | 渐变过渡、氛围 |
| `--text-primary` | `#f4f4f5` | 正文 |
| `--text-muted` | `#9ca3af` | 次要文字 |
| `--status-confirmed` | `#22c55e` | 已确认标签 |
| `--status-reported` | `#eab308` | 媒体报道标签 |
| `--status-speculation` | `#f97316` | 推测标签 |

> Hero 渐变：`linear-gradient(135deg, #ff2d78 → #a855f7 → #22d3ee)` 模拟 Vice City 日落霓虹，克制使用（仅 Hero/页头）。

### 4.3 组件规范

- **卡片**：`rounded-2xl border border-white/8 bg-surface`，hover 时边框染 accent + 微发光 `box-shadow: 0 0 24px color-mix(accent 15%, transparent)`
- **可信度徽章 StatusBadge**（已有，按 4.2 三档色重刷）
- **倒计时**：保持，发售日数字用 tabular-nums + 霓虹青
- **按钮**：主按钮霓虹粉实心；次按钮 `border-white/15` 幽灵按钮
- **字体**：保留 Geist；标题可加 `tracking-tight` + 字重 700/800

### 4.4 交互规范

1. **移动端优先**：底部 TabBar 保持 5 项以内（首页/新闻/地图/档案/订阅）
2. **暗色为默认**：GTA 玩家预期暗色；不做亮暗切换，直接暗色唯一主题（减复杂度，符合「减负」原则）
3. **新闻页**：列表按时间倒序 + 标签筛选（confirmed/reported/speculation 筛选器）
4. **地图页**：Leaflet 懒加载，移动端双指缩放不劫持页面滚动
5. **动效克制**：仅 hover/入场 fade，不做滚动视差（性能+品味）
6. **订阅表单**：放发售日唤醒钩子文案（"发售日第一时间通知你"）

### 4.5 形式-内容统一检查清单

- [ ] 全站暗色后无 zinc-50/white 残留亮区块（当前首页「本周更新」「订阅 CTA」是亮块，需统一）
- [ ] 所有 Link 带 locale（B1 修复后回归验证）
- [ ] 徽章三色体系在新闻/档案/首页统计全场景一致
- [ ] OG 图重新设计为霓虹风（替换 `/og/default.jpg`）

---

## 5. 路线图（对齐 11-19 发售）

### P0 — 止血与抢跑（9 月第 1 周，约 3-5 天工作量）
1. 修复 B1-B4 全部缺陷
2. 补发 3 篇 Extended Look 解析（中英）：系统篇（双主角切换/罪犯档案）、世界篇（Leonida 生态/NPC）、玩法篇（抢劫/潜行/休闲）
3. 重刷暗色霓虹主题（globals.css + 首页统一）
4. 更新 weekly-updates.json 至本周

### P1 — 抢排名冲刺（9 月内）
5. P0 关键词页面全部上线（PC 版澄清页、预购/版本对比页、Trailer 3 占位页）
6. 档案补录：角色 ≥ 10、载具 ≥ 20、活动 ≥ 20（按实机演示逐帧确认，标注 confirmed）
7. 新闻管线恢复 + 加入 AI 辅助翻译环节（Kimi 网页版，半自动）
8. 新闻页 NewsArticle JSON-LD + 标签筛选器

### P2 — 蓄水与变现（10 月）
9. 「Everything We Know」终极汇总页（发售前最大搜索词承载页）
10. 预购 affiliate 链接接入（版本对比页直接挂）
11. 邮件列表发售日唤醒序列（预载日/发售日两封）
12. OG 图与 favicon 霓虹化重设计（分享卡片是社媒流量门面）

### P3 — 发售周决战（11-12 ~ 11-19）
13. 预载指南页（容量/时间/平台）
14. 首页切换「已发售」模式 + 邮件推送
15. 启动 Wiki 化转型规划（独立 SPEC v2.0）

---

## 6. 验收指标（KPI）

| 指标 | 9 月底 | 发售日 | 发售后 1 月 |
|---|---|---|---|
| Google 收录页面 | ≥ 60 | ≥ 100 | ≥ 200 |
| 月自然搜索会话 | ≥ 1,000 | ≥ 20,000（峰值周） | ≥ 30,000 |
| 邮件订阅 | ≥ 100 | ≥ 1,000 | ≥ 2,000 |
| P0 关键词前 20 名 | ≥ 3 个词 | ≥ 8 个词 | — |
| 月收入 | 0（目标=经验） | affiliate 首单 | ≥ $100 |

> 数据底线：即使全挂，也要沉淀「热点 IP 双语内容站 SOP」供 Zephyr 矩阵复用——这是本项目的保底产出。

---

## 7. 变更记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-08-30 | 首版：战略转向内容+轻工具双轮，确立霓虹设计系统，P0-P3 路线图 |
| v1.1 | 2026-08-31 | P0 执行完成：修复 B1-B4、重刷霓虹主题、补发实机解析 ×3、管线根因修复（YAML 冒号值 / MDX HTML 注释 / 裸 URL 尖括号三处炸弹 + fetch-news.ts 模板加固 + validate-frontmatter.js 校验脚本） |

### P0 执行记录（2026-08-31）

- ✅ B1 链接 locale：首页 Hero / header / footer / 移动端 TabBar 全部补全前缀
- ✅ B2 metadataBase → `https://gta6.sohou.xyz`（含 .env.example）
- ✅ B3 补发 Extended Look 解析 ×3（系统 / 世界 / 玩法），并挖出**管线停摆根因**：
  ① 草稿 frontmatter 值含 `: `（如 "Preloading: Start Date"）炸 YAML
  ② `<!-- -->` HTML 注释在 MDX 中非法，炸编译
  ③ 裸 `<https://...>` 尖括号被 MDX 当标签
  → 已修历史文件 + 加固 `scripts/fetch-news.ts`（值加引号、注释改 `{/* */}`）+ 新增 `scripts/validate-frontmatter.js` 前置校验
- ✅ B4 weekly-updates.json 更新至 8-24 ~ 8-30
- ✅ 霓虹主题全站落地：globals.css 重写（dark-only + @custom-variant）、首页霓虹光斑 Hero + 渐变标题、全部列表/详情页强调色替换为粉/青（语义状态色保留）
- ✅ 构建验证：`next build` 通过，110/110 页面
