import { createContext, forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState,
  type AnchorHTMLAttributes, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { clampZoom, pinchPoints, zoomScroll, type Point } from '../lib/viewer-geometry';
import './case-image-viewer.css';

type ViewerImage = { src: string; alt: string; width: number; height: number; preview?: string };
type ViewerContext = { open: (image: ViewerImage, trigger: HTMLAnchorElement) => void; hintSources: readonly string[]; seen: ReadonlySet<string> };
const ImageViewerContext = createContext<ViewerContext | null>(null);

export function CaseImageViewerProvider({ children, hintSources }: { children: ReactNode; hintSources: readonly string[] }) {
  const [image, setImage] = useState<ViewerImage | null>(null);
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set());
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const open = useCallback((next: ViewerImage, element: HTMLAnchorElement) => {
    trigger.current = element;
    setSeen(previous => new Set([...previous, next.src]));
    setImage({ ...next, preview: element.querySelector('img')?.currentSrc });
  }, []);
  const close = useCallback(() => setImage(null), []);

  return <ImageViewerContext.Provider value={{ open, hintSources, seen }}>
    {children}
    <ImageViewer image={image} onClose={close} trigger={trigger.current} />
  </ImageViewerContext.Provider>;
}

type ImageLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { image: ViewerImage };

// Keep a real original-file link for modified clicks and as a fallback.
export const CaseImageLink = forwardRef<HTMLAnchorElement, ImageLinkProps>(function CaseImageLink({ image, children, className = '', onClick, ...props }, ref) {
  const viewer = useContext(ImageViewerContext);
  const hint = !!viewer?.hintSources.includes(image.src) && !viewer.seen.has(image.src);
  const click = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !viewer || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    viewer.open(image, event.currentTarget);
  };
  return <a {...props} ref={ref} className={`case-image-link ${className}${hint ? ' case-image-link--hint' : ''}`}
    href={image.src} target="_blank" rel="noopener noreferrer" aria-haspopup="dialog"
    aria-label={props['aria-label'] ?? `Открыть иллюстрацию: ${image.alt}`} onClick={click}>
    {children}
    {hint && <span className="case-image-hint" aria-hidden="true">
      <span className="case-image-pointer">
        <span className="case-image-tap-ring" />
        <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
          <path d="M8 4L35 29L23 31L29 43L21 47L15 34L6 42L8 4Z" fill="white" stroke="#18181d" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="case-image-hint-label">Открыть крупнее</span>
    </span>}
  </a>;
});

type Pinch = { distance: number; zoom: number; anchor: Point };

