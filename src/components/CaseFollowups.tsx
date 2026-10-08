import { typography } from '../lib/typography';
import { CaseHeading } from './CaseHeading';
import { TextAnimate } from './ui/text-animate';
import { BlurReveal } from './ui/blur-reveal';
import { caseFollowups } from '../data/case-followups';
import { CrmBenchmark } from './CrmBenchmark';

export function CaseFollowups({ id }: { id: string }) {
  return <div className="case-followups">
    {caseFollowups[id].map((block, index) => {
      const content = <>
        <CaseHeading id={`followup-${index}`}>{block.title}</CaseHeading>
        {block.paragraphs.map(text => id === 'copterdrone'
          ? <TextAnimate key={text} animation="blurInUp" by="character" delay={2}>{typography(text)}</TextAnimate>
          : <p key={text}>{typography(text)}</p>)}
        {id === '4sales' && index === 0 && <CrmBenchmark />}
      </>;
      return <section className="case-followup" aria-labelledby={`followup-${index}`} key={block.title}>
        {id === 'copterdrone' ? content : <BlurReveal>{content}</BlurReveal>}
      </section>;
    })}
  </div>;
}
