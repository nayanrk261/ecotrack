/**
 * @file ResourceCard.tsx
 * @description Renders a link card pointing to external environmental data platforms.
 */

import { ExternalLink } from 'lucide-react';
import type { ResourceCardProps } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export default function ResourceCard({ resource }: ResourceCardProps) {
  const { locale } = useLanguage();

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card resource-card"
    >
      <h3 className="resource-title">
        {locale === 'en' ? resource.title : resource.titleHi}
        <ExternalLink size={16} />
      </h3>
      <p className="resource-desc">
        {locale === 'en' ? resource.desc : resource.descHi}
      </p>
    </a>
  );
}
