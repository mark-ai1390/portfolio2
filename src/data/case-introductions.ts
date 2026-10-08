import { copterdrone } from './copterdrone';
import { projects } from './portfolio';

export type CaseIntroductionData = {
  id: string;
  company: string;
  titleLead: string;
  accent: string;
  figma: string;
  cover: { src: string; alt: string; height?: number; mobile: { src: string; width: number; height: number } };
  concepts: { image: string; alt: string; width: number; height: number; mobile: { src: string; width: number; height: number } };
  task: readonly string[];
};

const project = (id: string) => projects.find(item => item.id === id)!;

// Introduction and task copy verified against Page 3; the remaining case
// sections are separate work, not invented to fill these initial pages.
export const caseIntroductions: Record<string, CaseIntroductionData> = {
  copterdrone: {
    ...copterdrone, id: 'copterdrone', accent: '#1fb59c',
    figma: 'https://www.figma.com/design/7VNybOgr3XMlOhhE8K4hRe/Drone?node-id=3-2',
    cover: { src: '/assets/copterdrone-case-cover.webp', height: 970, alt: project('copterdrone').cover.alt,
      mobile: { src: '/assets/mobile/copterdrone-mobile-cover-v1.webp', width: 1125, height: 674 } },
    concepts: { ...copterdrone.concepts,
      mobile: { src: '/assets/mobile/copterdrone-mobile-concepts-v1.webp', width: 1125, height: 1284 } },
  },
  primekraft: {
    id: 'primekraft', company: 'PRIMEKRAFT', titleLead: 'Редизайн интернет-магазина', accent: '#ffd500',
    figma: 'https://www.figma.com/design/GUFncQWHBUdFHVNdevA6D1/primekraft?node-id=2049-14576', cover: { src: '/assets/primekraft-case-cover.webp', height: 970, alt: 'Новый дизайн PRIMEKRAFT и развитие фирменного стиля с персонажем Рафтом',
      mobile: { src: '/assets/mobile/primekraft-mobile-cover-v1.webp', width: 1125, height: 674 } },
    concepts: { image: '/assets/primekraft-concepts.png', width: 2048, height: 755,
      alt: 'Готовые концепты Prime Kraft: композиция экранов магазина спортивного питания',
      mobile: { src: '/assets/mobile/primekraft-mobile-concepts-v1.webp', width: 1125, height: 1284 } },
    task: [
      'Сделать покупку удобнее: помочь пользователю найти нужную категорию, сравнить товары и оформить заказ, сохранив узнаваемость Prime Kraft.',
      'Сохранить чёрно-жёлтые цвета и образ носорога. Разработать общий стиль для интерфейса, иллюстраций и рекламных материалов.',
    ],
  },
  '4sales': {
    id: '4sales', company: '4sales', titleLead: 'CRM для ежедневной работы с продажами', accent: '#8097ff',
    figma: 'https://www.figma.com/design/ufCGdzahHmwbLQWYjeAzNp/CRMED?node-id=394-13480', cover: { src: '/assets/4sales-case-cover.webp', alt: project('4sales').cover.alt,
      mobile: { src: '/assets/mobile/4sales-mobile-cover-v1.webp', width: 1125, height: 674 } },
    concepts: { image: '/assets/4sales-concepts.png', width: 2048, height: 755,
      alt: 'Готовые концепты 4sales: дашборд, заказы, клиенты, товары и менеджеры',
      mobile: { src: '/assets/mobile/4sales-mobile-concepts-v1.webp', width: 1125, height: 1284 } },
    task: [
      'Сохранить возможности 4sales для учёта и контроля, но сделать ежедневную работу понятнее: что требует внимания, в каком состоянии заказ и какое действие выполнить дальше.',
      'Заказчик выбрал retailCRM как ориентир. Я сравнил навигацию, структуру страниц, фильтры и связи между заказами, клиентами и товарами.',
    ],
  },
};
