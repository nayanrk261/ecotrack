/**
 * @file Badge.tsx
 * @description Standardized badge label tag component to display categories and scoring highlights consistently.
 * Wraps elements in a .badge class container with customizable classes and inline styles.
 */

import type { BadgeProps } from '../types';

export function Badge({
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span className={`badge ${className}`} {...props}>
      {children}
    </span>
  );
}
