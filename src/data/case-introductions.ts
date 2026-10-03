import { copterdrone } from './copterdrone';
import { projects } from './portfolio';

export type CaseIntroductionData = {
  id: string;
  company: string;
  titleLead: string;
  accent: string;
  figma: string;
  cover: { src: string; alt: string };
  concepts: { image: string; alt: string; width: number; height: number };
  task: readonly string[];
};

const project = (id: string) => projects.find(item => item.id === id)!;
const figma = (id: string) => `https://www.figma.com/design/yojJb08rcCuEd3ZTZZYsgA/Portfolio-2026?node-id=${project(id).figmaNode.replace(':', '-')}`;

// Introduction and task copy verified against Page 3; the remaining case
// sections are separate work, not invented to fill these initial pages.
export const caseIntroductions: Record<string, CaseIntroductionData> = {
  copterdrone: { ...copterdrone, id: 'copterdrone', accent: '#1fb59c', cover: { src: '/assets/copterdrone-case-cover.webp', alt: project('copterdrone').cover.alt } },
  primekraft: {
    id: 'primekraft', company: 'PRIMEKRAFT', titleLead: 'Редизайн интернет-магазина', accent: '#ffd500',
    figma: figma('primekraft'), cover: { src: '/assets/primekraft-case-cover.webp', alt: 'Новый дизайн PRIMEKRAFT и развитие фирменного стиля с персонажем Рафтом' },
    concepts: { image: '/assets/primekraft-concepts.png', width: 2048, height: 755,
      alt: 'Готовые концепты Prime Kraft: композиция экранов магазина спортивного питания' },
    task: [
      'Объединить узнаваемость Prime Kraft и удобство покупки: помочь пользователю быстрее найти нужную категорию, сравнить товары и перейти к оформлению заказа.',
      'Сохранить характер бренда — чёрный, жёлтый и образ носорога — и связать интерфейс, иллюстрации и рекламные материалы единой визуальной системой.',
    ],
  },
  '4sales': {
    id: '4sales', company: '4sales', titleLead: 'CRM для ежедневной работы с продажами', accent: '#8097ff',
    figma: figma('4sales'), cover: { src: '/assets/4sales-case-cover.webp', alt: project('4sales').cover.alt },
    concepts: { image: '/assets/4sales-concepts.png', width: 2048, height: 755,
      alt: 'Готовые концепты 4sales: дашборд, заказы, клиенты, товары и менеджеры' },
    task: [
      'Сохранить возможности 4sales для учёта и контроля, но сделать ежедневную работу понятнее: что требует внимания, в каком состоянии заказ и какое действие выполнить дальше.',
      'В качестве ориентира заказчик выбрал retailCRM. Я сравнил не только внешний вид, но и логику навигации, структуру страниц, фильтры и связи между сущностями.',
    ],
  },
};
