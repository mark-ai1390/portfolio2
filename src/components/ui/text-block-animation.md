# TextBlockAnimation

Компонент из пользовательского примера адаптирован к React + TypeScript + Vite. Файл расположен в src/components/ui: общий UI-каталог для повторного использования в других кейсах. Импорт относительный; alias @ не требуется. Стили находятся в ../case.css. Зависимости: gsap и @gsap/react; SplitText/ScrollTrigger входят в gsap.

Анимация раскрывает строки акцентными полосами. SplitText mask/autoSplit/onSplit сохраняют переносы при смене ширины и загрузке шрифта. useGSAP + matchMedia возвращают исходную разметку при cleanup и reduced motion. Текстовые линии размечены SplitText для screen reader. При reduced motion весь текст доступен сразу.

Исходное демо использует Tailwind и shadcn-структуру. В интегрированной версии классы заменены обычным CSS, поэтому менять стек для этой анимации не требуется. TypeScript и каталог src/components/ui уже есть.

Если позже понадобится исходное Tailwind-демо без адаптации:

1. По инструкции https://tailwindcss.com/docs/installation/using-vite установить tailwindcss и @tailwindcss/vite, подключить tailwindcss() в plugins Vite и добавить @import "tailwindcss" в глобальный CSS.
2. По https://ui.shadcn.com/docs/installation/vite настроить alias @ на ./src в TypeScript/Vite и выполнить npx shadcn@latest init. Components alias должен указывать на @/components, ui — на @/components/ui.
3. Импортировать компонент как @/components/ui/text-block-animation. Демо с ArrowDown дополнительно требует lucide-react. Не заменять текущие package/tsconfig/Vite файлы целиком.

Текущая интеграция не требует cn, lucide-react, motion, rough-notation или shadcn CLI. Анимированная SVG-стрелка используется из существующего кейса.
