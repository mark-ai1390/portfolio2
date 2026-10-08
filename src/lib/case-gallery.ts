import { caseContent } from '../data/case-content';
import { caseResearch } from '../data/case-research';
import { copterdrone } from '../data/copterdrone';

// Covers and the decorative composition below each cover are intentionally absent.
export function caseHintImages(id: string): string[] {
  const steps = id === 'copterdrone' ? copterdrone.steps : caseResearch[id]?.steps ?? [];
  return [
    ...steps.flatMap(step => 'image' in step && step.image ? [step.image] : []),
    ...(caseContent[id] ?? []).flatMap(block => block.kind === 'image' && block.src ? [block.src] : []),
  ].slice(0, 2);
}
