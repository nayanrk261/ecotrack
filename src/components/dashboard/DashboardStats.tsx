/**
 * @file DashboardStats.tsx
 * @description Renders the carbon score card and summary stats (monthly, annual, comparisons).
 */

import { BarChart3, CalendarDays, Leaf, Globe, TrendingDown, TrendingUp } from 'lucide-react';
import type { DashboardStatsProps } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../Card';
import { getScoreEmoji, getScoreColor } from '../../lib/carbonCalculations';

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const { locale, t } = useLanguage();

  return (
    <>
      {/* ===== Carbon Score Card ===== */}
      <div
        className="score-card"
        style={{ borderColor: getScoreColor(stats.score) + '40' }}
      >
        <div className="score-emoji">{getScoreEmoji(stats.score)}</div>
        <div className="score-info">
          <div
            className="score-badge"
            style={{
              backgroundColor: getScoreColor(stats.score) + '20',
              color: getScoreColor(stats.score),
            }}
          >
            {stats.score}
          </div>
          <p className="score-desc">
            {stats.score === 'Eco Warrior' &&
              (locale === 'en' ? 'Amazing! You are well below average. Keep it up!' : 'अद्भुत! आप औसत से काफी नीचे हैं। इसे जारी रखें!')}
            {stats.score === 'Green Learner' &&
              (locale === 'en' ? 'Good start! Small changes can make a big difference.' : 'अच्छी शुरुआत! छोटे बदलाव बड़ा अंतर ला सकते हैं।')}
            {stats.score === 'Average' &&
              (locale === 'en' ? 'Room for improvement. Check out our action plans!' : 'सुधार की गुंजाइश है। हमारे एक्शन प्लान देखें!')}
            {stats.score === 'Carbon Heavy' &&
              (locale === 'en' ? 'Your footprint is high. Let us help you reduce it.' : 'आपका कार्बन उत्सर्जन अधिक है। आइए हम इसे कम करने में आपकी सहायता करें।')}
          </p>
        </div>
      </div>

      {/* ===== Stat Cards ===== */}
      <div className="dashboard-stats-grid">
        <Card className="stat-card-dashboard">
          <div className="stat-card-icon">
            <BarChart3 size={20} />
          </div>
          <div className="stat-card-value">
            {stats.monthly.toFixed(1)}
            <span className="stat-card-unit">{locale === 'en' ? 'kg/mo' : 'किग्रा/माह'}</span>
          </div>
          <div className="stat-card-label">{t('monthly')}</div>
        </Card>

        <Card className="stat-card-dashboard">
          <div className="stat-card-icon">
            <CalendarDays size={20} />
          </div>
          <div className="stat-card-value">
            {stats.annual.toFixed(2)}
            <span className="stat-card-unit">{locale === 'en' ? 'tons/yr' : 'टन/वर्ष'}</span>
          </div>
          <div className="stat-card-label">{t('annual')}</div>
        </Card>

        <Card className="stat-card-dashboard">
          <div className="stat-card-icon">
            <Leaf size={20} />
          </div>
          <div className="stat-card-value">
            {stats.vsIndia > 0 ? '+' : ''}
            {stats.vsIndia}%
          </div>
          <div className="stat-card-label">{t('vsIndia')}</div>
          <div className={`stat-trend ${stats.vsIndia <= 0 ? 'trend-good' : 'trend-bad'}`}>
            {stats.vsIndia <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {stats.vsIndia <= 0 ? (locale === 'en' ? 'Below' : 'नीचे') : (locale === 'en' ? 'Above' : 'ऊपर')}
          </div>
        </Card>

        <Card className="stat-card-dashboard">
          <div className="stat-card-icon">
            <Globe size={20} />
          </div>
          <div className="stat-card-value">
            {stats.vsGlobal > 0 ? '+' : ''}
            {stats.vsGlobal}%
          </div>
          <div className="stat-card-label">{t('vsGlobal')}</div>
          <div className={`stat-trend ${stats.vsGlobal <= 0 ? 'trend-good' : 'trend-bad'}`}>
            {stats.vsGlobal <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {stats.vsGlobal <= 0 ? (locale === 'en' ? 'Below' : 'नीचे') : (locale === 'en' ? 'Above' : 'ऊपर')}
          </div>
        </Card>
      </div>
    </>
  );
}
