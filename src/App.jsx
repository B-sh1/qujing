import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import SiteNav from "./components/SiteNav.jsx";
import MediaCover from "./components/MediaCover.jsx";
import Scenery from "./components/Scenery.jsx";
import Summer from "./components/Summer.jsx";
import Rural from "./components/Rural.jsx";
import Economy from "./components/Economy.jsx";
import Closing from "./components/Closing.jsx";
import { hero, sceneryCover, ruralCover, economyCover } from "./data/content.js";

export default function App() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 34, mass: 0.3 });

  return (
    <>
      <motion.div className="progress" style={reduce ? { scaleX: 0 } : { scaleX }} aria-hidden="true" />
      <SiteNav />
      <main>
        <MediaCover data={hero} />
        <Summer />
        <MediaCover data={sceneryCover} />
        <Scenery />
        <MediaCover data={ruralCover} />
        <Rural />
        <MediaCover data={economyCover} />
        <Economy />
        <Closing />
      </main>
    </>
  );
}
