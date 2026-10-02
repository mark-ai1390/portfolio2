import type { Project } from '../data/portfolio';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-card project-card--${project.id}`} aria-labelledby={`${project.id}-title`}>
      <a className="project-card-link" href={project.path} aria-labelledby={`${project.id}-title`} />
      <div className="project-media">
        <img
          className="project-cover"
          src={project.cover.src}
          alt={project.cover.alt}
          width="816"
          height="489"
          loading={project.id === 'primekraft' ? 'eager' : 'lazy'}
        />
        <img
          className="project-cover project-cover--hover"
          src={project.cover.hoverSrc}
          alt=""
          aria-hidden="true"
          width="816"
          height="489"
          loading={project.id === 'primekraft' ? 'eager' : 'lazy'}
        />
      </div>
      <div className="project-copy">
        <h2 id={`${project.id}-title`}>{project.title}</h2>
        <p>{project.summary}</p>
        <ul className="project-tags" aria-label="Направления проекта">
          {project.tags.map(tag => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </article>
  );
}
