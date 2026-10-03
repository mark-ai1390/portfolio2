import { ResearchTimeline } from './ResearchTimeline';
import { CaseFollowups } from './CaseFollowups';
import { copterdrone } from '../data/copterdrone';
import { CasePage } from './CasePage';
import { caseIntroductions } from '../data/case-introductions';
import TextBlockAnimation from './ui/text-block-animation';
import { CaseHeading } from './CaseHeading';


export function CopterDroneCase() {
  return (
    <CasePage project={caseIntroductions.copterdrone}>
      <div className="case-research-intro">
        <TextBlockAnimation blockColor="#1fb59c">
          <p className="case-eyebrow">01 / COPTERDRONE</p>
          <CaseHeading id="research-title">UX-исследование</CaseHeading>
        </TextBlockAnimation>
      </div>
      <ResearchTimeline steps={copterdrone.steps} />
      <CaseFollowups id="copterdrone" />
    </CasePage>
  );
}
