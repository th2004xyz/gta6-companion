@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\publish-news.ps1"
echo.
echo ============================================
echo 如果上面有错误信息，请截图发给开发者
echo ============================================
pause
