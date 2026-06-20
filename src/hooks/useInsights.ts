import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCarbon } from './useCarbon';
import { useLanguage } from '../context/LanguageContext';
import { generateInsights } from '../lib/insights';
import type { SavedFootprint, InsightTip } from '../types';

export interface UseInsightsReturn {
  latest: SavedFootprint | null;
  tips: InsightTip[];
  handleShare: () => Promise<void>;
}

/**
 * Hook deriving insight tips from the user's latest carbon footprint result
 * and providing a native share / clipboard-copy handler.
 *
 * @returns A {@link UseInsightsReturn} object containing the latest footprint,
 * a list of generated {@link InsightTip} objects, and a `handleShare` callback.
 */
export function useInsights(): UseInsightsReturn {
  const { latest } = useCarbon();
  const { locale } = useLanguage();

  const tips: InsightTip[] = useMemo(() => {
    if (!latest) return [];
    return generateInsights(latest.result.breakdown, latest.result.totalMonthly);
  }, [latest]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(
          locale === 'en'
            ? 'Summary copied to clipboard!'
            : 'सारांश क्लिपबोर्ड पर कॉपी किया गया!'
        );
      })
      .catch(() => {
        toast.error(
          locale === 'en'
            ? 'Failed to copy to clipboard.'
            : 'क्लिपबोर्ड पर कॉपी करने में विफल।'
        );
      });
  };

  const handleShare = async () => {
    if (!latest) return;
    const footprint = latest.result.totalMonthly.toFixed(1);
    const topTip =
      tips.length > 0
        ? `"${tips[0].title}: ${tips[0].description}"`
        : 'Reduce your footprint!';
    const shareText = `My carbon footprint is ${footprint} kg CO₂/month! Top tip: ${topTip} Check your footprint on EcoTrack!`;
    const shareData = {
      title: 'My EcoTrack Carbon Footprint',
      text: shareText,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Results shared successfully!');
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  return {
    latest,
    tips,
    handleShare,
  };
}
