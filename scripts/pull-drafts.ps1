# GTA6 News - Pull Latest Drafts
# 用 git show 直接写文件，避免 git checkout 的 staging 问题

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
$currentBranch = (git branch --show-current 2>&1) -join ""
Write-Host "当前分支: '$currentBranch'" -ForegroundColor DarkGray
if ($currentBranch.Trim() -ne "main") {
    Write-Host "[!] 正在切换到 main 分支..." -ForegroundColor Yellow
    $sw = git checkout main 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[X] 无法切换到 main" -ForegroundColor Red
        Write-Host $sw -ForegroundColor DarkRed
        Read-Host "按回车键退出"
        exit 1
    }
}

Write-Host ""
Write-Host "[1/5] 从 GitHub 拉取数据..." -ForegroundColor White
$f1 = git fetch origin 2>&1
Write-Host "  fetch origin: $f1" -ForegroundColor DarkGray
$f2 = git fetch origin news-drafts:refs/remotes/origin/news-drafts 2>&1
Write-Host "  fetch news-drafts: $f2" -ForegroundColor DarkGray
if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] 拉取 news-drafts 分支失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "  OK" -ForegroundColor Green

Write-Host ""
Write-Host "[2/5] 读取 news-drafts 分支上的草稿列表..." -ForegroundColor White
$drafts = git ls-tree origin/news-drafts --name-only -- src/content/news/ 2>&1 | Where-Object { $_.Trim() -ne "" }
$draftCount = @($drafts).Count
Write-Host "  远程草稿数量: $draftCount" -ForegroundColor DarkGray

if ($draftCount -eq 0) {
    Write-Host "[X] news-drafts 分支上没有草稿文件" -ForegroundColor Red
    Write-Host "    请手动触发 GitHub Actions:" -ForegroundColor Yellow
    Write-Host "    https://github.com/th2004xyz/gta6-companion/actions/workflows/fetch-news.yml" -ForegroundColor Cyan
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "[3/5] 用 git show 拉取草稿文件到本地..." -ForegroundColor White

# 确保 news 目录存在
$newsDir = Join-Path $projectRoot "src\content\news"
if (-not (Test-Path $newsDir)) {
    New-Item -ItemType Directory -Path $newsDir -Force | Out-Null
    Write-Host "  创建目录: $newsDir" -ForegroundColor DarkGray
}

$newCount = 0
$skipCount = 0
$failCount = 0

foreach ($file in $drafts) {
    $file = $file.Trim()
    if (-not $file) { continue }

    # 本地路径用反斜杠
    $localPath = $file -replace '/', '\'
    $fullPath = Join-Path $projectRoot $localPath

    # 检查本地是否已有此文件
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw -ErrorAction SilentlyContinue
        if ($content -and -not ($content -match "AUTO-FETCHED DRAFT")) {
            Write-Host "  [=] 跳过(已编辑): $file" -ForegroundColor DarkYellow
            $skipCount++
            continue
        }
    }

    # 用 git show 把文件内容写到标准输出，再写入本地文件
    # 这避免了 git checkout 的 staging 问题
    $gitPath = $file -replace '\\', '/'
    $content = git show "origin/news-drafts:$gitPath" 2>&1

    if ($LASTEXITCODE -eq 0 -and $content) {
        # 确保父目录存在
        $parentDir = Split-Path -Parent $fullPath
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }
        # 写入文件（UTF8 无 BOM）
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($fullPath, ($content -join "`r`n"), $utf8NoBom)
        Write-Host "  [+] 新草稿: $file" -ForegroundColor Green
        $newCount++
    } else {
        Write-Host "  [X] 失败: $file" -ForegroundColor Red
        Write-Host "      错误: $content" -ForegroundColor DarkRed
        $failCount++
    }
}

Write-Host ""
Write-Host "[4/5] 清理本地过期未编辑草稿..." -ForegroundColor White
Write-Host "  规则: 仅保留最近 3 天 + 所有已编辑草稿" -ForegroundColor DarkGray
$cutoffDate = (Get-Date).Date.AddDays(-2)  # 3 天前那天的 00:00
$cleanedCount = 0
$keptEditedCount = 0
if (Test-Path $newsDir) {
    $allLocalDrafts = Get-ChildItem -Path $newsDir -Filter "*.md" -ErrorAction SilentlyContinue
    foreach ($f in $allLocalDrafts) {
        # 从文件名提取日期 YYYY-MM-DD-xxx.md
        if ($f.Name -match "^(\d{4}-\d{2}-\d{2})-") {
            $fileDate = [datetime]::ParseExact($matches[1], "yyyy-MM-dd", $null)
            if ($fileDate -lt $cutoffDate) {
                # 超过 3 天的文件：检查是否已编辑
                $content = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
                if ($content -and ($content -match "AUTO-FETCHED DRAFT")) {
                    # 未编辑的旧草稿：删除
                    Remove-Item $f.FullName -Force
                    Write-Host "  [-] 删除过期草稿: $($f.Name)" -ForegroundColor DarkYellow
                    $cleanedCount++
                } else {
                    Write-Host "  [=] 保留(已编辑): $($f.Name)" -ForegroundColor DarkGreen
                    $keptEditedCount++
                }
            }
        }
    }
}
Write-Host "  删除过期未编辑: $cleanedCount 个" -ForegroundColor $(if ($cleanedCount -gt 0) {"Yellow"} else {"DarkGray"})
Write-Host "  保留已编辑旧草稿: $keptEditedCount 个" -ForegroundColor DarkGreen

Write-Host ""
Write-Host "[5/5] 完成！" -ForegroundColor White
Write-Host ""
Write-Host "  新增: $newCount 个" -ForegroundColor Green
Write-Host "  跳过(已编辑): $skipCount 个" -ForegroundColor DarkYellow
Write-Host "  删除过期: $cleanedCount 个" -ForegroundColor $(if ($cleanedCount -gt 0) {"Yellow"} else {"DarkGray"})
Write-Host "  失败: $failCount 个" -ForegroundColor $(if ($failCount -gt 0) {"Red"} else {"DarkGray"})
Write-Host ""

# 列出本地 news 文件夹的实际内容
Write-Host "当前 src\content\news\ 文件夹实际内容:" -ForegroundColor Cyan
$localFiles = Get-ChildItem -Path $newsDir -Filter "*.md" -ErrorAction SilentlyContinue
if ($localFiles) {
    Write-Host "  共 $($localFiles.Count) 个文件:" -ForegroundColor DarkGray
    foreach ($f in $localFiles) {
        Write-Host "    $($f.Name)" -ForegroundColor DarkGray
    }
} else {
    Write-Host "  [!] 文件夹为空或不存在！" -ForegroundColor Red
    Write-Host "  路径: $newsDir" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "提示:" -ForegroundColor Yellow
Write-Host "  - 如果 VS Code 文件树看不到新文件，按 Ctrl+Shift+P 输入 'Refresh'" -ForegroundColor Yellow
Write-Host "  - 编辑完成后双击 publish-news.bat 发布" -ForegroundColor Cyan
Write-Host ""
Read-Host "按回车键退出"
