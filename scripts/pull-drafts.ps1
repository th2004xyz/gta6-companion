# GTA6 News - Pull Latest Drafts
# 仅拉取本地不存在的草稿，不会覆盖已编辑的文件

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 切换到项目根目录（scripts/ 的上一级）
$projectRoot = Split-Path -Parent -Path (Split-Path -Parent -Path $MyInvocation.MyCommand.Path)
Set-Location -Path $projectRoot

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  GTA6 News - 拉取最新草稿" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 确保在 main 分支
$currentBranch = git branch --show-current 2>$null
if ($currentBranch -ne "main") {
    Write-Host "[!] 当前分支: $currentBranch，正在切换到 main..." -ForegroundColor Yellow
    git checkout main 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[X] 无法切换到 main 分支。请先提交或丢弃当前改动。" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
}

Write-Host "[1/3] 从 GitHub 拉取最新数据..." -ForegroundColor White
git fetch origin 2>&1 | Out-Null

Write-Host ""
Write-Host "[2/3] 检查 news-drafts 分支上的草稿..." -ForegroundColor White

# 获取 news-drafts 上的所有 news 文件
$drafts = git ls-tree origin/news-drafts --name-only -- src/content/news/ 2>$null
if (-not $drafts) {
    Write-Host "[X] news-drafts 分支不存在或没有草稿。" -ForegroundColor Red
    Write-Host "    请等待 GitHub Actions 首次运行（每天 8AM 北京时间），" -ForegroundColor Yellow
    Write-Host "    或手动触发：" -ForegroundColor Yellow
    Write-Host "    https://github.com/th2004xyz/gta6-companion/actions/workflows/fetch-news.yml" -ForegroundColor Cyan
    Read-Host "按回车键退出"
    exit 1
}

# 只拉取本地不存在的文件（避免覆盖已编辑的文件）
$newCount = 0
foreach ($file in $drafts) {
    $file = $file.Trim()
    if (-not (Test-Path $file)) {
        git checkout origin/news-drafts -- $file 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [+] 新草稿: $file" -ForegroundColor Green
            $newCount++
        }
    }
}

Write-Host ""
Write-Host "[3/3] 完成！" -ForegroundColor White
if ($newCount -eq 0) {
    Write-Host "今天没有新草稿（可能都已拉取过）。" -ForegroundColor Yellow
} else {
    Write-Host "共拉取 $newCount 个新草稿。" -ForegroundColor Green
}
Write-Host ""
Write-Host "草稿位置: src\content\news\" -ForegroundColor Cyan
Write-Host "请在 VS Code 中编辑这些 .md 文件，" -ForegroundColor Cyan
Write-Host "编辑完成后双击 publish-news.bat 发布。" -ForegroundColor Cyan
Write-Host ""
Read-Host "按回车键退出"
