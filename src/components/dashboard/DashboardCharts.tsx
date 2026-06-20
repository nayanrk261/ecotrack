/**
 * @file DashboardCharts.tsx
 * @description Computes regression forecasts and renders visual charts for footprint history and breakdowns.
 */

import { useMemo } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { DashboardChartsProps } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { calculateTrendRegression } from '../../lib/trendAnalysis';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardCharts({ footprints }: DashboardChartsProps) {
  const { locale, t } = useLanguage();
  const latest = footprints[0];

  // Trend Regression Projection calculation
  const regressionResult = useMemo(() => {
    const last6 = footprints.slice(0, 6).reverse();
    const yValues = last6.map((f) => f.result.totalMonthly);
    return calculateTrendRegression(yValues);
  }, [footprints]);

  // Line chart – last 6 entries (reversed for chronological)
  const lineData = useMemo(() => {
    const last6 = footprints.slice(0, 6).reverse();
    const yValues = last6.map((f) => f.result.totalMonthly);
    const labels = last6.map((f) =>
      new Date(f.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      })
    );

    if (yValues.length >= 2) {
      labels.push(locale === 'en' ? 'Projected' : 'अनुमानित');
    }

    const datasets: {
      label: string;
      data: (number | null)[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
      pointBackgroundColor: string;
      pointBorderColor: string;
      pointBorderWidth: number;
      pointRadius: number;
      borderDash?: number[];
    }[] = [
      {
        label: locale === 'en' ? 'kg CO₂/month' : 'किग्रा CO₂/माह',
        data: yValues.length >= 2 ? [...yValues, null] : yValues,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ];

    if (yValues.length >= 2) {
      const regPoints = [
        ...yValues.map((_, idx) => regressionResult.slope * idx + regressionResult.intercept),
        regressionResult.projectedNext,
      ];
      datasets.push({
        label: locale === 'en' ? 'Projected Trend' : 'अनुमानित रुझान',
        data: regPoints,
        borderColor: '#a855f7',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.2,
        borderDash: [5, 5],
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      });
    }

    return {
      labels,
      datasets,
    };
  }, [footprints, regressionResult, locale]);

  // Doughnut chart
  const doughnutData = useMemo(() => {
    if (!latest) return null;
    return {
      labels: [t('transport'), t('energy'), t('diet'), t('lifestyle')],
      datasets: [
        {
          data: [
            latest.result.breakdown.transport,
            latest.result.breakdown.energy,
            latest.result.breakdown.diet,
            latest.result.breakdown.lifestyle,
          ],
          backgroundColor: ['#3b82f6', '#f97316', '#22c55e', '#a855f7'],
          borderColor: ['#2563eb', '#ea580c', '#16a34a', '#9333ea'],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  }, [latest, t]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#a1a1aa', font: { size: 12 } } },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      x: { ticks: { color: '#a1a1aa' }, grid: { color: '#1a1a1a' } },
      y: { ticks: { color: '#a1a1aa' }, grid: { color: '#1a1a1a' } },
    },
  };

  return (
    <div className="charts-grid">
      <div className="card">
        <h3 className="card-title">{t('monthlyTrend')}</h3>
        <div className="chart-container">
          {footprints.length > 1 ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <div className="chart-placeholder">
              <p>{locale === 'en' ? 'Save more calculations to see your trend line' : 'अपने रुझान को देखने के लिए और अधिक गणनाएँ सहेजें'}</p>
            </div>
          )}
        </div>
        {/* Linear Regression Trend Insight */}
        {footprints.length >= 2 && (
          <div className="mt-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-2">
            {regressionResult.isTrendingDown ? (
              <TrendingDown className="text-green-500 animate-pulse" size={18} />
            ) : (
              <TrendingUp className="text-red-500 animate-pulse" size={18} />
            )}
            <span className="text-sm font-semibold text-zinc-300">
              {locale === 'en'
                ? `Your footprint is trending ${regressionResult.isTrendingDown ? 'down' : 'up'} by ${regressionResult.absoluteSlope} kg/month.`
                : `आपका कार्बन फुटप्रिंट प्रति माह ${regressionResult.isTrendingDown ? 'कम' : 'अधिक'} (${regressionResult.absoluteSlope} किग्रा/माह) हो रहा है।`}
            </span>
          </div>
        )}
      </div>
      <div className="card">
        <h3 className="card-title">{t('categoryBreakdown')}</h3>
        <div className="chart-container">
          {doughnutData && <Doughnut data={doughnutData} options={chartOptions} />}
        </div>
      </div>
    </div>
  );
}
