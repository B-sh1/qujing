import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // 相对基路径：产物既能挂在 GitHub Pages 的项目子路径（/仓库名/）下，
  // 也能直接当根站点或本地文件打开，换仓库名、换域名都不用改这里。
  base: "./",
  plugins: [react({ jsxRuntime: "automatic" })],
  esbuild: {
    jsx: "automatic",
  },
  server: {
    port: 5273,
    host: true,
    watch: {
      // 视频文件经常被整体替换，监听它们会让 dev server 因文件锁而崩掉。
      ignored: ["**/public/videos/**"],
    },
  },
  build: {
    outDir: "dist",
  },
});