function ImageViewer({ image, onClose, trigger }: { image: ViewerImage | null; onClose: () => void; trigger: HTMLAnchorElement | null }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [baseWidth, setBaseWidth] = useState(1);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const pendingScroll = useRef<Point | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<Pinch | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const loaded = !!image && loadedSource === image.src;
  const failed = !!image && failedSource === image.src;

  useEffect(() => {
    if (!image) return;
    const modal = dialog.current!;
    const stage = viewport.current!;
    const oldOverflow = document.body.style.overflow;
    const oldPadding = document.body.style.paddingRight;
    const pagePosition = { x: window.scrollX, y: window.scrollY };
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gutter}px`;
    document.body.style.overflow = 'hidden';
    setDragging(false);
    pointers.current.clear(); pinch.current = null; pendingScroll.current = null;
    zoomRef.current = window.matchMedia('(max-width: 767px)').matches ? 2 : 1;
    setZoom(zoomRef.current);
    modal.showModal();
    const measure = () => setBaseWidth(Math.max(1, stage.clientWidth - 32));
    measure();
    stage.scrollTo(0, 0);
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => {
      observer.disconnect();
      pointers.current.clear(); pinch.current = null;
      if (modal.open) modal.close();
      document.body.style.overflow = oldOverflow;
      document.body.style.paddingRight = oldPadding;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      window.scrollTo({ left: pagePosition.x, top: pagePosition.y, behavior: 'instant' });
    };
  }, [image, trigger]);

  useLayoutEffect(() => {
    if (!pendingScroll.current || !viewport.current) return;
    viewport.current.scrollTo(pendingScroll.current.x, pendingScroll.current.y);
    pendingScroll.current = null;
  }, [zoom, baseWidth]);

  const zoomAt = (next: number, point?: Point) => {
    const stage = viewport.current;
    if (!stage) return;
    next = clampZoom(next);
    if (next === zoomRef.current) return;
    const anchor = point ?? { x: stage.clientWidth / 2 - 16, y: stage.clientHeight / 2 - 16 };
    pendingScroll.current = zoomScroll({ x: stage.scrollLeft, y: stage.scrollTop }, anchor, zoomRef.current, next);
    zoomRef.current = next;
    setZoom(next);
  };

  const pointInStage = (point: Point) => {
    const bounds = viewport.current!.getBoundingClientRect();
    return { x: point.x - bounds.left - 16, y: point.y - bounds.top - 16 };
  };

  const fitWidth = () => {
    pendingScroll.current = { x: 0, y: 0 };
    zoomRef.current = 1; setZoom(1);
    viewport.current?.scrollTo(0, 0);
  };

  const startPinch = () => {
    const stage = viewport.current!;
    const gesture = pinchPoints([...pointers.current.values()]);
    const center = pointInStage(gesture.center);
    pinch.current = { distance: Math.max(1, gesture.distance), zoom: zoomRef.current,
      anchor: { x: (stage.scrollLeft + center.x) / zoomRef.current, y: (stage.scrollTop + center.y) / zoomRef.current } };
  };

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    setDragging(true);
    if (pointers.current.size === 2) startPinch();
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const stage = event.currentTarget;
    if (pointers.current.size >= 2 && pinch.current) {
      const gesture = pinchPoints([...pointers.current.values()]);
      const next = clampZoom(pinch.current.zoom * gesture.distance / pinch.current.distance);
      const center = pointInStage(gesture.center);
      const position = { x: pinch.current.anchor.x * next - center.x, y: pinch.current.anchor.y * next - center.y };
      if (next === zoomRef.current) stage.scrollTo(position.x, position.y);
      else { pendingScroll.current = position; zoomRef.current = next; setZoom(next); }
    } else {
      stage.scrollLeft += previous.x - event.clientX;
      stage.scrollTop += previous.y - event.clientY;
    }
  };
  const pointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    pinch.current = null;
    if (pointers.current.size >= 2) startPinch();
    setDragging(pointers.current.size > 0);
  };

  return <dialog className="case-image-viewer" ref={dialog} aria-label={image ? `Просмотр: ${image.alt}` : 'Просмотр изображения'}
    aria-describedby="case-viewer-help" onCancel={event => { event.preventDefault(); onClose(); }}
    onClose={() => { if (!dialog.current?.open) onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => {
      if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomAt(zoomRef.current * 1.25); }
      if (event.key === '-') { event.preventDefault(); zoomAt(zoomRef.current / 1.25); }
      if (event.key === '0') { event.preventDefault(); fitWidth(); }
    }}>
    {image && <div className="case-viewer-panel">
      <div className="case-viewer-toolbar">
        <div className="case-viewer-zoom">
          <button type="button" aria-label="Уменьшить изображение" disabled={zoom <= 1} onClick={() => zoomAt(zoomRef.current / 1.25)}>−</button>
          <output aria-label="Масштаб изображения" aria-live="off">{Math.round(zoom * 100)}%</output>
          <button type="button" aria-label="Увеличить изображение" disabled={zoom >= 6} onClick={() => zoomAt(zoomRef.current * 1.25)}>+</button>
          <button type="button" className="case-viewer-fit" onClick={fitWidth}>По ширине</button>
        </div>
        <button type="button" className="case-viewer-close" aria-label="Закрыть просмотр изображения" autoFocus onClick={onClose}>×</button>
      </div>
      <div className={`case-viewer-viewport${dragging ? ' is-dragging' : ''}`} ref={viewport} tabIndex={0}
        role="region" aria-label="Увеличенное изображение, перемещайте пальцем или стрелками"
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
        onLostPointerCapture={event => {
          if (!pointers.current.has(event.pointerId)) return;
          pointers.current.delete(event.pointerId); pinch.current = null; setDragging(pointers.current.size > 0);
        }}
        onDoubleClick={event => zoomAt(zoomRef.current > 1 ? 1 : 2, pointInStage({ x: event.clientX, y: event.clientY }))}>
        <div className="case-viewer-canvas">
          <div className="case-viewer-image" style={{ width: baseWidth * zoom, aspectRatio: `${image.width} / ${image.height}` }}>
            {!loaded && image.preview && <img className="case-viewer-preview" src={image.preview} alt="" aria-hidden="true" draggable={false} />}
            <img key={image.src} className="case-viewer-original" src={image.src} alt={image.alt} width={image.width} height={image.height}
              style={{ opacity: loaded ? 1 : 0 }} draggable={false} decoding="async"
              onLoad={() => { setLoadedSource(image.src); setFailedSource(null); }} onError={() => { setFailedSource(image.src); setLoadedSource(null); }} />
          </div>
        </div>
      </div>
      <div className="case-viewer-caption">
        <p id="case-viewer-help">Двигайте изображение. Масштаб — двумя пальцами или кнопками.</p>
        {!loaded && <p role="status">{failed ? 'Не удалось загрузить изображение.' : 'Загрузка изображения…'}</p>}
        <a href={image.src} target="_blank" rel="noopener noreferrer">Открыть оригинал ↗</a>
      </div>
    </div>}
  </dialog>;
}
