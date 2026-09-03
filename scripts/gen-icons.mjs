// 一次性脚本：从 .favicon-source.jpg 生成全尺寸 favicon / PWA 图标
// 运行：node scripts/gen-icons.mjs
import sharp from "sharp";
import fs from "node:fs";

const SRC = ".favicon-source.jpg";

// PNG 各尺寸
const pngTargets = [
  ["public/icons/icon-192.png", 192, false],
  ["public/icons/icon-512.png", 512, false],
  ["public/icons/maskable-512.png", 512, true], // maskable：内容缩至 80% 留裁切安全区
  ["public/apple-touch-icon.png", 180, false],
];

for (const [out, size, maskable] of pngTargets) {
  const inner = maskable ? Math.round(size * 0.8) : size;
  const pad = Math.round((size - inner) / 2);
  let img = sharp(SRC).resize(inner, inner);
  if (maskable) {
    img = img.extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 10, g: 10, b: 15, alpha: 1 },
    });
  }
  await img.png().toFile(out);
  console.log("✓", out);
}

// favicon.ico：sharp 不支持 ICO 输出，手写 ICO 容器（PNG-in-ICO，Vista+ 均支持）
// 结构：6 字节文件头 + 每项 16 字节目录 + PNG 数据
const entries = [];
for (const size of [16, 32]) {
  const buf = await sharp(SRC).resize(size, size).png().toBuffer();
  entries.push({ size, buf });
}
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(entries.length, 4);
const dirLen = 16 * entries.length;
let offset = 6 + dirLen;
const dir = Buffer.alloc(dirLen);
entries.forEach(({ size, buf }, i) => {
  const base = i * 16;
  dir.writeUInt8(size === 256 ? 0 : size, base); // 宽
  dir.writeUInt8(size === 256 ? 0 : size, base + 1); // 高
  dir.writeUInt8(0, base + 2); // 调色板数
  dir.writeUInt8(0, base + 3); // reserved
  dir.writeUInt16LE(1, base + 4); // 色彩平面
  dir.writeUInt16LE(32, base + 6); // 位深
  dir.writeUInt32LE(buf.length, base + 8); // 数据长度
  dir.writeUInt32LE(offset, base + 12); // 数据偏移
  offset += buf.length;
});
fs.writeFileSync("src/app/favicon.ico", Buffer.concat([header, dir, ...entries.map((e) => e.buf)]));
console.log("✓ src/app/favicon.ico");

console.log("done");
