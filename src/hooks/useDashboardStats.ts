import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCarbon } from './useCarbon';
import { useLanguage } from '../context/LanguageContext';
import { AVERAGES, COLORS, PDF_CONFIG } from '../lib/constants';
import type { SavedFootprint, CarbonScore } from '../types';

export interface DashboardDerivedStats {
  monthly: number;
  annual: number;
  score: CarbonScore;
  vsIndia: number;
  vsGlobal: number;
}

export interface UseDashboardStatsReturn {
  footprints: SavedFootprint[];
  latest: SavedFootprint | null;
  stats: DashboardDerivedStats | null;
  handleClearData: () => void;
  handleDownloadReport: () => Promise<void>;
}

/**
 * Hook deriving dashboard statistics from the user's footprint history and
 * providing report generation and data-clearing side effects.
 *
 * Computes monthly/annual totals and percentage comparisons against Indian
 * and global averages from the latest stored footprint entry.
 *
 * @returns A {@link UseDashboardStatsReturn} object containing the footprint list,
 * latest entry, derived stats, a clear-history handler, and a PDF download handler.
 */
export function useDashboardStats(): UseDashboardStatsReturn {
  const { footprints, clearHistory } = useCarbon();
  const { locale } = useLanguage();

  const latest = footprints[0];

  const stats = useMemo(() => {
    if (!latest) return null;
    const monthly = latest.result.totalMonthly;
    const annual = latest.result.totalAnnual;
    const score = latest.result.score;

    const vsIndia = Math.round(
      ((monthly - AVERAGES.india.monthly) / AVERAGES.india.monthly) * 100
    );
    const vsGlobal = Math.round(
      ((monthly - AVERAGES.global.monthly) / AVERAGES.global.monthly) * 100
    );

    return { monthly, annual, score, vsIndia, vsGlobal };
  }, [latest]);

  const handleClearData = () => {
    const confirmMsg =
      locale === 'en'
        ? 'Are you sure you want to delete all footprint history?'
        : 'क्या आप वाकई सभी फुटप्रिंट इतिहास को हटाना चाहते हैं?';
    if (window.confirm(confirmMsg)) {
      clearHistory();
      toast.success(
        locale === 'en'
          ? 'Data cleared successfully!'
          : 'डेटा सफलतापूर्वक हटा दिया गया!'
      );
    }
  };

  const handleDownloadReport = async () => {
    if (!latest || !stats) return;

    const loadingMsg =
      locale === 'en'
        ? 'Generating your PDF report...'
        : 'आपकी पीडीएफ रिपोर्ट बनाई जा रही है...';
    const toastId = toast.loading(loadingMsg);

    const element = document.getElementById('pdf-report-template');
    if (!element) {
      toast.dismiss(toastId);
      toast.error('Failed to locate PDF template.');
      return;
    }

    element.style.left = '0px';
    element.style.top = '0px';

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(element, {
        scale: PDF_CONFIG.scale,
        useCORS: true,
        backgroundColor: COLORS.bgDark,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = PDF_CONFIG.a4WidthMm;
      const pageHeight = PDF_CONFIG.a4HeightMm;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ecotrack-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.dismiss(toastId);
      toast.success(
        locale === 'en' ? 'Report downloaded!' : 'रिपोर्ट डाउनलोड हो गई!'
      );
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error(
        locale === 'en' ? 'Failed to generate PDF.' : 'पीडीएफ बनाने में विफल।'
      );
    } finally {
      element.style.left = PDF_CONFIG.hiddenOffset;
      element.style.top = PDF_CONFIG.hiddenOffset;
    }
  };

  return {
    footprints,
    latest,
    stats,
    handleClearData,
    handleDownloadReport,
  };
}
