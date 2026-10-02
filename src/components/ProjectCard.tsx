import type { Project } from '../data/portfolio';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-card project-card--${project.id}`} aria-labelledby={`${project.id}-title`}>
      {project.cover ? (
        <img
          className="project-cover"
          src={project.cover.src}
          alt={project.cover.alt}
          width="816"
          height="489"
          loading={project.id === 'primekraft' ? 'eager' : 'lazy'}
        />
      ) : (
        // Reserve layout space until original exports arrive; no imitation artwork.
        <div className="project-media-space" aria-hidden="true" />
      )}
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
