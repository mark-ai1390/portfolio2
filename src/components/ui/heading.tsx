import { Children, type HTMLAttributes } from 'react';
import { typography } from '../../lib/typography';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { level: 1 | 2 | 3 };

export function Heading({ level, className = '', children, ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  return <Tag className={`heading heading--${level} ${className}`} {...props}>{Children.map(children, child => typeof child === 'string' ? typography(child) : child)}</Tag>;
}
