import { typography } from '../lib/typography';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { CaseIntroductionData } from '../data/case-introductions';
import { Heading } from './ui/heading';
import { CaseHeading } from './CaseHeading';
import TextBlockAnimation from './ui/text-block-animation';
import { MaskButtonLink } from './ui/mask-button';
import { author } from '../data/portfolio';
import { CaseContacts } from './CaseContacts';
import { CaseBackToTop } from './CaseBackToTop';
import { caseImage } from '../lib/case-image';
import { responsiveImages } from '../data/responsive-images';
import { CaseImageViewerProvider } from './CaseImageViewer';
import { caseHintImages } from '../lib/case-gallery';
import './case.css';

function CaseNavLink({ href, figma = false }: { href: string; figma?: boolean }) {
  return <a className={`case-nav-button${figma ? ' case-figma-link' : ''}`} href={href}
    {...(figma ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
    {figma ? 'Макеты Figma' : 'На главную'}
  </a>;
}

export function CasePage({ project, children }: { project: CaseIntroductionData; children?: ReactNode }) {
  const caseRoot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.title;
    document.title = `${project.company} — Марк Сангинов`;
    return () => { document.title = previous; };
  }, [project.company]);

  const back = `/#${project.id}-title`;
  const mobileCover = responsiveImages[project.cover.mobile.src];
  const coverFill = mobileCover
    ? `image-set(${mobileCover.candidates.map(image => `url("${image.src}") ${image.width / 375}x`).join(', ')})`
    : `url("${project.cover.mobile.src}")`;
  return (
    <CaseImageViewerProvider hintSources={caseHintImages(project.id)}>
    <div className="case-page" ref={caseRoot} style={{ '--case-accent': project.accent, '--case-cover-fill': coverFill } as CSSProperties}>
      <a className="skip-link" href="#case-main">К содержанию кейса</a>
      <header className="case-header" tabIndex={-1}>
        <CaseNavLink href={back} />
        <span>Марк Сангинов</span>
        <MaskButtonLink className="case-telegram" href={author.contacts.find(contact => contact.label === 'Telegram')!.href} target="_blank" rel="noopener noreferrer">Телеграм<img src="/assets/arrow-up-right.svg" alt="" width="20" height="20" /></MaskButtonLink>
      </header>
      <main id="case-main" className="case-main" tabIndex={-1}>
        <section className="case-hero" aria-label="Обложка проекта">
          <picture className="case-cover-picture">
            <source media="(max-width: 767px)" srcSet={caseImage(project.cover.mobile.src).srcSet} sizes="100vw" width={project.cover.mobile.width} height={project.cover.mobile.height} />
            <img className="case-cover" src={project.cover.src} alt={project.cover.alt} width="2048" height={project.cover.height ?? 1225} fetchPriority="high" />
          </picture>
          <div className="case-cover-actions">
            <CaseNavLink href={project.figma} figma />
          </div>
          <TextBlockAnimation className="case-title-animation" animateOnScroll={false} delay={.2} blockColor={project.accent}>
            <Heading level={1}>{project.titleLead}{' '}<br /><span className="case-company">{project.company}</span></Heading>
          </TextBlockAnimation>
        </section>
        <section className="case-concepts" aria-label={`Готовые концепты ${project.company}`}>
          <a className="case-concepts-desktop" href={project.concepts.image} target="_blank" rel="noopener noreferrer" aria-label={`Открыть готовые концепты ${project.company} в полном размере`}>
            <img {...caseImage(project.concepts.image)} alt={project.concepts.alt} width={project.concepts.width} height={project.concepts.height} loading="lazy" decoding="async" />
          </a>
          <a className="case-concepts-mobile" href={project.concepts.mobile.src} target="_blank" rel="noopener noreferrer" aria-label={`Открыть мобильную композицию ${project.company} в полном размере`}>
            <img {...caseImage(project.concepts.mobile.src)} sizes="100vw" alt={project.concepts.alt} width={project.concepts.mobile.width} height={project.concepts.mobile.height} loading="lazy" decoding="async" />
          </a>
        </section>
        <section className="case-task" aria-labelledby="task-title">
          <TextBlockAnimation blockColor={project.accent} stagger={.08}>
            <CaseHeading id="task-title">Задача</CaseHeading>
            {project.task.map(paragraph => <p key={paragraph}>{typography(paragraph)}</p>)}
          </TextBlockAnimation>
        </section>
        {children}
        <CaseContacts />
        <footer className="case-footer">
          <CaseNavLink href={back} />
          <CaseNavLink href={project.figma} figma />
        </footer>
      </main>
      <CaseBackToTop caseRoot={caseRoot} />
    </div>
    </CaseImageViewerProvider>
  );
}
