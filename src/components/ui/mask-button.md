MaskButton is integrated in src/components/ui, the project's shared UI directory. The @ alias resolves to src, so @/components/ui/mask-button works. This follows the shadcn structure without duplicating a root components folder. components.json points the CLI to this directory and src/styles.css.

React + TypeScript were already configured. Tailwind 4 and @tailwindcss/vite are now installed and enabled. Theme and utilities are imported without Preflight to preserve the existing site's CSS. tw-animate-css is installed. All six sprite animation utilities are defined in the Tailwind theme, with hover, keyboard focus and reduced-motion states. The nature sprite used on the case pages is hosted locally. Optional urban/forest masks retain the supplied source URLs.

MaskButton preserves the supplied button API. MaskButtonLink shares its appearance while using native anchor navigation for Telegram. The resting face is white with #272727 text, matching Figma's Telegram button; the sprite reveals a pale grey base with the same readable label. Blur resets the button's keyboard pressed state.

Usage:
```tsx
import { MaskButton, MaskButtonLink } from '@/components/ui/mask-button';
<MaskButton mask="nature">Explore</MaskButton>
<MaskButtonLink href="https://t.me/Markro1998">Телеграм</MaskButtonLink>
```

No setup is needed for this checkout. To add future shadcn components, run `npx shadcn@latest add <component>`; the existing components.json and TypeScript/Vite alias select the correct paths. Styles for the mask live in src/components/ui/mask-button.css, imported by src/styles.css.
