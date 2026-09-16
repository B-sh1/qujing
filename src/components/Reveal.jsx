import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.22, 0.61, 0.36, 1];

export function Reveal({ children, className, delay = 0, y = 26, amount = 0.2, as = "div" }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduce ? 0.3 : 0.9, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealMedia({ src, alt, className = "", delay = 0, priority = false, style }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`media ${className}`.trim()}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(12% 0% 12% 0%)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0.35 : 1.05, delay: reduce ? 0 : delay, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        initial={reduce ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduce ? 0 : 1.5, delay: reduce ? 0 : delay, ease: EASE }}
      />
    </motion.div>
  );
}
