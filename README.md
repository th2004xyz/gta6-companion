# GTA6 Companion

GTA6 资讯站 —— 面向英文用户为主、中文为辅的双语内容站点。

- **线上地址**：<https://gta6.sohou.xyz>
- **仓库**：<https://github.com/th2004xyz/gta6-companion>
- **部署平台**：Vercel（GitHub main 分支自动部署）

## 技术栈

- [Next.js 16](https://nextjs.org/) App Router + SSG 静态生成
- [next-intl](https://next-intl-docs.vercel.app/) 中英双语路由（`/zh`、`/en`）
- [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/typography`
- [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) PWA 离线支持
- [gray-matter](https://github.com/jonschlinkert/gray-matter) Markdown frontmatter 解析
- [Leaflet](https://leafletjs.com/) 地图组件
- 内容源：Markdown 文件（`src/content/`）

## 目录结构

```
src/
├── app/[locale]/          # 路由页面（首页/角色/载具/活动/新闻/地图）
│   ├── characters/
│   ├── vehicles/
│   ├── activities/
│   ├── news/
│   └── page.tsx           # 首页
├── components/            # UI 组件（布局/内容/SEO/地图）
├── content/               # Markdown 内容源
│   ├── characters/        # 角色档案
│   ├── vehicles/          # 载具档案
│   ├── activities/        # 活动档案
│   └── news/              # 新闻（自动抓取 + 人工编辑）
├── data/                  # 静态 JSON 数据（地图标记、每周更新）
├── i18n/                  # next-intl 路由与请求配置
└── lib/content.ts         # 内容加载与双语拆分工具

scripts/                   # 新闻自动抓取与发布脚本
├── fetch-news.ts          # RSS 抓取 + 生成草稿
├── pull-drafts.ps1        # 本地拉取草稿（被 pull-drafts.bat 调用）
└── publish-news.ps1       # 本地发布草稿（被 publish-news.bat 调用）

.github/workflows/
└── fetch-news.yml         # 每日 08:00（北京时间）自动抓取 RSS
```

## 本地开发

```bash
npm install
npm run dev
# 打开 http://localhost:3000
```

构建生产版本：

```bash
npm run build
npm start
```

## 部署

Vercel 已连接 GitHub 仓库 `th2004xyz/gta6-companion`。**main 分支的任何 push 都会自动触发部署**，1-2 分钟后线上更新。

## 内容编辑

### 角色 / 载具 / 活动档案

直接在 `src/content/<collection>/<slug>.md` 编辑 Markdown 文件。所有文件遵循双语格式：

- **frontmatter**：`title` / `title_en`、`summary` / `summary_en` 双语字段
- **正文**：用独立成行的 `---` 分隔中文段与英文段（英文段以 `## Overview` 开头）

详见 [src/lib/content.ts](src/lib/content.ts) 中的 `splitLocaleContent` 函数。

### 新闻内容

新闻采用**自动抓取 + 人工编辑**流程：

1. GitHub Actions 每日 08:00（北京时间）从 5 个英文游戏媒体 RSS 抓取 GTA6 相关报道
2. 自动生成草稿到 `news-drafts` 分支
3. 编辑拉取草稿 → 翻译中文正文 → 发布到 main 分支

**详细操作步骤见**：[docs/news-workflow.md](docs/news-workflow.md)

## 相关文档

- [新闻运营工作流详解](docs/news-workflow.md)
- [AGENTS.md](AGENTS.md) - AI 助手开发约定
