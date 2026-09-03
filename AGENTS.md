<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:user-workflow-rules -->
# 工作流强制规则（用户要求，2026-09-03）

1. **推送/长命令超时必须先告知用户**：git push、部署、安装依赖等命令若超过 2 分钟未成功（或第一次失败），必须立即停止并告知用户，等待用户决定后再行动。
2. **不得擅自安装软件或改动代码**：未经用户明确同意，不得自行安装新软件/依赖，不得因推送受阻等原因擅自开展用户未安排的代码改动。
3. **遇阻即报告**：任何被阻塞的操作（认证缺失、权限不足、网络失败）应在发现后第一时间告知用户，而不是转向其他工作。
<!-- END:user-workflow-rules -->
