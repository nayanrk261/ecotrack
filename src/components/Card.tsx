/**
 * @file Card.tsx
 * @description Standardized card container component for structured layout elements across the app.
 * Provides a unified .card styled wrapper with support for custom classes, accessibility props, and click events.
 */

import type { CardProps } from '../types';

export function Card({
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}
