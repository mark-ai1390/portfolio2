import type { ReactNode } from 'react';
import { Heading } from './ui/heading';

export function CaseHeading({ id, children }: { id: string; children: ReactNode }) {
  return <Heading level={2} id={id} className="case-heading">{children}</Heading>;
}
