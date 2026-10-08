import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useSpring, useTransform } from 'motion/react';
import './comet-card.css';

type CometCardProps = {
  children: ReactNode;
  className?: string;
  rotateDepth?: number;
  translateDepth?: number;
};

// Pointer tilt and moving glare adapted from the Aceternity Comet Card reference.
// Measure the stationary wrapper so the card's own movement cannot shift its input.
export function CometCard({ children, className = '', rotateDepth = 17.5, translateDepth = 20 }: CometCardProps) {
  const bounds = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [active, setActive] = useState(false);
  const enabled = finePointer && !reducedMotion;
  const horizontal = useSpring(0, { stiffness: 220, damping: 28 });
  const vertical = useSpring(0, { stiffness: 220, damping: 28 });
  const rotateX = useTransform(vertical, [-.5, .5], [-rotateDepth, rotateDepth]);
  const rotateY = useTransform(horizontal, [-.5, .5], [rotateDepth, -rotateDepth]);
  const x = useTransform(horizontal, [-.5, .5], [-translateDepth, translateDepth]);
  const y = useTransform(vertical, [-.5, .5], [translateDepth, -translateDepth]);
  const glareX = useTransform(horizontal, [-.5, .5], [0, 100]);
  const glareY = useTransform(vertical, [-.5, .5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, #ffffffb3 0%, #ffffff40 35%, #ffffff00 75%)`;

  const reset = () => { horizontal.set(0); vertical.set(0); setActive(false); };

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) { horizontal.jump(0); vertical.jump(0); setActive(false); }
    const clear = () => { horizontal.jump(0); vertical.jump(0); setActive(false); };
    window.addEventListener('blur', clear);
    return () => window.removeEventListener('blur', clear);
  }, [enabled, horizontal, vertical]);

  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType !== 'mouse' || !bounds.current) return;
    const rect = bounds.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    horizontal.set(Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5)));
    vertical.set(Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5)));
    setActive(true);
  };

  const raised = enabled && active;
  return <div ref={bounds} className={`comet-card ${className}`} data-active={raised || undefined}
    onPointerEnter={followPointer} onPointerMove={followPointer} onPointerLeave={reset}
    onPointerCancel={reset} onFocusCapture={event => {
      if ((event.target as HTMLElement).matches(':focus-visible')) reset();
    }}>
    <motion.div className="comet-card-surface"
      style={{ rotateX: enabled ? rotateX : 0, rotateY: enabled ? rotateY : 0, x: enabled ? x : 0, y: enabled ? y : 0 }}
      animate={{ scale: raised ? 1.015 : 1, z: raised ? 12 : 0,
        boxShadow: raised ? '0 16px 40px #0005' : '0 0px 0px #0000' }}
      transition={{ duration: reducedMotion ? 0 : .2 }}>
      {children}
      <motion.div className="comet-card-glare" aria-hidden="true" style={{ background: glare }}
        animate={{ opacity: raised ? .28 : 0 }} transition={{ duration: reducedMotion ? 0 : .2 }} />
    </motion.div>
  </div>;
}
