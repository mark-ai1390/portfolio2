import { useEffect, useRef } from 'react';
import { copterdrone } from '../data/copterdrone';
import './case.css';
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
  useEffect(() => {
    const previous = document.title;
    document.title = 'CopterDrone — Марк Сангинов';
    return () => { document.title = previous; };
  }, []);

  return (
    <div className="case-page">
      <a className="skip-link" href="#case-main">К содержанию кейса</a>
      <header className="case-header">
        <a href="/#copterdrone-title">← На главную</a>
        <span>Марк Сангинов</span>
        <a href={copterdrone.figma} target="_blank" rel="noopener noreferrer">Макет в Figma ↗</a>
      </header>
      <main id="case-main" className="case-main" tabIndex={-1}>
        <section className="case-hero" aria-label="Обложка проекта">
          <img className="case-cover" src="/assets/copterdrone-normal.webp" alt="Редизайн CopterDrone на ноутбуке и телефоне" width="2048" height="1227" fetchPriority="high" />
          <TextBlockAnimation className="case-title-animation" animateOnScroll={false} delay={.2} blockColor="#1fb59c">
            <h1>{copterdrone.titleLead}{' '}<br /><span className="case-company">{copterdrone.company}</span></h1>
          </TextBlockAnimation>
          <span className="case-scroll-cue" aria-hidden="true">
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
              <path d="M12 3v24m-7-7 7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </section>
        <section className="case-task" aria-labelledby="task-title">
          <TextBlockAnimation blockColor="#1fb59c" stagger={.08}>
            <CaseHeading id="task-title">Задача</CaseHeading>
            {copterdrone.task.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </TextBlockAnimation>
        </section>
        <div className="case-research-intro">
          <TextBlockAnimation blockColor="#1fb59c">
            <p className="case-eyebrow">01 / COPTERDRONE</p>
            <CaseHeading id="research-title">UX-исследование</CaseHeading>
          </TextBlockAnimation>
        </div>
        <ResearchTimeline />
        <footer className="case-footer"><a href="/#copterdrone-title">На главную</a><a href={copterdrone.figma} target="_blank" rel="noopener noreferrer">Полный кейс в Figma ↗</a></footer>
      </main>
    </div>
  );
}
