import { useEffect, useRef } from 'react';
import { copterdrone } from '../data/copterdrone';
import { CasePage } from './CasePage';
import { caseIntroductions } from '../data/case-introductions';
import TextBlockAnimation from './ui/text-block-animation';
import { CaseHeading } from './CaseHeading';

function ResearchTimeline() {
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
          item.classList.toggle('is-active', progress >= index / 4);
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
  }, []);

  return (
    <section className="research" ref={section} aria-labelledby="research-title">
      <div className="research-stage">
        <div className="research-window">
          <ol className="research-track" ref={track} onFocusCapture={event => {
            const root = section.current!;
            if (!root.classList.contains('research--pinned')) return;
            const item = (event.target as HTMLElement).closest('li');
            const index = [...track.current!.children].indexOf(item!);
            if (index < 0) return;
            const distance = root.offsetHeight - root.querySelector<HTMLElement>('.research-stage')!.offsetHeight;
            window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 80 + distance * Math.min(1, index / 4 + .08), behavior: 'instant' });
            track.current!.parentElement!.scrollLeft = 0;
          }}>
            {copterdrone.steps.map((step, index) => (
              <li className="research-step" key={step.title}>
                <div className="research-marker" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <a className="research-image" href={step.image} target="_blank" rel="noopener noreferrer" aria-label={`Открыть иллюстрацию: ${step.title}`}>
                  <img src={step.image} alt={step.alt} width={step.width} height={step.height} loading="lazy" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function CopterDroneCase() {
  return (
    <CasePage project={caseIntroductions.copterdrone}>
      <div className="case-research-intro">
        <TextBlockAnimation blockColor="#1fb59c">
          <p className="case-eyebrow">01 / COPTERDRONE</p>
          <CaseHeading id="research-title">UX-исследование</CaseHeading>
        </TextBlockAnimation>
      </div>
      <ResearchTimeline />
    </CasePage>
  );
}
