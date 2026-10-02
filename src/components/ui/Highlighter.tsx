// Adapted from Magic UI Highlighter (MIT): https://magicui.design/r/highlighter.json
// Native viewport observation, wrapping inline text, and reduced-motion support.
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { annotate } from 'rough-notation';

type HighlighterProps = {
  children: ReactNode;
  action?: 'highlight' | 'underline';
  color?: string;
  isView?: boolean;
  delay?: number;
};

export function Highlighter({ children, action = 'highlight', color = '#17685c', isView = false, delay = 0 }: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const annotation = annotate(element, {
      type: action, color, strokeWidth: 1.5, animationDuration: 650,
      iterations: 1, padding: 2, multiline: true, animate: !reduced.matches,
    });
    let shown = false;
    let disposed = false;
    let frame = 0;
    let timer: number | undefined;
    const show = () => { shown = true; annotation.show(); };
    const cancelDelay = () => { window.clearTimeout(timer); timer = undefined; };
    const begin = () => {
      if (shown || timer !== undefined) return;
      if (reduced.matches || delay === 0) { show(); intersection.disconnect(); }
      else timer = window.setTimeout(() => {
        timer = undefined;
        if (!disposed) { show(); intersection.disconnect(); }
      }, delay);
    };
    const redraw = () => {
      if (!shown || disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        annotation.hide();
        annotation.animate = false;
        annotation.show();
        annotation.animate = !reduced.matches;
      });
    };
    const intersection = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) begin();
      else if (!shown) cancelDelay();
    }, { rootMargin: '0px 0px -10% 0px' });
    if (!isView || reduced.matches) begin();
    else intersection.observe(element.closest('[data-highlight-group]') ?? element);
    const resize = new ResizeObserver(redraw);
    resize.observe(element.parentElement!);
    void document.fonts.ready.then(redraw);
    const motionChanged = () => {
      annotation.animate = !reduced.matches;
      if (reduced.matches && !shown) { cancelDelay(); show(); intersection.disconnect(); }
      redraw();
    };
    reduced.addEventListener('change', motionChanged);
    return () => {
      disposed = true;
      cancelDelay();
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      reduced.removeEventListener('change', motionChanged);
      annotation.remove();
    };
  }, [action, color, isView, delay]);

  return <span ref={elementRef} className="case-highlighter">{children}</span>;
}
