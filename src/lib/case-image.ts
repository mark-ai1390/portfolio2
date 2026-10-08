import { responsiveImages } from '../data/responsive-images';

export function caseImage(src: string, wide = false) {
  const image = responsiveImages[src];
  if (!image) return { src };
  return {
    src: image.fallback,
    srcSet: image.candidates.map(candidate => `${candidate.src} ${candidate.width}w`).join(', '),
    sizes: wide
      ? '100vw'
      : '(max-width: 767px) calc(100vw - 40px), (max-width: 1239px) calc(100vw - 80px), 1160px',
  };
}
