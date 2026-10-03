import { useEffect, type CSSProperties, type ReactNode } from 'react';
import type { CaseIntroductionData } from '../data/case-introductions';
import { CaseHeading } from './CaseHeading';
import TextBlockAnimation from './ui/text-block-animation';
import { MaskButtonLink } from './ui/mask-button';
import { author } from '../data/portfolio';
import './case.css';

export function CasePage({ project, children }: { project: CaseIntroductionData; children?: ReactNode }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${project.company} — Марк Сангинов`;
    return () => { document.title = previous; };
  }, [project.company]);

  const back = `/#${project.id}-title`;
  return (
    <div className="case-page" style={{ '--case-accent': project.accent } as CSSProperties}>
      <a className="skip-link" href="#case-main">К содержанию кейса</a>
      <header className="case-header">
        <a href={back}>← На главную</a>
        <span>Марк Сангинов</span>
        <MaskButtonLink className="case-telegram" href={author.contacts.find(contact => contact.label === 'Telegram')!.href} target="_blank" rel="noopener noreferrer">Телеграм<img src="/assets/arrow-up-right.svg" alt="" width="20" height="20" /></MaskButtonLink>
      </header>
      <main id="case-main" className="case-main" tabIndex={-1}>
        <section className="case-hero" aria-label="Обложка проекта">
          <img className="case-cover" src={project.cover.src} alt={project.cover.alt} width="2048" height="1225" fetchPriority="high" />
          <div className="case-cover-actions">
            <a className="case-figma-link" href={project.figma} target="_blank" rel="noopener noreferrer">Макеты Figma</a>
          </div>
          <TextBlockAnimation className="case-title-animation" animateOnScroll={false} delay={.2} blockColor={project.accent}>
            <h1>{project.titleLead}{' '}<br /><span className="case-company">{project.company}</span></h1>
          </TextBlockAnimation>
        </section>
        <section className="case-concepts" aria-label={`Готовые концепты ${project.company}`}>
          <a href={project.concepts.image} target="_blank" rel="noopener noreferrer" aria-label={`Открыть готовые концепты ${project.company} в полном размере`}>
            <img src={project.concepts.image} alt={project.concepts.alt} width={project.concepts.width} height={project.concepts.height} loading="lazy" />
          </a>
        </section>
        <section className="case-task" aria-labelledby="task-title">
          <TextBlockAnimation blockColor={project.accent} stagger={.08}>
            <CaseHeading id="task-title">Задача</CaseHeading>
            {project.task.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </TextBlockAnimation>
        </section>
        {children}
        <footer className="case-footer">
          <a href={back}>На главную</a>
          <a href={project.figma} target="_blank" rel="noopener noreferrer">Полный кейс в Figma ↗</a>
        </footer>
      </main>
    </div>
  );
}
