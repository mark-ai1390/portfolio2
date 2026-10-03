export interface Project {
  id: string;
  title: string;
  summary: string;
  path: string;
  figmaNode: string;
  tags: string[];
  cover: { src: string; hoverSrc: string; alt: string };
}

// Copy verified against Page 3, homepage 296:259684 and card set 417:144766.
// Each card links to the implemented beginning of its case.
export const projects: Project[] = [
  {
    id: 'primekraft',
    title: 'PrimeKraft',
    summary: 'Концепция редизайна интернет-магазина: аудит, структура, карточка товара, корзина и развитие визуального языка бренда.',
    tags: ['E-commerce', 'UI/UX', 'Brand System'],
    path: '/projects/primekraft',
    figmaNode: '342:125764',
    cover: { src: '/assets/primekraft-normal.webp', hoverSrc: '/assets/primekraft-hover.webp', alt: 'Концепция магазина PrimeKraft на экране ноутбука' },
  },
  {
    id: 'copterdrone',
    title: 'CopterDrone',
    summary: 'Редизайн интернет-магазина радиоуправляемых моделей',
    tags: ['E-commerce', 'UI/UX', 'Mobile-first'],
    path: '/projects/copterdrone',
    figmaNode: '296:239537',
    cover: { src: '/assets/copterdrone-normal.webp', hoverSrc: '/assets/copterdrone-hover.webp', alt: 'Интернет-магазин CopterDrone на ноутбуке и телефоне' },
  },
  {
    id: '4sales',
    title: '4SALES CRM',
    summary: 'Редизайн CRM-системы для работы с клиентами, заказами, товарами, менеджерами и внутренними процессами.',
    tags: ['CRM', 'Product design'],
    path: '/projects/4sales',
    figmaNode: '306:102823',
    cover: { src: '/assets/4sales-normal.webp', hoverSrc: '/assets/4sales-hover.webp', alt: 'Дашборд 4SALES CRM на планшете' },
  },
];

export const author = {
  name: 'Марк Сангинов',
  portrait: '/assets/mark-portrait.jpg',
  discipline: 'Product Design',
  areas: ['B2B', 'Desktop', 'Mobile'],
  description: 'Проектирую e-commerce и сложные web-интерфейсы от UX-аудита и структуры\nдо UI и передачи в разработку',
  contacts: [
    { label: 'Email', href: 'mailto:ligeon199815@gmail.com' },
    { label: 'Telegram', href: 'https://t.me/Markro1998' },
  ],
};
