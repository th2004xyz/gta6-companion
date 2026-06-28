# GTA6 News - Publish Edited Drafts to Main
# 只发布已编辑的草稿（删除了 AUTO-FETCHED DRAFT 注释的文件）
# 未编辑的草稿保留在工作区，不会被发布

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 切换到项目根目录
$projectRoot = Split-Path -Parent -Path (Split-Path -Parent -Path $MyInvocation.MyCommand.Path)
Set-Location -Path $projectRoot

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  GTA6 News - 发布已编辑的草稿" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 确保在 main 分支
$currentBranch = git branch --show-current 2>$null
if ($currentBranch -ne "main") {
    Write-Host "[X] 当前不在 main 分支（当前: $currentBranch）" -ForegroundColor Red
    Write-Host "    请先切换: git checkout main" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

# 暂存所有 news 文件改动
git add src/content/news/ 2>&1 | Out-Null

# 检查是否有改动
$staged = git diff --staged --name-only 2>$null
if (-not $staged) {
    Write-Host "没有需要发布的改动。" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 0
}

# 区分已编辑（删除了 AUTO-FETCHED DRAFT 注释）和未编辑的文件
$edited = @()
$notEdited = @()
foreach ($file in $staged) {
    $file = $file.Trim()
    $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
    if ($content -and -not ($content -match "AUTO-FETCHED DRAFT")) {
        $edited += $file
    } else {
        $notEdited += $file
    }
}

Write-Host "已编辑（将发布）: $($edited.Count) 个文件" -ForegroundColor Green
foreach ($f in $edited) { Write-Host "  [+] $f" -ForegroundColor Green }
Write-Host ""
Write-Host "未编辑（不发布，保留在工作区）: $($notEdited.Count) 个文件" -ForegroundColor Yellow
foreach ($f in $notEdited) { Write-Host "  [-] $f" -ForegroundColor Yellow }
Write-Host ""

if ($edited.Count -eq 0) {
    Write-Host "没有已编辑的文件可以发布。" -ForegroundColor Yellow
    Write-Host "发布步骤：" -ForegroundColor Cyan
    Write-Host "  1. 在 VS Code 打开 src\content\news\ 下的 .md 文件" -ForegroundColor Cyan
    Write-Host "  2. 删除文件顶部的 AUTO-FETCHED DRAFT 注释块" -ForegroundColor Cyan
    Write-Host "  3. 翻译 title / summary 字段为中文" -ForegroundColor Cyan
    Write-Host "  4. 替换 '## 中文正文（待编辑）' 下的占位符为真实内容" -ForegroundColor Cyan
    Write-Host "  5. 保存文件 (Ctrl+S)" -ForegroundColor Cyan
    Write-Host "  6. 再次运行此脚本" -ForegroundColor Cyan
    git reset HEAD src/content/news/ 2>&1 | Out-Null
    Read-Host "按回车键退出"
    exit 0
}

# 取消暂存未编辑的文件（只 commit 已编辑的）
foreach ($file in $notEdited) {
    git reset HEAD $file 2>&1 | Out-Null
}

# 询问确认
Write-Host "即将发布以上 $($edited.Count) 个文件到 GitHub main 分支，" -ForegroundColor White
$confirm = Read-Host "Vercel 会自动部署到线上。确认发布？(y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "已取消。文件改动仍保留在工作区。" -ForegroundColor Yellow
    git reset HEAD src/content/news/ 2>&1 | Out-Null
    Read-Host "按回车键退出"
    exit 0
}

# Commit + Push
$commitMsg = "publish: news drafts $(Get-Date -Format 'yyyy-MM-dd')"
git commit -m $commitMsg 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] commit 失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "推送到 GitHub..." -ForegroundColor White
git push origin main 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] push 失败，请检查网络或权限" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "[OK] 已发布到 GitHub！" -ForegroundColor Green
Write-Host "    Vercel 将在 1-2 分钟内自动部署到 https://gta6.sohou.xyz" -ForegroundColor Cyan
Write-Host ""
Read-Host "按回车键退出"
