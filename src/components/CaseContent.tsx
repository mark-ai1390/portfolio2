import { Fragment } from 'react';
import { caseContent } from '../data/case-content';
import { CaseHeading } from './CaseHeading';
import { Heading } from './ui/heading';
import { CaseIllustration } from './CaseIllustration';

export function CaseContent({ id }: { id: string }) {
  return <div className="case-content">
    {caseContent[id].map(block => {
      if (block.kind === 'image') return <CaseIllustration key={block.id} nodeId={block.id} src={block.src!} alt={block.alt!} width={block.width} height={block.height} wide={block.wide} />;
      const headingId = `section-${block.id.replace(':', '-')}`;
      if (block.kind === 'link') return <div className="case-content-link" key={block.id}>{block.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</div>;
      return <section className={`case-content-text${block.panel ? ' case-content-panel' : ''}${block.eyebrow ? ' case-content-chapter' : ''}`} key={block.id} aria-labelledby={headingId} data-figma-node={block.id}>
        {block.eyebrow && <p className="case-eyebrow">{block.eyebrow.replace('PRIME KRAFT', 'PRIMEKRAFT')}</p>}
        <CaseHeading id={headingId}>{block.title}</CaseHeading>
        {block.paragraphs?.map((text, index) => <Fragment key={text}>
          {block.id === '306:103320' && index === 1 && block.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
          {block.statusLabel && index === 1 && <Heading level={3} className="case-status-label">{block.statusLabel}</Heading>}
          <p className={block.id === '306:103312' ? 'case-components-list' : block.id === '306:103320' && index === 1 ? 'case-prototype-note' : undefined}>{text}</p>
        </Fragment>)}
        {block.id !== '306:103320' && block.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
      </section>;
    })}
  </div>;
}
