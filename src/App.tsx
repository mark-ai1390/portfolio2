import { Heading } from './components/ui/heading';
import { AuthorPanel } from './components/AuthorPanel';
import { ProjectCard } from './components/ProjectCard';
import { projects } from './data/portfolio';
import { CopterDroneCase } from './components/CopterDroneCase';
import { useEffect } from 'react';
import { ResearchCase } from './components/ResearchCase';

export function App() {
  useEffect(() => {
    const target = window.location.hash.slice(1);
    if (target) document.getElementById(target)?.scrollIntoView();
  }, []);
  if (window.location.pathname.replace(/\/$/, '') === '/projects/copterdrone') {
    return <CopterDroneCase />;
  }
  const caseId = window.location.pathname.replace(/\/$/, '').match(/^\/projects\/(primekraft|4sales)$/)?.[1];
  if (caseId) return <ResearchCase id={caseId} />;
  if (window.location.pathname !== '/') {
    return (
      <main className="not-found">
        <Heading level={1}>Страница не найдена</Heading>
        <a href="/">На главную</a>
      </main>
    );
  }

  return (
    <>
      <a className="skip-link" href="#projects">К проектам</a>
      <div className="portfolio-layout">
        <AuthorPanel />
        <main id="projects" className="project-list" aria-label="Проекты" tabIndex={-1}>
          {projects.map(project => <ProjectCard key={project.id} project={project} />)}
        </main>
      </div>
    </>
  );
}
