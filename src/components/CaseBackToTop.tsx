import { useEffect, useState, type RefObject } from 'react';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

export function CaseBackToTop({ caseRoot }: { caseRoot: RefObject<HTMLDivElement | null> }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const research = caseRoot.current?.querySelector<HTMLElement>('.research');
    if (!research) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(research.getBoundingClientRect().bottom <= window.innerHeight * .85);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(research);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [caseRoot]);

  if (!visible) return null;
  return <InteractiveHoverButton className="case-back-to-top" aria-label="Наверх, к началу кейса" onClick={() => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    caseRoot.current?.querySelector<HTMLElement>('.case-header')?.focus({ preventScroll: true });
  }}>Наверх</InteractiveHoverButton>;
}
