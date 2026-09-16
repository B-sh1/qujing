# 曲靖 · 山水与田野

一个把「曲靖风景」与「曲靖乡村振兴」并置的移动端优先展示站点。React + Vite 实现，整页翠绿色调，滚动动效自然克制。

## 运行

```bash
pnpm install
pnpm dev      # http://localhost:5273
pnpm build    # 产物输出到 dist/
pnpm preview  # 预览构建产物 http://localhost:4173
```

> 本机没有全局 npm，项目用 pnpm。当前环境的 pnpm 会拦截依赖的安装脚本，所以 `pnpm-workspace.yaml` 里关掉了安装前的依赖校验，脚本也直接调用 `node node_modules/vite/bin/vite.js`，不需要额外授权。

## 部署到 GitHub Pages

站点是纯静态产物，仓库里已经放了 `.github/workflows/deploy.yml`：推到 `main` 就会自动构建并发布，之后每次改文案 / 换图推一次就自动更新。

1. 在 GitHub 上建一个**空仓库**（不勾 README、不勾 .gitignore），例如叫 `qujing`。
2. 本地关联并推送：

   ```bash
   git remote add origin https://github.com/<用户名>/<仓库名>.git
   git push -u origin main
   ```

3. 打开仓库 **Settings → Pages**，把 **Source** 选成 **GitHub Actions**（只需设置一次）。
4. 等 Actions 里那条 `Deploy to GitHub Pages` 跑完，访问 `https://<用户名>.github.io/<仓库名>/`。

几点要注意的：

- `vite.config.js` 的 `base` 是 `"./"`，产物里所有资源都走相对路径，所以仓库叫什么都不用改配置；换成自有域名、或者直接建成 `<用户名>.github.io` 根仓库也一样能用。
- 文案里引用图片 / 视频必须走 `src/data/content.js` 导出的 `asset()`，别写 `/images/xxx.jpg` 这种从域名根开始的绝对路径——挂到 `/<仓库名>/` 子路径下会 404。
- `index.html` 里的 `og:image` / `twitter:image` 还是相对地址，微信、微博这类抓缩略图的地方抓不到；上线后换成正式域名下的绝对地址即可。
- 仓库里有 4 段背景视频（合计约 27MB），首次 clone 和 CI 构建会稍慢一点。GitHub Pages 的限额是单文件 100MB、站点总量 1GB，目前远没到。

## 页面结构

| 区块 | 锚点 | 导航 | 内容 |
| --- | --- | --- | --- |
| 首页封面 | `#top` | — | 全屏背景「曲靖夜景」视频 + 大标题「清凉曲靖」+ 固定导航 |
| 01 避暑胜地 | `#summer` | 避暑 | 曲靖城区：物价、气候环境、居民日常、外地人感受 |
| 山水封面 | `#scenery` | 山水 | 全屏背景「大山」视频 + 大标题「山水曲靖」 |
| 02 山水有信 | `#scenery-detail` | 山水 | 会泽大海草山、九龙瀑布、珠江源、会泽古城 |
| 田野封面 | `#rural` | 田野 | 全屏背景「田里的人和动物」视频 + 大标题「田野曲靖」 |
| 03 田野有声 | `#rural-detail` | 田野 | 农民劳作、田园轮作、航拍村庄全景 + 田野长幅 |
| 互助封面 | `#economy` | 互助 | 全屏背景「秋收」视频 + 大标题「互助曲靖」 |
| 04 山货出山 | `#economy-detail` | 互助 | 3 张整行大卡 + 1 段收尾：这些年乡村经济互助的模式 |
| 收尾页 | `#contact` | 联系 | 整屏收尾：曲靖城区航拍背景 + 大字收束 + 页脚 |

四张全屏封面分别由 `content.js` 的 `hero` / `sceneryCover` / `ruralCover` / `economyCover` 控制，章节序号由 `index` 字段控制，插章、换序只改这些字段（页面顺序在 `src/App.jsx` 里调整）。01 章的配图有两个入口：章首导语右侧用 `summer.ledeImage`，某一节小标题下方用 `summer.notes[n].image` + `alt`，可选 `imageRatio` 单独控制图幅比例（不写默认 4:5）。03 章 `rural.blocks[n]` 目前每段一张图；代码支持再加 `image2` / `alt2`，会在主图下面堆一张缩到 70% 靠右的竖图，现在没有段落用到。

04 章给 `economy.cards[n]` 加 `image` + `alt`，这张卡就会从半宽小卡自动变成整行大卡（文字左、图右，和 01 首卡同一套 `card--feature` 版式）；不加就还是原来的半宽卡。整行卡是 `grid-column: 1 / -1`，半宽卡剩单数张时会在同一行右侧留出一个空位——现在 01、02、03 全是整行卡（都带图），没有半宽卡，所以不留空位。以后加半宽卡要凑成偶数张。

04 章新增的实拍：`qujing-vegetable-field.jpg`（01 卡，原图 960×723，按 16:10 裁成 960×600，同时切掉左上角水印）、`yanshuihe-pomegranate.jpg`（02 卡，原图 1400×933，按 16:10 裁成 1400×875）、`fuyuan-marigold.jpg`（03 卡，原图 1528×1024，按 16:10 裁成 1528×955）。三张都按 16:10 出图，与 `.card--feature .media` 的比例一致。

