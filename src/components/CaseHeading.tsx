import type { ReactNode } from 'react';

export function CaseHeading({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="case-heading">{children}</h2>;
}
