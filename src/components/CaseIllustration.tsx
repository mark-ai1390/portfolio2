import { caseImage } from '../lib/case-image';
import { CaseImageLink } from './CaseImageViewer';

export function CaseIllustration({ src, alt, width, height, wide = false, radius = 14, nodeId }: { src: string; alt: string; width: number; height: number; wide?: boolean; radius?: number; nodeId?: string }) {
  return <figure className={`case-illustration${wide ? ' case-illustration--wide' : ''}`} data-figma-node={nodeId}>
    <CaseImageLink image={{ src, alt, width, height }} style={{ borderRadius: radius }}>
      <img style={{ borderRadius: radius }} {...caseImage(src, wide)} alt={alt} width={Math.round(width)} height={Math.round(height)} loading="lazy" decoding="async" />
    </CaseImageLink>
  </figure>;
}
