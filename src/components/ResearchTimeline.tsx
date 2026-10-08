import { typography } from '../lib/typography';
import { useEffect, useRef, type CSSProperties } from 'react';
import { Heading } from './ui/heading';
import type { ResearchStep } from '../data/case-research';
import { CaseImageLink } from './CaseImageViewer';

export function ResearchTimeline({ steps }: { steps: ResearchStep[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = section.current!;
    const list = track.current!;
    const desktop = window.matchMedia('(min-width: 1024px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      root.classList.toggle('research--pinned', desktop.matches);
      root.classList.toggle('research--reveal', !reduced.matches);
      const revealDistance = Math.min(320, window.innerHeight * .4);
      const reveal = Math.max(0, Math.min(1, (window.innerHeight * .8 - root.getBoundingClientRect().top) / revealDistance));
      root.style.setProperty('--reveal', String(reduced.matches || root.matches(':focus-within') ? 1 : reveal * reveal * (3 - 2 * reveal)));
      if (desktop.matches) {
        const distance = root.offsetHeight - root.querySelector<HTMLElement>('.research-stage')!.offsetHeight;
        const progress = Math.max(0, Math.min(1, (80 - root.getBoundingClientRect().top) / distance));
        const travel = Math.max(0, list.scrollWidth - list.parentElement!.clientWidth);
        list.style.transform = `translateX(${-progress * travel}px)`;
        root.style.setProperty('--progress', String(progress));
        for (const [index, item] of [...list.children].entries()) {
          item.classList.toggle('is-active', progress >= index / steps.length);
        }
      } else {
        list.style.removeProperty('transform');
        root.style.setProperty('--progress', '1');
        for (const item of list.children) {
          item.classList.toggle('is-active', reduced.matches || item.getBoundingClientRect().top < window.innerHeight * .88);
        }
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    observer.observe(list);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    desktop.addEventListener('change', schedule);
    reduced.addEventListener('change', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      desktop.removeEventListener('change', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, [steps]);

  return (
    <section className="research" ref={section} style={{ '--step-count': steps.length } as CSSProperties} aria-labelledby="research-title">
      <div className="research-stage">
        <div className="research-window">
          <ol className="research-track" ref={track} onFocusCapture={event => {
            const root = section.current!;
            if (!(event.target as HTMLElement).matches(':focus-visible')) return;
            if (!root.classList.contains('research--pinned')) return;
            const item = (event.target as HTMLElement).closest('li');
            const index = [...track.current!.children].indexOf(item!);
            if (index < 0) return;
            const distance = root.offsetHeight - root.querySelector<HTMLElement>('.research-stage')!.offsetHeight;
            window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 80 + distance * Math.min(1, index / steps.length + .08), behavior: 'instant' });
            track.current!.parentElement!.scrollLeft = 0;
          }}>
            {steps.map((step, index) => (
              <li className="research-step" key={step.title} style={{ '--step': index } as CSSProperties}>
                <div className="research-marker" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>
                <Heading level={3}>{step.title}</Heading>
                <p>{typography(step.text)}</p>
                {step.image && <CaseImageLink className="research-image" image={{ src: step.image, alt: step.alt ?? step.title, width: step.width!, height: step.height! }}
                  style={{ '--case-cue-inset': '12px', '--case-cue-radius': '8px' } as CSSProperties} aria-label={`Открыть иллюстрацию: ${step.title}`}>
                  <img src={step.image} alt={step.alt} width={step.width} height={step.height} loading="lazy" />
                </CaseImageLink>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