`economy.closing` 不按卡片渲染，走 `Economy.jsx` 里的 `.economy__outro`：顶部一条细线，然后是标题和 21–34px 的衬线大字正文，作为 04 章的收尾（这段的 `index` 和 `keys` 字段现在不渲染，留着备用）。想让它退回普通卡片，把那段 JSX 换回 `.card--wide` 即可（`.card--wide` 的样式还留着）。

收尾页的背景图走 `contact.image`，现在是 `qujing-skyline.jpg`（用户提供的城区航拍，原图 3840×2160，缩到 1920×1080）。这张图正中间压着一块黄色的「曲靖 QUJING」台标，所以 `.closing__bg img` 用 `object-position: 0% 58%` 往左取景，把台标推到画面右侧，避开左下角的收尾文案；换没有台标的图时这行可以删掉。

封面锚点按「封面 = 裸章节名、正文 = 章节名 + `-detail`」的约定写：导航点 `#economy` 落在封面，封面底部的「向下」落到 `#economy-detail`。

## 全屏封面（视频）

首屏和「山水曲靖」封面共用 `src/components/MediaCover.jsx`，数据分别在 `content.js` 的 `hero` 和 `sceneryCover`。共用行为：

- 一律静音自动播放，不会出声；
- 滑出视口自动暂停、回到视口再继续（`IntersectionObserver`，阈值 12%）；
- 取不到视频、或用户开了「减少动态效果」时，自动回落到静帧，不会白屏；
- 背景视差、文字上浮、底部渐隐到页面底色，两处完全一致。

| 文件 | 用途 | 规格 | 说明 |
| --- | --- | --- | --- |
| `public/videos/hero.mp4` | 首屏「清凉曲靖」 | 1920×1080 / 32.8s / 10.3MB | 右上角原有「抚仙居士 + bilibili」台标，用 `videoCrop` 放大 1.25 倍、以左下角为原点裁掉右侧与上方各 20%，把台标推出可视区 |
| `public/videos/mountain.mp4` | 「山水曲靖」封面 | 1600×900 / 20.0s / 4.0MB | 由 2 分 52 秒的源片裁出前 20 秒、去掉音轨、CRF 25 重压；`clipSeconds: 20` 是兜底，换更长的源片也只在 0–20 秒循环 |
| `public/videos/field.mp4` | 「田野曲靖」封面 | 1600×900 / 20.0s / 4.6MB | 由「田里的人和动物」的 31–51 秒裁出、去掉音轨、CRF 25 重压；静帧兜底 `public/images/field-cover.jpg` 取自同一段视频的第 9 秒 |
| `public/videos/mutual.mp4` | 「互助曲靖」封面 | 1920×1080 / 13.9s / 7.0MB | 原片直接用，未重压（时长够短）。画面右上角有「弄勒铮不戳 + bilibili」台标（x≈0.79 起）、右下角有「SENJUE」（x≈0.735 起），用 `videoCrop: { keepWidth: 0.72 }` 只保留左侧 72% 把两处一起切掉；静帧兜底 `public/images/mutual-cover.jpg` 取自第 3.5 秒 |

换片：把新文件放进 `public/videos/` 覆盖同名文件即可。`.mp4` / `.webm` 都支持，浏览器按 `videoSources` 顺序尝试。如果新片也有水印，改 `videoCrop` 的 `scale` / `origin`；如果要改播放区间，改 `clipSeconds`。

`videoCrop` 有两种写法，按水印在画面的位置选：

- `{ scale, origin }`——整体放大若干倍、以某个角为原点，右侧和上方（或其它方向）各切掉一部分。首屏用它，代价是画面被放大。
- `{ keepWidth }`——只保留画面左侧这一比例（0–1），等比裁切、不放大不拉伸，适合水印在右侧的情况。用这种写法时，配套的静帧 `image` 要按同一比例预先裁好（否则视频和回落静帧的取景会不一样）。

> **加完新视频要重启 `pnpm dev`。** `vite.config.js` 把 `public/videos/` 排除在文件监听之外——视频常被整体替换，监听会导致 dev server 因文件锁崩溃（Windows 上会直接 `EBUSY` 挂掉）。代价是 dev server 运行期间新放进来的视频不会被登记，必须重启一次才会被当作视频文件返回，否则会走 SPA 兜底、返回 `text/html` 导致视频播不出来。

## 设计系统

- 色板：`--ink #05130e` / `--forest #0a1f17` / `--jade #35a277` / `--jade-soft #7fd3a6` / `--mist #e9f4ec` / `--sage #93ac9d`
- 字体：标题走系统衬线栈（Songti SC / 思源宋体 / SimSun），正文走系统无衬线栈（PingFang SC / 微软雅黑）。不依赖外部字体 CDN。
- 版心：`--container: 1000px`，移动端留 22px 边距，≥720px 留 40px。
- 圆角统一 3px，分隔线统一 1px `--line`，不使用重阴影。
- 动效：基于 `framer-motion`，图片为「遮罩展开 + 轻微缩放」，文字为「上浮淡入」，Hero 背景为滚动视差；顶部有滚动进度线；`prefers-reduced-motion` 下自动降级。

