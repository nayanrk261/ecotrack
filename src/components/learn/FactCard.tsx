/**
 * @file FactCard.tsx
 * @description Renders a fact card displaying climate figures with an animated count-up trigger upon page scrolling intersection.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { FactCardProps } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const getLocalizedFactLabel = (label: string, locale: string) => {
  if (locale === 'en') return label;
  switch (label) {
    case 'Global CO₂ emissions annually': return 'वार्षिक वैश्विक CO₂ उत्सर्जन';
    case 'Average global carbon footprint per person/year': return 'प्रति व्यक्ति/वर्ष औसत वैश्विक carbon footprint';
    case 'Average Indian carbon footprint per person/year': return 'प्रति व्यक्ति/वर्ष औसत भारतीय carbon footprint';
    case 'Year by which we need Net Zero emissions': return 'वर्ष जब तक हमें नेट ज़ीरो उत्सर्जन की आवश्यकता है';
    case 'Maximum warming target under Paris Agreement': return 'पेरिस समझौते के तहत अधिकतम ग्लोबल वार्मिंग लक्ष्य';
    default: return label;
  }
};

/** Animated counter hook */
function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let frame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(parseFloat((progress * target).toFixed(1)));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return value;
}

export default function FactCard({ fact }: FactCardProps) {
  const { locale } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const animatedValue = useCountUp(fact.value, 1500, visible);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });
    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [handleIntersection]);

  const suffixText = locale === 'hi' && fact.suffix.includes('tons') ? ' टन' : fact.suffix;

  return (
    <div ref={ref} className="card fact-card">
      <span className="fact-emoji">{fact.icon}</span>
      <div className="fact-value">
        {fact.value >= 100
          ? Math.round(animatedValue)
          : animatedValue.toFixed(1)}
        {suffixText}
      </div>
      <p className="fact-label">{getLocalizedFactLabel(fact.label, locale)}</p>
    </div>
  );
}
