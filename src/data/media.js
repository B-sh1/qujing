import { asset } from "./content.js";
import { imageVariants } from "./imageVariants.js";

/**
 * 图片的响应式取用规则。
 *
 * 每张实拍图在 scripts/optimize-images.mjs 里预先转好了 720 / 1080 / 1440 三档 WebP，
 * 这里负责给 <img> 拼 srcSet，让手机只下载它那块位置真正需要的尺寸；
 * 不支持 WebP 的老浏览器会继续用 src 上的原 JPEG 兜底。
 */

export function srcSetFor(src) {
  // 传进来的是 asset() 拼过的地址（形如 "./images/x.jpg"），
  // 而清单的键是 "/images/x.jpg"，这里按文件名对齐。
  const name = src.match(/images\/([^/?#]+)$/)?.[1];
  const widths = name ? imageVariants[`/images/${name}`] : null;
  if (!widths || !widths.length) return undefined;
  return widths
    .map((w) => `${asset(src.replace(/\.jpe?g$/i, `-${w}.webp`))} ${w}w`)
    .join(", ");
}

/**
 * 没显式传 sizes 时按版式猜一个：右侧窄栏里的竖图按 70vw 算，
 * 其余（整幅、横幅、大图）都按整版宽算。
 */
export function sizesFor(className = "") {
  if (/portrait|note-media|lede-media|media-extra/.test(className)) {
    return "(max-width: 720px) 70vw, 640px";
  }
  return "(max-width: 720px) 100vw, 1000px";
}
