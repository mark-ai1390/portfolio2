import { typography } from '../lib/typography';
import { Fragment, type CSSProperties } from 'react';
import { caseContent, type CaseContentBlock } from '../data/case-content';
import { CaseHeading } from './CaseHeading';
import { Heading } from './ui/heading';
import { CaseIllustration } from './CaseIllustration';
import { MacbookScroll } from './ui/macbook-scroll';
import { ContainerScroll } from './ui/container-scroll-animation';
import { caseImage } from '../lib/case-image';
import { CaseImageLink } from './CaseImageViewer';

function AnimatedScreen({ block }: { block: CaseContentBlock }) {
  if (block.presentation === 'macbook-scroll') return <MacbookScroll nodeId={block.id} src={block.src!} alt={block.alt!} width={block.width} height={block.height} />;
  return <figure className="case-dashboard-screen" data-figma-node={block.id}>
    <ContainerScroll>
      <CaseImageLink image={{ src: block.src!, alt: block.alt!, width: block.width, height: block.height }} style={{ borderRadius: 16 }}>
        <img {...caseImage(block.src!)} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" draggable={false} />
      </CaseImageLink>
    </ContainerScroll>
  </figure>;
}

export function CaseContent({ id }: { id: string }) {
  return <div className="case-content">
    {caseContent[id].map((block, index, blocks) => {
      if (block.presentation) return blocks[index - 1]?.kind === 'text' ? null : <AnimatedScreen key={block.id} block={block} />;
      const screen = blocks[index + 1];
      const headingId = `section-${block.id.replace(':', '-')}`;
      if (block.kind === 'text' && screen?.presentation) return <section className="case-screen-section" key={block.id} aria-labelledby={headingId}>
        <CaseHeading id={headingId}>{screen.screenTitle}</CaseHeading>
        <AnimatedScreen block={screen} />
        <div className="case-screen-caption" data-figma-node={block.id}>
          <Heading level={3}>{block.title}</Heading>
          {block.paragraphs?.map(text => <p key={text}>{typography(text)}</p>)}
          {screen.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
        </div>
      </section>;
      if (block.kind === 'image') return <CaseIllustration key={block.id} nodeId={block.id} src={block.src!} alt={block.alt!} width={block.width} height={block.height} wide={block.wide} radius={block.radius} />;
      if (block.kind === 'link') return <div className="case-content-link" key={block.id}>{block.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</div>;
      return <section className={`case-content-text${block.panel ? ' case-content-panel' : ''}${block.eyebrow ? ' case-content-chapter' : ''}${!block.paragraphs?.length ? ' case-content-title-only' : ''}`} style={{ '--case-content-heading': `${block.headingSize}px`, '--case-content-heading-line': block.headingLineHeight, gap: block.gap } as CSSProperties} key={block.id} aria-labelledby={headingId} data-figma-node={block.id}>
        {block.eyebrow && <p className="case-eyebrow">{block.eyebrow.replace('PRIME KRAFT', 'PRIMEKRAFT')}</p>}
        <CaseHeading id={headingId}>{block.title}</CaseHeading>
        {block.paragraphs?.map((text, index) => <Fragment key={text}>
          {block.id === '306:103320' && index === 1 && block.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
          {block.statusLabel && index === 1 && <Heading level={3} className="case-status-label">{block.statusLabel}</Heading>}
          <p className={block.id === '306:103312' ? 'case-components-list' : block.id === '306:103320' && index === 1 ? 'case-prototype-note' : undefined}>{typography(text)}</p>
        </Fragment>)}
        {block.id !== '306:103320' && block.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
      </section>;
    })}
  </div>;
}
