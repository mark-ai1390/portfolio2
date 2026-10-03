"use client";

import * as React from 'react';

export type MaskButtonMask = 'nature' | 'urban' | 'forest';
export type MaskButtonVariant = 'primary' | 'secondary';
export type MaskButtonSize = 'sm' | 'md' | 'lg';
type MaskOptions = { mask?: MaskButtonMask; variant?: MaskButtonVariant; size?: MaskButtonSize };
export type MaskButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & MaskOptions;
export type MaskButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & MaskOptions;

const MASK_ASSETS: Record<MaskButtonMask, string> = {
  nature: '/assets/mask-nature.png',
  urban: 'https://cdn.21st.dev/assets/localized/841aa7000857f65ecbfcfe6d33d3b3bf2d50efedf8d72917027def38f3d79570.png',
  forest: 'https://cdn.21st.dev/assets/localized/81c9867f906a33633679ecdb90fc3063b8ebc1bfa1a5a02c6dd8bb539552d5da.png',
};
const maskConfig: Record<MaskButtonMask, { sizeClass: string; rest: string; hover: string }> = {
  nature: { sizeClass: '[mask-size:2300%_100%] [-webkit-mask-size:2300%_100%]', rest: 'animate-mask-nature-out', hover: 'group-hover:animate-mask-nature-in group-focus-visible:animate-mask-nature-in' },
  urban: { sizeClass: '[mask-size:3000%_100%] [-webkit-mask-size:3000%_100%]', rest: 'animate-mask-urban-out', hover: 'group-hover:animate-mask-urban-in group-focus-visible:animate-mask-urban-in' },
  forest: { sizeClass: '[mask-size:7100%_100%] [-webkit-mask-size:7100%_100%]', rest: 'animate-mask-forest-out', hover: 'group-hover:animate-mask-forest-in group-focus-visible:animate-mask-forest-in' },
};
const REDUCED_MOTION_FILL = 'motion-reduce:animate-none motion-reduce:group-hover:animate-none motion-reduce:group-focus-visible:animate-none motion-reduce:[mask-position:0_0] motion-reduce:[-webkit-mask-position:0_0] motion-reduce:group-hover:[mask-position:100%_0] motion-reduce:group-hover:[-webkit-mask-position:100%_0] motion-reduce:group-focus-visible:[mask-position:100%_0] motion-reduce:group-focus-visible:[-webkit-mask-position:100%_0]';
const fillVariant: Record<MaskButtonVariant, string> = { primary: 'bg-primary text-primary-foreground', secondary: 'bg-secondary text-secondary-foreground' };
const sizeClasses: Record<MaskButtonSize, string> = {
  sm: 'px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)] rounded-[var(--button-radius-sm)]',
  md: 'px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)] rounded-[var(--button-radius-md)]',
  lg: 'px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)] rounded-[var(--button-radius-lg)]',
};
const BUTTON_CLASS = 'mask-button group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden border border-border bg-background font-medium text-foreground whitespace-nowrap select-none outline-none [-webkit-tap-highlight-color:transparent] [transition:scale_100ms_ease] focus-visible:[outline:2px_solid_var(--ring)] focus-visible:[outline-offset:4px] active:scale-[0.96] data-[pressed=true]:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none';
const FILL_BASE = 'mask-button-fill absolute inset-0 z-[1] flex items-center justify-center [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-image:var(--mask-img)] [-webkit-mask-image:var(--mask-img)]';

function MaskFaces({ children, mask, variant }: { children: React.ReactNode; mask: MaskButtonMask; variant: MaskButtonVariant }) {
  const cfg = maskConfig[mask];
  return <>
    <span className="mask-button-label relative z-0 inline-flex items-center justify-center">{children}</span>
    <span className={`${FILL_BASE} ${fillVariant[variant]} ${cfg.sizeClass} ${cfg.rest} ${cfg.hover} ${REDUCED_MOTION_FILL}`} style={{ '--mask-img': `url("${MASK_ASSETS[mask]}")` } as React.CSSProperties} aria-hidden="true">{children}</span>
  </>;
}

const MaskButton = React.forwardRef<HTMLButtonElement, MaskButtonProps>(({ className, children, mask = 'nature', variant = 'primary', size = 'md', onKeyDown, onKeyUp, onBlur, ...props }, ref) => {
  const [pressed, setPressed] = React.useState(false);
  return <button ref={ref} type="button" data-mask={mask} data-variant={variant} data-size={size} data-pressed={pressed ? 'true' : undefined}
    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setPressed(true); onKeyDown?.(event); }}
    onKeyUp={event => { if (event.key === 'Enter' || event.key === ' ') setPressed(false); onKeyUp?.(event); }}
    onBlur={event => { setPressed(false); onBlur?.(event); }} className={`${BUTTON_CLASS} ${sizeClasses[size]} ${className ?? ''}`} {...props}>
    <MaskFaces mask={mask} variant={variant}>{children}</MaskFaces>
  </button>;
});
MaskButton.displayName = 'MaskButton';

// Native links preserve new-tab, keyboard and touch navigation without nesting a button.
const MaskButtonLink = React.forwardRef<HTMLAnchorElement, MaskButtonLinkProps>(({ className, children, mask = 'nature', variant = 'primary', size = 'md', ...props }, ref) => (
  <a ref={ref} data-mask={mask} data-variant={variant} data-size={size} className={`${BUTTON_CLASS} ${sizeClasses[size]} ${className ?? ''}`} {...props}>
    <MaskFaces mask={mask} variant={variant}>{children}</MaskFaces>
  </a>
));
MaskButtonLink.displayName = 'MaskButtonLink';
export { MaskButton, MaskButtonLink };
export default MaskButton;
