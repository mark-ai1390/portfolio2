"use client";

import { motion, useReducedMotion, type Variants } from 'motion/react';

// Adapted from Magic UI Text Animate (MIT), retaining its blurInUp timing.
// https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/text-animate.tsx
type TextAnimateProps = {
  children: string;
  animation?: 'blurInUp';
  by?: 'character' | 'text';
  delay?: number;
  duration?: number;
  className?: string;
};

const blurInUp: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
  show: {
    opacity: 1, filter: 'blur(0px)', y: 0,
    transition: { y: { duration: .3 }, opacity: { duration: .4 }, filter: { duration: .3 } },
  },
};

export function TextAnimate({ children, by = 'character', delay = 0, duration = .3, className }: TextAnimateProps) {
  const reduced = useReducedMotion();
  if (reduced) return <p className={className}>{children}</p>;
  const segments = by === 'character' ? Array.from(children) : [children];
  const container: Variants = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { delayChildren: delay, staggerChildren: duration / segments.length } },
  };
  // Keep letters within each word together when the paragraph wraps.
  let index = 0;
  const segment = (text: string) => <motion.span key={index++} className="text-animate-character" variants={blurInUp}>{text}</motion.span>;
  return (
    <motion.p className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: .2 }}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {by === 'character' ? children.split(/(\s+)/).map((word, i) => /^\s+$/.test(word)
          ? <span key={i}>{Array.from(word).map(segment)}</span>
          : <span key={i} className="text-animate-word">{Array.from(word).map(segment)}</span>)
          : segment(children)}
      </span>
    </motion.p>
  );
}
