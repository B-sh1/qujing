/**
 * 把 public/images 下的实拍图转成多档 WebP，供页面用 srcset 按屏幕宽度取用。
 *
 * 做什么：
 *   1. 每张图按 720 / 1080 / 1440 三档生成 WebP（原图比某一档还小就跳过那一档，不放大）；
 *   2. 重新生成 src/data/imageVariants.js，记录每张原图实际有哪几档；
 *   3. 原 JPEG 保留不删，作为不支持 WebP 的老浏览器兜底。
 *
 * 用法：node scripts/optimize-images.mjs
 */
import { execFile } from "node:child_process";
import { readdirSync, statSync, writeFileSync, mkdirSync, rmSync, readFileSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const FFMPEG = path.resolve("node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe");
const SRC_DIR = path.resolve("public/images");
const WIDTHS = [720, 1080, 1440];
const QUALITY = 78;

async function probeSize(file) {
  const { stderr } = await run(FFMPEG, ["-hide_banner", "-i", file], { maxBuffer: 1 << 24 }).catch(
    (e) => ({ stderr: e.stderr ?? "" })
  );
  const m = stderr.match(/Video:.*?, (\d{2,5})x(\d{2,5})/);
  if (!m) throw new Error(`读不出尺寸: ${file}`);
  return { width: Number(m[1]), height: Number(m[2]) };
}

async function convert(file, width) {
  const out = file.replace(/\.jpe?g$/i, `-${width}.webp`);
  await run(FFMPEG, [
    "-hide_banner",
    "-loglevel", "error",
    "-y",
    "-i", file,
    "-vf", `scale=${width}:-2:flags=lanczos`,
    "-c:v", "libwebp",
    "-quality", String(QUALITY),
    "-compression_level", "6",
    "-pix_fmt", "yuv420p",
    out,
  ]);
  return out;
}

/** 扫一遍源码，找出页面真正引用到的图；没引用的备选素材不生成 WebP。 */
function referencedImages() {
  const used = new Set();
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      // 别读上一次生成的清单，否则它自己就成了「引用来源」
      else if (entry.name === "imageVariants.js") continue;
      else if (/\.(jsx?|html)$/i.test(entry.name)) {
        const text = readFileSync(full, "utf8");
        for (const m of text.matchAll(/\/images\/[^"'\s)]+\.jpe?g/g)) used.add(path.basename(m[0]));
      }
    }
  };
  walk(path.resolve("src"));
  const html = readFileSync(path.resolve("index.html"), "utf8");
  for (const m of html.matchAll(/\/images\/[^"'\s)]+\.jpe?g/g)) used.add(path.basename(m[0]));
  return used;
}

const allJpg = readdirSync(SRC_DIR).filter((f) => /\.jpe?g$/i.test(f));
const used = referencedImages();
const files = allJpg.filter((f) => used.has(f)).map((f) => path.join(SRC_DIR, f));

console.log(
  `引用到的原图 ${files.length} 张（备选素材 ${allJpg.filter((f) => !used.has(f)).length} 张跳过），档位 ${WIDTHS.join(" / ")}`
);

const manifest = {};
const jobs = [];
for (const file of files) {
  const { width, height } = await probeSize(file);
  const key = `/images/${path.basename(file)}`;
  const usable = WIDTHS.filter((w) => w < width);
  manifest[key] = usable;
  for (const w of usable) jobs.push({ file, w, key, src: `${width}x${height}` });
}

let done = 0;
let savedOriginal = 0;
let savedWebp = 0;
const CONCURRENCY = 4;

async function worker() {
  while (jobs.length) {
    const job = jobs.shift();
    const out = await convert(job.file, job.w);
    done += 1;
    savedOriginal += statSync(job.file).size;
    savedWebp += statSync(out).size;
    if (done % 10 === 0) console.log(`  已完成 ${done}/${done + jobs.length}`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

mkdirSync("src/data", { recursive: true });
const body = `// 由 scripts/optimize-images.mjs 生成，请勿手改。
// 每一项是「原图路径 → 已生成的 WebP 宽度档位」。
export const imageVariants = ${JSON.stringify(manifest, null, 2)};
`;
writeFileSync("src/data/imageVariants.js", body, "utf8");

// 清掉上一次生成、这次不再需要的 WebP
let removed = 0;
for (const f of readdirSync(SRC_DIR).filter((f) => f.endsWith(".webp"))) {
  const key = `/images/${f.replace(/-\d+\.webp$/, path.extname(f).replace(".webp", ".jpg"))}`;
  if (!manifest[key]?.some((w) => f.endsWith(`-${w}.webp`))) {
    rmSync(path.join(SRC_DIR, f));
    removed += 1;
  }
}

console.log(`\n生成完毕：${done} 个 WebP`);
if (removed) console.log(`清理掉 ${removed} 个不再需要的 WebP`);
console.log(`抽出这些档位的总体积：JPEG ${(savedOriginal / 1048576).toFixed(1)} MB → WebP ${(savedWebp / 1048576).toFixed(1)} MB`);
const dist = readdirSync(SRC_DIR).filter((f) => f.endsWith(".webp"));
console.log(`目录里现有 ${dist.length} 个 webp 文件`);
