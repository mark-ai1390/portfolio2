export function CaseIllustration({ src, alt, width, height, wide = false, nodeId }: { src: string; alt: string; width: number; height: number; wide?: boolean; nodeId?: string }) {
  return <figure className={`case-illustration${wide ? ' case-illustration--wide' : ''}`} data-figma-node={nodeId}>
    <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`Открыть иллюстрацию: ${alt}`}>
      <img src={src} alt={alt} width={Math.round(width)} height={Math.round(height)} loading="lazy" decoding="async" />
    </a>
  </figure>;
}
