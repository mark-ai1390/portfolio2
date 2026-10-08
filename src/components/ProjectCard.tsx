import { typography } from '../lib/typography';
import { Heading } from './ui/heading';
import type { Project } from '../data/portfolio';
import { CometCard } from './ui/comet-card';
import { caseImage } from '../lib/case-image';

const coverSizes = '(max-width: 480px) calc(100vw - 64px), (max-width: 1023px) calc(100vw - 88px), (max-width: 1279px) calc(100vw - 480px), (max-width: 1439px) calc(100vw - 624px), 816px';

export function ProjectCard({ project }: { project: Project }) {
  const width = project.cover.width ?? 816;
  const height = project.cover.height ?? 489;
  const card = (
    <article className={`project-card project-card--${project.id}`} aria-labelledby={`${project.id}-title`}>
      <a className="project-card-link" href={project.path} aria-labelledby={`${project.id}-title`} />
      <div className="project-media" style={{ aspectRatio: `${width} / ${height}` }}>
        <img
          className="project-cover"
          {...caseImage(project.cover.src)}
          sizes={coverSizes}
          alt={project.cover.alt}
          width={width}
          height={height}
          loading={project.id === 'primekraft' ? 'eager' : 'lazy'}
          decoding="async"
        />
        <img
          className="project-cover project-cover--hover"
          {...caseImage(project.cover.hoverSrc)}
          sizes={coverSizes}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          loading={project.id === 'primekraft' ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
      <div className="project-copy">
        <Heading level={2} id={`${project.id}-title`}>{project.title}</Heading>
        <p>{typography(project.summary)}</p>
        <ul className="project-tags" aria-label="Направления проекта">
          {project.tags.map(tag => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </article>
  );
  return project.cardAnimation === 'comet'
    ? <CometCard className="project-comet" rotateDepth={8} translateDepth={6}>{card}</CometCard>
    : card;
}
