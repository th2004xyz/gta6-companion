# GTA6 News - Pull Latest Drafts
# 拉取 news-drafts 分支上的草稿到本地
# 已编辑的文件（删除了 AUTO-FETCHED DRAFT 注释的）不会被覆盖

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 切换到项目根目录（scripts/ 的上一级）
$projectRoot = Split-Path -Parent -Path (Split-Path -Parent -Path $MyInvocation.MyCommand.Path)
Set-Location -Path $projectRoot

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  GTA6 News - 拉取最新草稿" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "项目目录: $projectRoot" -ForegroundColor DarkGray
Write-Host ""

# 确保在 main 分支
$currentBranch = git branch --show-current 2>&1
Write-Host "当前分支: $currentBranch" -ForegroundColor DarkGray
if ($currentBranch -ne "main") {
    Write-Host "[!] 正在切换到 main 分支..." -ForegroundColor Yellow
    git checkout main 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[X] 无法切换到 main。请先在 VS Code 终端运行: git status" -ForegroundColor Red
        Write-Host "    看看有没有未提交的改动，提交或丢弃后再试。" -ForegroundColor Yellow
        Read-Host "按回车键退出"
        exit 1
    }
}

Write-Host ""
Write-Host "[1/4] 从 GitHub 拉取数据..." -ForegroundColor White
git fetch origin 2>&1 | Out-Null
git fetch origin news-drafts:refs/remotes/origin/news-drafts 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] 拉取 news-drafts 分支失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "  OK" -ForegroundColor Green

Write-Host ""
Write-Host "[2/4] 读取 news-drafts 分支上的草稿列表..." -ForegroundColor White
$drafts = git ls-tree origin/news-drafts --name-only -- src/content/news/ 2>&1
$draftCount = ($drafts | Measure-Object).Count
Write-Host "  远程草稿数量: $draftCount" -ForegroundColor DarkGray

if ($draftCount -eq 0) {
    Write-Host "[X] news-drafts 分支上没有草稿文件" -ForegroundColor Red
    Write-Host "    请手动触发 GitHub Actions:" -ForegroundColor Yellow
    Write-Host "    https://github.com/th2004xyz/gta6-companion/actions/workflows/fetch-news.yml" -ForegroundColor Cyan
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "[3/4] 拉取草稿文件到本地..." -ForegroundColor White

$newCount = 0
$skipCount = 0
$failCount = 0

foreach ($file in $drafts) {
    $file = $file.Trim()
    if (-not $file) { continue }

    $localPath = $file -replace '/', '\'

    # 检查本地是否已有此文件
    if (Test-Path $localPath) {
        # 文件已存在，检查是否已编辑（无 AUTO-FETCHED DRAFT 注释 = 已编辑）
        $content = Get-Content $localPath -Raw -ErrorAction SilentlyContinue
        if ($content -and -not ($content -match "AUTO-FETCHED DRAFT")) {
            # 已编辑，跳过不覆盖
            Write-Host "  [=] 跳过(已编辑): $file" -ForegroundColor DarkYellow
            $skipCount++
            continue
        }
    }

    # 拉取文件（显示错误信息，不再隐藏）
    $result = git checkout origin/news-drafts -- $file 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [+] 新草稿: $file" -ForegroundColor Green
        $newCount++
    } else {
        Write-Host "  [X] 失败: $file" -ForegroundColor Red
        Write-Host "      $result" -ForegroundColor DarkRed
        $failCount++
    }
}

# 取消 git 暂存（checkout 会自动 stage，需要 unstage 以便后续选择性发布）
git reset HEAD src/content/news/ 2>&1 | Out-Null

Write-Host ""
Write-Host "[4/4] 完成！" -ForegroundColor White
Write-Host ""
Write-Host "  新增: $newCount 个" -ForegroundColor Green
Write-Host "  跳过(已编辑): $skipCount 个" -ForegroundColor DarkYellow
Write-Host "  失败: $failCount 个" -ForegroundColor $(if ($failCount -gt 0) {"Red"} else {"DarkGray"})
Write-Host ""

# 列出本地 news 文件夹的实际内容
Write-Host "当前 src\content\news\ 文件夹内容:" -ForegroundColor Cyan
$localFiles = Get-ChildItem -Path "src\content\news" -Filter "*.md" -ErrorAction SilentlyContinue
if ($localFiles) {
    Write-Host "  共 $($localFiles.Count) 个文件:" -ForegroundColor DarkGray
    foreach ($f in $localFiles) {
        Write-Host "    $($f.Name)" -ForegroundColor DarkGray
    }
} else {
    Write-Host "  [!] 文件夹为空或不存在！" -ForegroundColor Red
}

Write-Host ""
Write-Host "提示: 如果在 VS Code 文件树中看不到新文件，" -ForegroundColor Yellow
Write-Host "      请在 VS Code 文件资源管理器中点击刷新按钮，" -ForegroundColor Yellow
Write-Host "      或按 Ctrl+Shift+P 输入 'Refresh' 刷新文件资源管理器。" -ForegroundColor Yellow
Write-Host ""
Write-Host "编辑完成后，双击 publish-news.bat 发布。" -ForegroundColor Cyan
Write-Host ""
Read-Host "按回车键退出"
