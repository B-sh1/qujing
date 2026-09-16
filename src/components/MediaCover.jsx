import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASE } from "./Reveal.jsx";

/**
 * 全屏媒体封面：首屏和章节大图共用同一套视觉与行为。
 * 背景视频一律静音、滑出视口自动暂停、取不到时回落到静帧。
 */
export default function MediaCover({ data }) {
  const {
    id,
    title,
    latin,
    line,
    meta = [],
    image,
    alt,
    focus = "50% 50%",
    videoSources,
    videoCrop,
    clipSeconds,
    scrollHref,
    scrollLabel = "向下",
    priority = false,
    headingLevel = 2,
  } = data;

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const reduce = useReducedMotion();
  const [videoOk, setVideoOk] = useState(true);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  const showVideo = videoOk && !reduce && videoSources?.length > 0;
  const crop = videoCrop?.scale && videoCrop.scale !== 1 ? videoCrop : null;
  // keepWidth：只保留画面左侧这一比例（0–1），其余裁掉。
  // 与 scale/origin 的放大裁切不同，它保持画面比例不变，用来去掉角落的水印/台标。
  // 配套的静帧 `image` 需要预先按同一比例裁好，两边取景才会一致。
  const keepWidth =
    videoCrop?.keepWidth > 0 && videoCrop.keepWidth < 1 ? videoCrop.keepWidth : null;
  const headingProps = {
    className: "display h1",
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay: 0.25, ease: EASE },
  };

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const innerY = useTransform(scrollYProgress, [0, 1], [0, -46]);
  const innerOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // 滑出视口就暂停，回到视口再继续。
  useEffect(() => {
    const el = videoRef.current;
    const section = sectionRef.current;
    if (!showVideo || !el || !section || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const played = el.play();
          if (played && typeof played.catch === "function") played.catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { threshold: 0.12 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, [showVideo]);

  // 只播前 clipSeconds 秒：即使换了更长的源片，也只在设定区间内循环。
  useEffect(() => {
    if (!showVideo || !clipSeconds) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;

    let raf = 0;
    const tick = () => {
      if (!el.paused && el.currentTime >= clipSeconds) el.currentTime = 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showVideo, clipSeconds]);

  const videoNode = (
    <video
      ref={videoRef}
      className="cover__video"
      style={{
        objectPosition: focus,
        ...(crop
          ? { transform: `scale(${crop.scale})`, transformOrigin: crop.origin }
          : null),
      }}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      onError={() => setVideoOk(false)}
      aria-hidden="true"
    >
      {videoSources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );

  const videoLayer = !showVideo ? null : keepWidth ? (
    <div className="cover__crop" style={{ width: `${(100 / keepWidth).toFixed(3)}%` }}>
      {videoNode}
    </div>
  ) : (
    videoNode
  );

  return (
    <section className="cover" id={id} ref={sectionRef}>
      <motion.div className="cover__bg" style={reduce ? undefined : { y: bgY, scale: bgScale }}>
        <img
          className="cover__poster"
          style={{ objectPosition: focus }}
          src={image}
          alt={alt}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
        />
        {videoLayer}
      </motion.div>

      <div className="cover__veil" aria-hidden="true" />

      <motion.div
        className="container cover__inner"
        style={reduce ? undefined : { y: innerY, opacity: innerOpacity }}
      >
        <motion.span
          className="latin cover__latin"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        >
          {latin}
        </motion.span>

        {headingLevel === 1 ? (
          <motion.h1 {...headingProps}>{title}</motion.h1>
        ) : (
          <motion.h2 {...headingProps}>{title}</motion.h2>
        )}

        <motion.p
          className="cover__line"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: EASE }}
        >
          {line}
        </motion.p>

        <motion.div
          className="cover__foot"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
        >
          <div className="cover__meta">
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a className="scroll-cue" href={scrollHref}>
            {scrollLabel}
            <span className="scroll-cue__track" aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
