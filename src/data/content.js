// 资源路径统一走 Vite 的基路径：这样站点既能挂在域名根目录，
// 也能挂在 GitHub Pages 的项目子路径（/仓库名/）下，图片和视频都不会 404。
// 路径字符串一律包一层 asset()，别直接写媒体路径字面量：从域名根开始的绝对路径换子路径就断。
export const asset = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

export const nav = [
  { label: "避暑", href: "#summer" },
  { label: "山水", href: "#scenery" },
  { label: "田野", href: "#rural" },
  { label: "互助", href: "#economy" },
  { label: "结尾", href: "#contact" },
];

export const hero = {
  id: "top",
  title: "清凉曲靖",
  latin: "QUJING · YUNNAN",
  line: "二十度的夏天，从珠江源开始。",
  meta: ["乌蒙山 · 珠江源", "城区海拔约 1900M", "夏季均温 20℃ 上下"],
  image: asset("/images/hero-mountain.jpg"),
  alt: "曲靖乌蒙山间被晨雾覆盖的翠绿山脊",
  focus: "62% 50%",
  // 首屏背景视频：把文件放到 public/videos/ 下即可，无需改代码。
  // 视频一律静音播放；两个源按顺序尝试，都取不到时自动回落到上面的背景图。
  videoSources: [
    { src: asset("/videos/hero.mp4"), type: "video/mp4" },
    { src: asset("/videos/hero.webm"), type: "video/webm" },
  ],
  // 源片右上角有台标水印（约占 x 81%–100%、y 5%–10%）。
  // 以左下角为原点放大 1.25 倍，等于裁掉画面右侧 20%、上方 20%，把水印推出可视区。
  // 换片之后按新水印的位置调这两个值即可。
  videoCrop: { scale: 1.25, origin: "0% 100%" },
  scrollHref: "#summer",
  priority: true,
  headingLevel: 1,
};

// 02 章「山水有信」之前的全屏大图，视觉与首屏封面共用 MediaCover。
// 视频已用 ffmpeg 裁到前 20 秒、去掉音轨、压到 1600×900；clipSeconds 是兜底，
// 万一以后换成更长的源片，也只在 0–20 秒之间循环。
export const sceneryCover = {
  id: "scenery",
  title: "山水曲靖",
  latin: "QUJING · LANDSCAPE",
  line: "山在那里，水也在那里，只是它们不着急。",
  meta: ["大海草山", "九龙瀑布", "珠江源"],
  image: asset("/images/caoshan-ridge.jpg"),
  alt: "会泽大海草山被云雾覆盖的绿色山脊",
  focus: "50% 55%",
  videoSources: [{ src: asset("/videos/mountain.mp4"), type: "video/mp4" }],
  clipSeconds: 20,
  scrollHref: "#scenery-detail",
};

// 03 章「田野有声」之前的全屏大图。视频取自「田里的人和动物」的 31–51 秒，
// 已用 ffmpeg 裁成 20 秒、去掉音轨、压到 1600×900；静帧兜底取自同一段视频。
export const ruralCover = {
  id: "rural",
  title: "田野曲靖",
  latin: "QUJING · FARMLAND",
  line: "人弯腰的时候，一年就开始了。",
  meta: ["罗平 · 春耕", "陆良 · 轮作", "会泽 · 山村"],
  image: asset("/images/field-cover.jpg"),
  alt: "水田里弯腰劳作的农人",
  focus: "50% 55%",
  videoSources: [{ src: asset("/videos/field.mp4"), type: "video/mp4" }],
  clipSeconds: 20,
  scrollHref: "#rural-detail",
};

// 04 章「山货出山」之前的全屏大图。源片 13.9 秒、1920×1080。
// 画面角落有两处水印：右上角 bilibili 台标（x≈0.79 起）、
// 右下角「SENJUE」（x≈0.735 起）。用 videoCrop.keepWidth 只保留左侧 72%，
// 把两处都切掉——等比裁切，不拉伸画面。静帧 /images/mutual-cover.jpg 按同样比例裁好。
export const economyCover = {
  id: "economy",
  title: "互助曲靖",
  latin: "QUJING · TOGETHER",
  line: "收成好不好，要看有没有人一起弯腰。",
  meta: ["土地流转", "山货上行", "集体分红"],
  image: asset("/images/mutual-cover.jpg"),
  alt: "戴着草帽的农人靠在收割机上笑",
  focus: "50% 50%",
  videoSources: [{ src: asset("/videos/mutual.mp4"), type: "video/mp4" }],
  videoCrop: { keepWidth: 0.72 },
  scrollHref: "#economy-detail",
};

