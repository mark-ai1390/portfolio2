// Adapted from Magic UI Highlighter (MIT): https://magicui.design/r/highlighter.json
// Native viewport observation, wrapping inline text, and reduced-motion support.
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { annotate } from 'rough-notation';

type HighlighterProps = {
  children: ReactNode;
  action?: 'highlight' | 'underline';
  color?: string;
  isView?: boolean;
};

export function Highlighter({ children, action = 'highlight', color = '#17685c', isView = false }: HighlighterProps) {
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
    const show = () => { shown = true; annotation.show(); };
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
      if (entries.some(entry => entry.isIntersecting)) { show(); intersection.disconnect(); }
    }, { rootMargin: '0px 0px -10% 0px' });
    if (!isView || reduced.matches) show();
    else intersection.observe(element);
    const resize = new ResizeObserver(redraw);
    resize.observe(element.parentElement!);
    void document.fonts.ready.then(redraw);
    const motionChanged = () => {
      annotation.animate = !reduced.matches;
      if (reduced.matches && !shown) { show(); intersection.disconnect(); }
      redraw();
    };
    reduced.addEventListener('change', motionChanged);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      reduced.removeEventListener('change', motionChanged);
      annotation.remove();
    };
  }, [action, color, isView]);

  return <span ref={elementRef} className="case-highlighter">{children}</span>;
}
