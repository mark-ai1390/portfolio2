import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import './container-scroll-animation.css';

// Compact case-page version of Aceternity's Container Scroll interaction.
export function ContainerScroll({ children, titleComponent }: { children: ReactNode; titleComponent?: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: container, offset: ['start 90%', 'start 20%'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return <div ref={container} className="container-scroll">
    {titleComponent && <div className="container-scroll-title">{titleComponent}</div>}
    <motion.div className="container-scroll-card"
      style={{ rotateX: reduced ? 0 : rotateX, scale: reduced ? 1 : scale, y: reduced ? 0 : y }}>
      {children}
    </motion.div>
  </div>;
}
