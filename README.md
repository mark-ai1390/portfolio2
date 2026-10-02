# Портфолио Марка Сангинова

React + TypeScript + Vite. Источник макетов и границы проекта: [план реализации](portfolio-implementation-plan.md). Статус этапов: [feature_list.json](feature_list.json), проверенные результаты: [claude-progress.md](claude-progress.md).

## Разработка

Node.js >=22.12.0 и npm. В корне репозитория:

```sh
./init.sh                         # npm ci, build (включая typecheck), Playwright
RUN_START_COMMAND=1 ./init.sh     # затем запуск dev, порт 5173
npm run dev                     # быстрый запуск после установки
npm run build                   # production-сборка в dist
npm run preview                 # проверка сборки
npm test                        # браузерные проверки
```

`init.sh` использует системный Chromium, если он доступен; иначе устанавливает браузер Playwright. Можно явно задать `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. На минимальном Linux для браузера могут потребоваться системные библиотеки (`npx playwright install --with-deps chromium`).

Макеты и план были подготовлены до создания кода. Главная собирается поэтапно; кейсы и публикация — последующие этапы. Экспорты Figma, портрет и резюме ещё нужны для завершения главной. Оригинальные ресурсы хранить в `public/assets`; Rubik установлен локально, без CDN. Хостинг пока не выбран.
