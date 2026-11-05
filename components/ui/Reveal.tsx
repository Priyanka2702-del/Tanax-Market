"use client";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps { children: React.ReactNode; delay?: number; className?: string; y?: number }

export default function Reveal({ children, delay = 0, className, y = 20 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
