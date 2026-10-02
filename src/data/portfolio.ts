export interface Project {
  id: string;
  title: string;
  summary: string;
  path: string;
  figmaNode: string;
  cover?: { src: string; alt: string };
}

// Copy reflects the implementation plan; exact homepage copy still needs Figma verification.
// Do not connect case links until the actual pages exist.
export const projects: Project[] = [
  {
    id: 'primekraft',
    title: 'Prime Kraft',
    summary: 'Аудит и гипотезы, интернет-магазин, фирменный стиль.',
    path: '/projects/primekraft',
    figmaNode: '342:125764',
  },
  {
    id: 'copterdrone',
    title: 'CopterDrone',
    summary: 'UX-исследование, интернет-магазин, логотип и айдентика.',
    path: '/projects/copterdrone',
    figmaNode: '296:239537',
  },
  {
    id: '4sales',
    title: '4sales CRM',
    summary: 'Архитектура, интерфейсы CRM, система компонентов и браузерный прототип.',
    path: '/projects/4sales',
    figmaNode: '306:102823',
  },
];

export const author = {
  name: 'Марк Сангинов',
  discipline: 'Product Design',
  areas: ['B2B', 'Desktop', 'Mobile'],
  contacts: [
    { label: 'Email', href: 'mailto:ligeon199815@gmail.com' },
    { label: 'Telegram', href: 'https://t.me/Markro1998' },
  ],
};
