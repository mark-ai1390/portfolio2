import { useEffect, useRef } from 'react';
import { copterdrone } from '../data/copterdrone';
import './case.css';

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
        <p className="case-eyebrow">01 / COPTERDRONE</p>
        <h2 id="research-title">UX-исследование</h2>
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
        <img className="case-cover" src="/assets/copterdrone-normal.webp" alt="Редизайн CopterDrone на ноутбуке и телефоне" width="2048" height="1227" fetchPriority="high" />
        <div className="case-intro">
          <h1>{copterdrone.title}</h1>
          <p>{copterdrone.introduction}</p>
        </div>
        <ResearchTimeline />
        <footer className="case-footer"><a href="/#copterdrone-title">На главную</a><a href={copterdrone.figma} target="_blank" rel="noopener noreferrer">Полный кейс в Figma ↗</a></footer>
      </main>
    </div>
  );
}
