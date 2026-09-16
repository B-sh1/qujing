import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "../data/content.js";
import { EASE } from "./Reveal.jsx";

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pendingJump = useRef(null);

  /**
   * 跳转自己接管，不用浏览器默认的锚点行为。
   * 原因：面板收起时 AnimatePresence 会跑一段高度动画，正好把浏览器发起的
   * 平滑滚动打断——hash 变了、页面却停在原地。所以面板开着时先把动作挂起来，
   * 等 onExitComplete（收起动画结束）再滚；桌面导航没面板，直接滚。
   */
  const jumpTo = (event, href) => {
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => {
      target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      history.pushState(null, "", href);
    };

    if (open) {
      pendingJump.current = run;
      setOpen(false);
      return;
    }
    run();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 860) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="nav" data-scrolled={scrolled || open ? "true" : "false"}>
      <div className="container nav__inner">
        <a
          className="nav__brand"
          href="#top"
          onClick={(event) => {
            setOpen(false);
            jumpTo(event, "#top");
          }}
        >
          <span className="nav__brand-cn">曲靖</span>
          <span className="nav__brand-latin">QUJING</span>
        </a>

        <nav className="nav__links" aria-label="主导航">
          {nav.map((item) => (
            <a
              key={item.href}
              className="nav__link"
              href={item.href}
              onClick={(event) => jumpTo(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-bars" aria-hidden="true">
            <span />
            <span />
          </span>
          {open ? "关闭" : "目录"}
        </button>
      </div>

      <AnimatePresence
        onExitComplete={() => {
          const run = pendingJump.current;
          pendingJump.current = null;
          if (run) run();
        }}
      >
        {open && (
          <motion.div
            className="nav__panel"
            id="nav-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="container nav__panel-inner">
              {nav.map((item, i) => (
                <a
                  key={item.href}
                  className="nav__panel-link"
                  href={item.href}
                  onClick={(event) => jumpTo(event, item.href)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