export const scenery = {
  index: "02",
  title: "山水有信",
  lead:
    "乌蒙山的余脉在这里放缓，珠江源的水从这里出发。曲靖的风景不是被围起来的景点，而是被耕种、被走过、被记住的日常。",
  lead2: "海拔抬起来，颜色就沉下去。",
  images: {
    grassland: {
      src: asset("/images/caoshan-ridge.jpg"),
      alt: "会泽大海草山被云雾覆盖的绿色山脊",
      place: "会泽 · 大海草山",
      note: "海拔两千多米的高山草甸，风一年吹过三季。",
    },
    grasslandStream: {
      src: asset("/images/caoshan-stream.jpg"),
      alt: "会泽大海草山草甸之间的溪流与低垂的云层",
    },
    grasslandValley: {
      src: asset("/images/caoshan-valley.jpg"),
      alt: "会泽大海草山的山谷湖泊与草甸上的羊群",
    },
    waterfall: {
      src: asset("/images/waterfall.jpg"),
      alt: "九龙瀑布层层落下的水帘与碧绿的潭水",
      place: "九龙瀑布",
      note: "水声盖过山谷里别的声音。",
    },
    zhujiangyuan: {
      src: asset("/images/zhujiangyuan.jpg"),
      alt: "珠江源出水洞口、岩壁上的题字与碧绿的水潭",
      place: "珠江源",
      note: "珠江的第一滴水，从山腹里渗出来。",
    },
    reservoir: {
      src: asset("/images/reservoir.jpg"),
      alt: "山间的水库、拦河坝与远处挂着云的山脊",
    },
  },
};

// 01 章「避暑胜地」——介绍曲靖城区。
// 图片位：后续拿到实拍图后，可在对应 note 里加 image / alt 字段，
// 由 Summer.jsx 渲染成图文交错版式（不需要改结构）。
export const summer = {
  index: "01",
  title: "避暑胜地",
  lede:
    "2026年夏季（6月至7月），曲靖全市预计接待游客774.36万人次，其中南城门单日游览人次超过5万，客流规模与省内传统热门景区相当。2025年同期，曲靖接待避暑游客约231.35万人次，同比增长11.15%，显示出避暑旅游持续升温的趋势。2025年6月至8月期间，省外游客占比约40%，平均停留时长达到87天，旅居总体满意度高达98.8%。",
  ledeImage: {
    src: asset("/images/qujing-city-aerial.jpg"),
    alt: "从山上俯瞰曲靖城区，近处是绿树与老城区，远处是坝子与新城",
  },
  notes: [
    {
      index: "01",
      title: "花更少的钱，过更长的日子",
      image: asset("/images/qujing-noodles.jpg"),
      alt: "曲靖本地小店的一碗米线，配一碟炸物和醋壶",
      imageRatio: "1 / 1",
      paragraphs: [
        "菜市场的菜按天定价，一碗米线几块钱，两居室的房租只是大城市一间次卧。让您能吃得开心，住得安心。",
      ],
    },
    {
      index: "02",
      title: "海拔抬起来，暑气就落下去",
      image: asset("/images/qujing-park.jpg"),
      alt: "曲靖城区公园里的树木、池塘与红顶凉亭",
      paragraphs: [
        "不仅气温适宜，环境同样舒适：城区海拔近两千米，树荫下和夜里都是凉的，出门走十几分钟就走进公园。",
      ],
    },
    {
      index: "03",
      title: "日子慢得下来，是因为不用卷",
      image: asset("/images/qujing-plaza.jpg"),
      alt: "傍晚的曲靖城区广场，城楼下散步的人群",
      imageRatio: "16 / 9",
      paragraphs: [
        "早上菜市场最热闹，傍晚公园里全是散步的人。因为曲靖不像大城市那样内卷，所以人人都可以慢下来，感受自己的生活。",
      ],
    },
    {
      index: "04",
      title: "来了，就不太想走",
      image: asset("/images/qujing-greenway.jpg"),
      alt: "雨后曲靖城区的绿道，两侧是灌木与开花的行道树",
      imageRatio: "3 / 2",
      paragraphs: [
        "省外避暑游客占比 40%：本来只打算住一个星期，后来住了一个月，再后来开始打听这里的房子。",
      ],
    },
  ],
  closing: "清凉不只是一个气温数字 19.7℃，而是一种可以住下来的感觉。",
};

