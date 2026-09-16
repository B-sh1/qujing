import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "../data/content.js";
import { EASE } from "./Reveal.jsx";

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        <a className="nav__brand" href="#top" onClick={() => setOpen(false)}>
          <span className="nav__brand-cn">曲靖</span>
          <span className="nav__brand-latin">QUJING</span>
        </a>

        <nav className="nav__links" aria-label="主导航">
          {nav.map((item) => (
            <a key={item.href} className="nav__link" href={item.href}>
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

      <AnimatePresence>
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
                  onClick={() => setOpen(false)}
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
