export interface Concept {
  id: string;
  title: string;
  label: string;
  summary: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  variant: 'desktop' | 'mobile' | 'wide';
}

// Page 4, node 705:144573. Five exploratory projects follow the three full cases.
export const concepts: Concept[] = [
  {
    id: 'mpgo',
    title: 'MPGO',
    label: '01 / B2B · PRODUCT',
    summary: 'Подбор и сравнение складов для продавцов',
    image: '/assets/concepts/mpgo.png',
    alt: 'Сравнение трёх фулфилмент-складов и тарифов MPGO',
    width: 494,
    height: 206,
    variant: 'desktop',
  },
  {
    id: 'evar',
    title: 'EVAR',
    label: '02 / MOBILE · RETAIL',
    summary: 'Лояльность, бонусы и QR-карта',
    image: '/assets/concepts/evar.png',
    alt: 'Мобильный экран EVAR с картой лояльности и кешбэком',
    width: 375,
    height: 825,
    variant: 'mobile',
  },
  {
    id: 'tennisi',
    title: 'TENNISI.TJ',
    label: '03 / WEB · SPORTS',
    summary: 'События и навигация',
    image: '/assets/concepts/tennisi.png',
    alt: 'Десктопная главная TENNISI со спортивными событиями',
    width: 1440,
    height: 1736,
    variant: 'wide',
  },
  {
    id: 'ayon',
    title: 'AYON',
    label: '04 / B2B · DASHBOARD',
    summary: 'Управление поставками',
    image: '/assets/concepts/ayon.png',
    alt: 'Интерфейс AYON с состояниями поставок и решениями',
    width: 1304,
    height: 1000,
    variant: 'desktop',
  },
  {
    id: 'landing',
    title: 'Лендинг',
    label: '05 / COMMERCIAL',
    summary: 'Для Дарьи Таратуто',
    image: '/assets/concepts/dasha.png',
    alt: 'Мобильный лендинг-визитка Дарьи Таратуто',
    width: 390,
    height: 690,
    variant: 'mobile',
  },
];
