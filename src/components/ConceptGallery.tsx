import { useEffect, useRef, useState } from 'react';
import { concepts, type Concept } from '../data/concepts';

const rows = [concepts.slice(0, 2), concepts.slice(2, 3), concepts.slice(3, 5)];

function ConceptCard({
  concept,
  onOpen,
}: {
  concept: Concept;
  onOpen: (id: string, trigger: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      className={'concept-card concept-card--' + concept.variant + ' concept-card--' + concept.id}
      onClick={event => onOpen(concept.id, event.currentTarget)}
      aria-label={concept.title + '. ' + concept.summary + '. Подробнее о проекте'}
    >
      <span className="concept-card__meta">
        <span>{concept.label}</span>
        <span className="concept-card__arrow" aria-hidden="true">→</span>
      </span>
      <span className="concept-card__media" aria-hidden="true">
        <img
          className="concept-card__image"
          src={concept.image}
          alt=""
          width={concept.width}
          height={concept.height}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="concept-card__copy">
        <span className="concept-card__title-line">
          <span className="concept-card__title">{concept.title}</span>
          <span className="concept-card__arrow" aria-hidden="true">→</span>
        </span>
        <span className="concept-card__summary">{concept.summary}</span>
      </span>
    </button>
  );
}

export function ConceptGallery() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const active = concepts.find(concept => concept.id === activeId);

  useEffect(() => {
    if (!activeId) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = oldOverflow;
      if (dialog?.open) dialog.close();
    };
  }, [activeId]);

  const openProject = (id: string, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActiveId(id);
  };

  const closeDialog = () => dialogRef.current?.close();

  return (
    <section className="concepts-section" aria-labelledby="concepts-title">
      <header className="concepts-section__intro">
        <span className="concepts-section__eyebrow">SELECTED WORK / 2026</span>
        <h2 id="concepts-title">Концепты и другие проекты</h2>
        <p>Продуктовые сценарии, интерфейсы и один коммерческий лендинг.</p>
      </header>

      <div className="concepts-section__rows">
        {rows.map((row, index) => (
          <div
            key={index}
            className={'concepts-section__row' + (index === 1 ? ' concepts-section__row--wide' : '')}
          >
            {row.map(concept => (
              <ConceptCard key={concept.id} concept={concept} onOpen={openProject} />
            ))}
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="concept-dialog"
        aria-labelledby="concept-dialog-title"
        aria-describedby="concept-dialog-description"
        onClose={() => {
          setActiveId(null);
          triggerRef.current?.focus();
        }}
        onClick={event => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="concept-dialog__panel">
          <button
            className="concept-dialog__close"
            type="button"
            aria-label="Закрыть окно"
            onClick={closeDialog}
          >
            ×
          </button>
          <span className="concept-dialog__eyebrow">ПРОЕКТ / {active?.title}</span>
          <h2 id="concept-dialog-title">Извините, страница в разработке</h2>
          <p id="concept-dialog-description">
            Сейчас я оформляю материалы проекта. Скоро здесь появится полноценный кейс.
          </p>
          <button className="concept-dialog__action" type="button" onClick={closeDialog}>
            Понятно <span aria-hidden="true">→</span>
          </button>
        </div>
      </dialog>
    </section>
  );
}
