export interface Project {
  id: string;
  title: string;
  summary: string;
  path: string;
  figmaNode: string;
  tags: string[];
  cover: { src: string; hoverSrc: string; alt: string; width?: number; height?: number };
  cardAnimation?: 'comet';
}

// Copy verified against Page 3, homepage 296:259684 and card set 417:144766.
// Each card links to the implemented beginning of its case.
export const projects: Project[] = [
  {
    id: 'primekraft',
    title: 'PrimeKraft',
    summary: 'Аудит и концепция интернет-магазина спортивного питания: каталог, карточки товаров, оформление заказа и фирменный стиль.',
    tags: ['E-commerce', 'UI/UX', 'Brand System'],
    path: '/projects/primekraft',
    figmaNode: '342:125764',
    cover: { src: '/assets/primekraft-normal-v2.webp', hoverSrc: '/assets/primekraft-hover-v2.webp', alt: 'Концепция магазина PrimeKraft на экране ноутбука', width: 2048, height: 1227 },
    cardAnimation: 'comet',
  },
  {
    id: 'copterdrone',
    title: 'CopterDrone',
    summary: 'Редизайн интернет-магазина радиоуправляемых моделей: поиск, каталог, покупка и личный кабинет.',
    tags: ['E-commerce', 'UI/UX', 'Mobile-first'],
    path: '/projects/copterdrone',
    figmaNode: '296:239537',
    cover: { src: '/assets/copterdrone-normal.webp', hoverSrc: '/assets/copterdrone-hover.webp', alt: 'Интернет-магазин CopterDrone на ноутбуке и телефоне' },
    cardAnimation: 'comet',
  },
  {
    id: '4sales',
    title: '4SALES CRM',
    summary: 'Редизайн CRM для работы с заказами, клиентами, товарами и командой. От анализа и структуры экранов до макетов и прототипа.',
    tags: ['CRM', 'Product design'],
    path: '/projects/4sales',
    figmaNode: '306:102823',
    cover: { src: '/assets/4sales-normal-v2.webp', hoverSrc: '/assets/4sales-hover-v2.webp', alt: 'Дашборд 4SALES CRM на планшете', width: 2048, height: 1227 },
    cardAnimation: 'comet',
  },
];

export const author = {
  name: 'Марк Сангинов',
  resume: '/assets/mark-sanginov-resume-ru-v2.pdf',
  portrait: '/assets/mark-portrait.jpg',
  discipline: 'Product Designer',
  areas: ['B2B', 'Desktop', 'Mobile'],
  description: 'Проектирую интернет-магазины и CRM. Изучаю сценарии, продумываю структуру и готовлю макеты для разработки.',
  contacts: [
    { label: 'Email', href: 'mailto:ligeon199815@gmail.com' },
    { label: 'Telegram', href: 'https://t.me/Markro1998' },
  ],
};
