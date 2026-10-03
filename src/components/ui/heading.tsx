import type { HTMLAttributes } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { level: 1 | 2 | 3 };

export function Heading({ level, className = '', ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  return <Tag className={`heading heading--${level} ${className}`} {...props} />;
}
