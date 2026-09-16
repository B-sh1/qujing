/**
 * 把 public/videos 下的封面视频重压一遍（手机流量友好版）。
 *
 * 调参依据：这类片子都压在深色蒙版下面，主要看轮廓和氛围，
 * 所以按 1280–1600 宽 + CRF 29–33 重编，去掉音轨、开 faststart，
 * 换来的是首屏流量从 25.8MB 降到 8.3MB。
 *
 * 原片请先备份：脚本会把改前的文件复制到 _qa/video-originals/（该目录不进仓库）。
 * 用法：node scripts/optimize-videos.mjs
 */
import { execFile } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const FFMPEG = path.resolve("node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe");
const DIR = path.resolve("public/videos");
const BACKUP = path.resolve("_qa/video-originals");

// 每个片子的目标宽度和 CRF：水印裁切比例、画面细节不同，参数单独调过。
const SETTINGS = {
  "hero.mp4": { width: 1600, crf: 31 },
  "mountain.mp4": { width: 1280, crf: 31 },
  "field.mp4": { width: 1280, crf: 31 },
  "mutual.mp4": { width: 1360, crf: 32 },
};

mkdirSync(BACKUP, { recursive: true });

for (const [name, { width, crf }] of Object.entries(SETTINGS)) {
  const src = path.join(DIR, name);
  const backup = path.join(BACKUP, name);
  try {
    if (statSync(backup).size === 0) throw new Error("空的备份");
  } catch {
    copyFileSync(src, backup);
    console.log(`备份原片 → _qa/video-originals/${name}`);
  }

  const out = path.join(DIR, `${name}.tmp.mp4`);
  await run(FFMPEG, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", backup,
    "-an",
    "-vf", `scale=${width}:-2:flags=lanczos`,
    "-c:v", "libx264", "-preset", "slow", "-crf", String(crf),
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    out,
  ]);
  const before = statSync(backup).size;
  const after = statSync(out).size;
  copyFileSync(out, src);
  console.log(
    `${name}: ${(before / 1048576).toFixed(2)} MB → ${(after / 1048576).toFixed(2)} MB（${width} 宽 / CRF ${crf}）`
  );
}

const total = readdirSync(DIR)
  .filter((f) => f.endsWith(".mp4"))
  .reduce((s, f) => s + statSync(path.join(DIR, f)).size, 0);
console.log(`\n现在 public/videos 合计 ${(total / 1048576).toFixed(2)} MB`);
