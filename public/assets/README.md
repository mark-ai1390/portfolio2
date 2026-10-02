# Материалы портфолио

Источник: экспорты Figma, загруженные Марком в сессии 003. Исходные вложения не изменялись. Шесть PNG 2048×1227 сохранены для сайта как WebP (quality 92, method 6), без изменения размеров и композиции. Общий вес шести обложек примерно 1.37 MB вместо 19.72 MB исходных PNG.

| Вложение | Ресурс сайта | Состояние |
| --- | --- | --- |
| Презентация.png | primekraft-normal.webp | PrimeKraft normal |
| Презентация-1.png | primekraft-hover.webp | PrimeKraft hover |
| Презентация-2.png | copterdrone-normal.webp | CopterDrone normal |
| Презентация-3.png | copterdrone-hover.webp | CopterDrone hover |
| Презентация-4.png | 4sales-normal.webp | 4SALES normal |
| Презентация-5.png | 4sales-hover.webp | 4SALES hover |
| IMG_5784.jpg | mark-portrait.jpg | Фото автора, исходные байты |

Обложки — готовые композиции. CSS меняет opacity hover-изображения за 300ms (ease-out для PrimeKraft/CopterDrone, linear для CRM). Это crossfade; отдельные слои Smart Animate не воспроизводятся. На touch сохраняется normal; reduced motion отключает transition.

Портрет кадрируется только в CSS в круг 153px, исходное фото сохранено целиком. Резюме пока нет по сообщению пользователя; временные ссылки и фиктивный файл не добавлены.


### CopterDrone — миниатюры исследования

Оригинальные экспорты из Page 3, файл yojJb08rcCuEd3ZTZZYsgA. PNG, exportAsync с constraint WIDTH; figma.io.write доставил бинарные данные.
- copter-research.png — 296:239694, 800×361.
- copter-scenarios.png — 296:239734, 600×437, также иллюстрирует бенчмаркинг исходными референсами.
- copter-architecture.png — 296:239735, 800×1155.

Все миниатюры показаны через object-fit: contain, без дополнительного кадрирования, и открываются отдельным изображением.

### CopterDrone — готовые концепты

- copter-concepts.png — оригинальный PNG-экспорт композиции «Главный экран», Page 3, yojJb08rcCuEd3ZTZZYsgA, узел 357:144535; exportAsync PNG scale 1, 1160×625. Передан через base64Encode, без перекомпоновки или перерисовки.
- Слот: после обложки и H1, перед задачей. 100% case-main, исходные пропорции 1160:625; radius 14px. На телефоне та же композиция уменьшена пропорционально; ссылка открывает оригинал.
