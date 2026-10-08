"use client";

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { typography } from '../../lib/typography';

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
  const text = typography(children);
  if (reduced) return <p className={className}>{text}</p>;
  const segments = by === 'character' ? Array.from(text) : [text];
  const container: Variants = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { delayChildren: delay, staggerChildren: duration / segments.length } },
  };
  // Keep letters within each word together when the paragraph wraps.
  let index = 0;
  const segment = (text: string) => <motion.span key={index++} className="text-animate-character" variants={blurInUp}>{text}</motion.span>;
  return (
    <motion.p className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: .2 }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {by === 'character' ? text.split(/([ \t\r\n]+)/).map((word, i) => /^[ \t\r\n]+$/.test(word)
          ? <span key={i}>{Array.from(word).map(segment)}</span>
          : <span key={i} className="text-animate-word">{Array.from(word).map(segment)}</span>)
          : segment(text)}
      </span>
    </motion.p>
  );
}
