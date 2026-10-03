import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export function BlurReveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className="case-blur-reveal"
      initial={reduced ? false : { opacity: 0, filter: 'blur(10px)', y: 20 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      animate={reduced ? { opacity: 1, filter: 'blur(0px)', y: 0 } : undefined}
      transition={{ duration: reduced ? 0 : .7, ease: 'easeOut' }}
      viewport={{ once: true, amount: .15 }}>
      {children}
    </motion.div>
  );
}
