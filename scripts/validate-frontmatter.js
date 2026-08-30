// 校验所有 content md 文件的 frontmatter 是否能被 gray-matter 正确解析
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const root = path.join(__dirname, "..", "src", "content");
const dirs = ["news", "characters", "vehicles", "activities"];
let fail = 0;

for (const dir of dirs) {
  const dirPath = path.join(root, dir);
  for (const f of fs.readdirSync(dirPath)) {
    if (!f.endsWith(".md")) continue;
    const file = path.join(dirPath, f);
    const raw = fs.readFileSync(file, "utf8");
    try {
      matter(raw);
    } catch (e) {
      fail++;
      const line = (e.mark && e.mark.line != null) ? e.mark.line + 1 : "?";
      console.log(`FAIL ${dir}/${f} (line ${line}): ${e.reason}`);
    }
  }
}
console.log(fail === 0 ? "ALL OK" : `${fail} file(s) failed`);
