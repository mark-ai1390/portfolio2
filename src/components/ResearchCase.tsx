import { CasePage } from './CasePage';
import { CaseFollowups } from './CaseFollowups';
import { CaseContent } from './CaseContent';
import { CaseHeading } from './CaseHeading';
import { ResearchTimeline } from './ResearchTimeline';
import TextBlockAnimation from './ui/text-block-animation';
import { caseIntroductions } from '../data/case-introductions';
import { caseResearch } from '../data/case-research';

export function ResearchCase({ id }: { id: string }) {
  const project = caseIntroductions[id];
  const research = caseResearch[id];
  return (
    <CasePage project={project}>
      <div className="case-research-intro">
        <TextBlockAnimation blockColor={project.accent}>
          <p className="case-eyebrow">01 / {project.company.toUpperCase()}</p>
          <CaseHeading id="research-title">{research.title}</CaseHeading>
          <p className="case-research-description">{research.introduction}</p>
        </TextBlockAnimation>
      </div>
      <ResearchTimeline steps={research.steps} />
      <CaseFollowups id={id} />
      <CaseContent id={id} />
    </CasePage>
  );
}