## 需要你确认 / 替换的地方

1. **配图**：
   - 你提供的实拍：`caoshan-ridge.jpg`、`caoshan-stream.jpg`、`caoshan-valley.jpg`（会泽大海草山，02 章开头）、`zhujiangyuan.jpg`（珠江源，02 章双图）、`waterfall.jpg`（九龙瀑布，02 章双图，原图为 3200×4268 竖构图，已按宽幅取景裁成 1600×800）、`luoping-rapeseed.jpg`（罗平油菜花，03 章花期，原图为 2000×3556 竖构图，已裁成 1400×875）、`luliang-fields.jpg`（陆良坝子航拍，03 章田园，来源是 939×468 的截图，分辨率偏低，若有原图建议替换）、`huize-mountain-sheep.jpg`（会泽山间羊群，03 章牧歌，原图 4800×3200，裁成 1600×1000）、`shizong-rice.jpg`（师宗稻田，03 章横幅，原图 1920×1080，已按 16:7 取景裁成 1920×840）、`qujing-city-aerial.jpg`（城区航拍，01 章导语右侧）、`qujing-noodles.jpg`（米线，01 章 01 节）、`qujing-park.jpg`（城区公园，01 章 02 节）、`qujing-plaza.jpg`（广场夜景，01 章 03 节）、`qujing-greenway.jpg`（雨后绿道，01 章 04 节）。
   - 备用素材（放在 `_qa/`，不打包进 `dist/`）：`luoping-terraces.jpg`（罗平梯田航拍，罗平那段试过加第二张图、后来撤掉了）、`nizhuhe-bridge.jpg`（尼珠河玻璃桥的俯拍，横幅先试过这张、后来换成峡谷那张）、`waterfall-pexels-backup.jpg`（被替换掉的九龙瀑布占位图）。
   - `mutual-cover.jpg`（「互助曲靖」封面静帧）不是单独拍的，是从你给的 `秋收最美的不是庄稼，是农民的笑脸！.mp4` 第 3.5 秒取的一帧、并裁掉右侧 28% 去掉水印。想换镜头就改这一张。
   - 04 章首卡已换成实拍 `qujing-vegetable-field.jpg`（原图 960×723，已按卡片 16:10 取景裁成 960×600，顺带切掉左上角的水印）。被换掉的九龙瀑布占位图留在 `_qa/waterfall-pexels-backup.jpg`，不需要可以删。
   - 目前没有页面引用的备选：`farmer.jpg`（03 章花期原来是它，已换成罗平油菜花）、`terraces.jpg`（03 章田园原来是它，已换成陆良坝子航拍）、`village-aerial.jpg`（03 章牧歌原来是它，后来做收尾页背景、现已换成城区航拍）、`field-clouds.jpg`（03 章横幅原来是它，也曾挂在 `contact.image` 上）、`nizhuhe-canyon.jpg`（尼珠河大峡谷，03 章横幅原来是它，已换成师宗稻田；来源是 632×945 的竖图截图、裁成 1000×438，若以后换回来建议找原图）、`rice-detail.jpg`（Pexels 免费授权的水稻特写，04 章首卡原来是它，已换成菜地实拍）、`lake.jpg`、`architecture.jpg`、`grassland.jpg`、`qujing-night-market.jpg`。它们仍会被打包进 `dist/`，确认不要了可以直接删。
   - `public/images/grassland.jpg`（原先占位的草地图）现在没有页面引用，可以留着备选，也可以直接删掉。
2. **文案**：`src/data/content.js` 是全部站点文案的唯一入口，地名、描述、卡片模式都在这里改。
3. **联系方式**：已移除。原来收尾页那两行（合作邮箱 `hello@qujing-rural.example.com`、联系地址）连同 `content.js` 里的 `contact.rows` 一起删掉了；收尾页本身还在，只剩大字和页脚。要加回来就在 `contact` 里补 `rows`、在 `Closing.jsx` 里恢复 `Reveal className="contact"` 那段（`.contact` 的样式还留着）。
4. 图片生成工具在当前环境不可用（内置 `image_gen` 未接入、`OPENAI_API_KEY` 未配置），所以这一版没有走 AI 生图，直接用了实拍素材。

## 目录

```
src/
  App.jsx                 组合页面 + 滚动进度线
  data/content.js         全部文案数据
  components/
    SiteNav.jsx           固定导航 + 移动端目录面板
    Hero.jsx              全屏 Hero（视差）
    SectionIntro.jsx      区块标题（序号 / 标题 / 引导语）
    Scenery.jsx           风景模块
    Summer.jsx            避暑章节（纯文字，支持后续插图）
    Rural.jsx             乡村振兴模块
    Economy.jsx           卡片模块
    Closing.jsx           整屏收尾 + 联系方式
    Reveal.jsx            动效原语（Reveal / RevealMedia）
  styles/global.css       设计令牌与全部样式
```
