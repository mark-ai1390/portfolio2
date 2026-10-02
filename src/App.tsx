import { AuthorPanel } from './components/AuthorPanel';
import { ProjectCard } from './components/ProjectCard';
import { projects } from './data/portfolio';

export function App() {
  if (window.location.pathname !== '/') {
    return (
      <main className="not-found">
        <h1>Страница не найдена</h1>
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
