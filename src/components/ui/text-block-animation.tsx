import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

type TextBlockAnimationProps = {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
  className?: string;
};

// Adapted from the supplied component: SplitText owns the line wrappers so
// resizing, font loading, React cleanup and reduced motion remain reliable.
export default function TextBlockAnimation({ children, animateOnScroll = true, delay = 0,
  blockColor = '#1fb59c', stagger = .1, duration = .6, className = '' }: TextBlockAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const container = containerRef.current!;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const targets = [...container.querySelectorAll<HTMLElement>('h1, h2, p')];
      const splits = targets.map((target, targetIndex) => SplitText.create(target, {
        type: 'lines', mask: 'lines', linesClass: 'text-block-line', autoSplit: true,
        // SplitText's default whitespace cleanup turns NBSP back into a normal
        // space. Retain the typography bonds while measuring animated lines.
        reduceWhiteSpace: false,
        onSplit(self) {
          const blocks = self.masks.map(mask => {
            const block = document.createElement('div');
            block.className = 'block-revealer';
            block.setAttribute('aria-hidden', 'true');
            block.style.backgroundColor = blockColor;
            mask.appendChild(block);
            return block;
          });
          gsap.set(self.lines, { opacity: 0 });
          const timeline = gsap.timeline({
            defaults: { ease: 'expo.inOut' }, delay: delay + targetIndex * .15,
            scrollTrigger: animateOnScroll ? {
              trigger: container, start: 'top 85%', toggleActions: 'play none none reverse',
            } : undefined,
            onComplete: () => { container.classList.add('text-block--revealed'); },
          });
          self.lines.forEach((line, index) => {
            const start = index * stagger;
            timeline.to(blocks[index], { scaleX: 1, duration, transformOrigin: 'left center' }, start)
              .set(line, { opacity: 1 }, start + duration)
              .to(blocks[index], { scaleX: 0, duration, transformOrigin: 'right center' }, start + duration);
          });
          return timeline;
        },
      }));
      return () => { splits.forEach(split => split.revert()); container.classList.remove('text-block--revealed'); };
    });
    return () => media.revert();
  }, { scope: containerRef, dependencies: [animateOnScroll, delay, blockColor, stagger, duration], revertOnUpdate: true });

  return <div ref={containerRef} className={`text-block-animation ${className}`}>{children}</div>;
}