export const rural = {
  index: "03",
  title: "田野有声",
  lead:
    "村子不在风景之外，它本来就是风景的一部分。人、田、路、屋顶，构成了曲靖的另一半。",
  blocks: [
    {
      tag: "花期 · 二月至三月",
      title: "油菜花一开，坝子就亮了",
      body:
        "罗平的春天从油菜花开始——二月开花，三月最盛。峰丛从花海里长出来，花期一过，这片金黄就变成菜籽和油。",
      meta: "罗平 · 万亩油菜",
      image: asset("/images/luoping-rapeseed.jpg"),
      alt: "罗平坝子的油菜花田、村庄与落日前的天空",
    },
    {
      tag: "田园 · 稻蔬轮作",
      title: "坝子摊开，就是一座粮仓",
      body:
        "陆良坝子是云南最大的平坝，南盘江从中间穿过去。水稻、蚕豆、蔬菜轮着种，大棚一片接一片——高原粮仓的名字，是种出来的。",
      meta: "陆良 · 高原粮仓",
      image: asset("/images/luliang-fields.jpg"),
      alt: "陆良坝子的连片农田、村庄与远处的群山",
    },
    {
      tag: "牧歌 · 乌蒙山间",
      title: "风车底下，羊群慢慢走",
      body:
        "海拔两千米以上的坡地，冬天只长草和风。羊群一片一片铺在山坡上，慢慢挪过去，就是一天。",
      meta: "会泽 · 高山草场",
      image: asset("/images/huize-mountain-sheep.jpg"),
      alt: "会泽乌蒙山间放牧的羊群、层叠的旱地与山脊上的风车",
    },
  ],
};

export const economy = {
  index: "04",
  title: "山货出山",
  lead:
    "紧跟“十四五”时期巩固拓展脱贫攻坚成果同乡村振兴有效衔接的指导思想、目标任务、重点任务、政策措施、帮扶机制和组织保障，风景要留下来，村民也要过得好——中间这条具体的路，曲靖的乡村已经走出了几种可以互相借用的模式。",
  feature: {
    index: "01",
    title: "曲靖聚焦多元增收 绘就民生发展新答卷",
    body:
      "近年来，曲靖市聚焦群众增收“五问及新五问”精准施策，扎实巩固拓展脱贫攻坚成果，持续增进民生福祉。2025年，全市农村居民人均可支配收入达21281元、同比增长6%，城乡居民收入比2.26:1。2026年上半年，农村居民人均可支配收入10794元、同比增长6.4%，增收势头稳健。",
    keys: ["多元增收", "精准施策", "民生福祉"],
    image: asset("/images/qujing-vegetable-field.jpg"),
    alt: "菜地里采收青菜的农妇，远处是村庄与山影",
  },
  cards: [
    {
      index: "02",
      title: "会泽 · 盐水石榴",
      body:
        "金秋时节，云南省曲靖市会泽县石榴迎来丰收季。近年来，会泽县以科技赋能、品牌引领、绿色种植为抓手，依托“科技+产业+农户”的路子，推动石榴产业提质增效。据介绍，会泽“盐水石榴”获得国家级农产品地理标志认证，全县石榴种植面积达5.5万亩。",
      keys: ["科技赋能", "品牌引领", "绿色种植"],
      image: asset("/images/yanshuihe-pomegranate.jpg"),
      alt: "果园里正在采摘石榴的果农",
    },
    {
      index: "03",
      title: "富源 · 万寿菊",
      body:
        "全县万寿菊从2023年试种700亩，发展至2025年2.9万亩、产值1.2亿元，2026年种植规模拓展至4.1万亩，预计总产值达1.64亿元，富民成效愈发凸显。如今，万寿菊已然成为富源装点乡村的“风景花”、强村富民的“致富花”。",
      keys: ["试种扩面", "产值过亿", "强村富民"],
      image: asset("/images/fuyuan-marigold.jpg"),
      alt: "万寿菊大田里采摘的农户与孩子，远处是山林",
    },
  ],
  closing: {
    index: "04",
    title: "集体分红 · 共富账本",
    body:
      "收益进集体账户，用来修路、养老、助学。账目贴出来，谁都能看。互助不是一次性的帮扶，而是把每年的收成连成一条线。",
    keys: ["集体账户", "公开", "再投入"],
  },
};

export const contact = {
  statement: ["让风景留下来，", "也让日子好起来。"],
  note: "云南曲靖欢迎您",
  image: asset("/images/qujing-skyline.jpg"),
  alt: "曲靖城区航拍：高楼群、城市天际线与远处的山脊",
};
