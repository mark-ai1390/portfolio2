import { CaseHeading } from './CaseHeading';
import { TextAnimate } from './ui/text-animate';
import { BlurReveal } from './ui/blur-reveal';
import { caseFollowups } from '../data/case-followups';

export function CaseFollowups({ id }: { id: string }) {
  return <div className="case-followups">
    {caseFollowups[id].map((block, index) => {
      const content = <>
        <CaseHeading id={`followup-${index}`}>{block.title}</CaseHeading>
        {block.paragraphs.map(text => id === 'copterdrone'
          ? <TextAnimate key={text} animation="blurInUp" by="character" delay={2}>{text}</TextAnimate>
          : <p key={text}>{text}</p>)}
      </>;
      return <section className="case-followup" aria-labelledby={`followup-${index}`} key={block.title}>
        {id === 'copterdrone' ? content : <BlurReveal>{content}</BlurReveal>}
      </section>;
    })}
  </div>;
}
