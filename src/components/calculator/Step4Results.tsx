/**
 * @file Step4Results.tsx
 * @description Renders step 4 (Results breakdown and charts) for the carbon calculator.
 */

import { Doughnut, Bar } from 'react-chartjs-2';
import { Save, Sparkles, BarChart3 } from 'lucide-react';
import type { Step4ResultsProps } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getScoreEmoji, getScoreColor } from '../../lib/carbonCalculations';
import { AVERAGES } from '../../lib/constants';

export default function Step4Results({
  result,
  saved,
  onSave,
  onGetInsights,
}: Step4ResultsProps) {
  const { locale, t } = useLanguage();

  const doughnutData = {
    labels: [t('transport'), t('energy'), t('diet'), t('lifestyle')],
    datasets: [
      {
        data: [
          result.breakdown.transport,
          result.breakdown.energy,
          result.breakdown.diet,
          result.breakdown.lifestyle,
        ],
        backgroundColor: ['#3b82f6', '#f97316', '#22c55e', '#a855f7'],
        borderColor: ['#2563eb', '#ea580c', '#16a34a', '#9333ea'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const barData = {
    labels: [
      locale === 'en' ? 'Your Footprint' : 'आपका फुटप्रिंट',
      locale === 'en' ? 'India Avg' : 'भारत औसत',
      locale === 'en' ? 'Global Avg' : 'वैश्विक औसत',
    ],
    datasets: [
      {
        label: locale === 'en' ? 'kg CO₂/month' : 'किग्रा CO₂/माह',
        data: [result.totalMonthly, AVERAGES.india.monthly, AVERAGES.global.monthly],
        backgroundColor: [getScoreColor(result.score), '#3b82f6', '#ef4444'],
        borderRadius: 8,
        borderSkipped: false as const,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#a1a1aa', font: { size: 12 } } },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: { ticks: { color: '#a1a1aa' }, grid: { color: '#1a1a1a' } },
      y: { ticks: { color: '#a1a1aa' }, grid: { color: '#1a1a1a' } },
    },
  };

  return (
    <div className="calc-step fade-in">
      <h2 className="calc-step-title">
        <BarChart3 size={24} className="icon-green" />
        {t('yourResults')}
      </h2>

      {/* Total card */}
      <div className="result-total-card" style={{ borderColor: getScoreColor(result.score) }}>
        <div className="result-score-emoji">{getScoreEmoji(result.score)}</div>
        <div className="result-total-value">
          {result.totalMonthly.toFixed(1)}
          <span className="result-total-unit">{locale === 'en' ? 'kg CO₂/month' : 'किग्रा CO₂/माह'}</span>
        </div>
        <div className="result-annual">
          {result.totalAnnual.toFixed(2)} {locale === 'en' ? 'tons/year' : 'टन/वर्ष'}
        </div>
        <div
          className="result-score-badge"
          style={{
            backgroundColor: getScoreColor(result.score) + '20',
            color: getScoreColor(result.score),
            borderColor: getScoreColor(result.score) + '40',
          }}
        >
          {result.score}
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <h3 className="card-title">{t('categoryBreakdown')}</h3>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>
        <div className="card">
          <h3 className="card-title">{locale === 'en' ? 'Comparison' : 'तुलना'}</h3>
          <div className="chart-container">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="result-actions">
        <button
          className="btn btn-primary"
          onClick={onSave}
          disabled={saved}
        >
          <Save size={18} />
          {saved ? (locale === 'en' ? 'Saved!' : 'सहेज लिया!') : t('saveResults')}
        </button>
        <button
          className="btn btn-outline"
          onClick={onGetInsights}
        >
          <Sparkles size={18} />
          {locale === 'en' ? 'Get AI Insights' : 'एआई इनसाइट्स प्राप्त करें'}
        </button>
      </div>
    </div>
  );
}
