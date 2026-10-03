import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Adapted from Magic UI's InteractiveHoverButton (MIT). The same expanding
// dot and sliding label use the portfolio's CSS and an upward arrow.
export function InteractiveHoverButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn('interactive-hover-button', className)} {...props}>
    <span className="interactive-hover-rest">
      <span className="interactive-hover-dot" aria-hidden="true" />
      <span className="interactive-hover-label">{children}</span>
    </span>
    <span className="interactive-hover-active" aria-hidden="true">
      <span>{children}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </span>
  </button>;
}
