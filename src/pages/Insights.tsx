import { Link } from 'react-router-dom';
import { Sparkles, Calculator, ArrowLeft, Leaf, Share2 } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { useInsights } from '../hooks/useInsights';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ROUTES, COLORS } from '../lib/constants';

export default function Insights() {
  const { locale, t } = useLanguage();
  const { latest, tips, handleShare } = useInsights();

  // ===== No data state =====
  if (!latest) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">💡</div>
            <h2 className="empty-title">{locale === 'en' ? 'No Footprint Data' : 'कोई फुटप्रिंट डेटा नहीं है'}</h2>
            <p className="empty-desc">
              {t('noDataDesc')}
            </p>
            <Link to={ROUTES.calculator} className="btn btn-primary btn-lg text-decoration-none">
              <Calculator size={20} />
              {t('calcFootprintBtn')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">
          <Sparkles size={32} className="icon-green" />
          {locale === 'en' ? 'Personalized ' : 'व्यक्तिगत '}<span className="text-gradient">{t('insights')}</span>
        </h1>
        <p className="page-subtitle">
          {locale === 'en'
            ? `Recommendations based on your ${latest.result.totalMonthly.toFixed(1)} kg CO₂/month footprint`
            : `आपके ${latest.result.totalMonthly.toFixed(1)} किग्रा CO₂/माह फुटप्रिंट पर आधारित सिफारिशें`}
        </p>

        {/* ===== Summary Card ===== */}
        <Card className="insights-summary">
          <div className="insights-summary-inner">
            <Leaf size={24} className="icon-green" />
            <div>
              {locale === 'en' ? (
                <p className="insights-summary-text">
                  Based on your breakdown — <strong>{latest.result.breakdown.transport.toFixed(0)} kg</strong> transport,{' '}
                  <strong>{latest.result.breakdown.energy.toFixed(0)} kg</strong> energy,{' '}
                  <strong>{latest.result.breakdown.diet.toFixed(0)} kg</strong> diet,{' '}
                  <strong>{latest.result.breakdown.lifestyle.toFixed(0)} kg</strong> lifestyle
                  — here are your top recommendations:
                </p>
              ) : (
                <p className="insights-summary-text">
                  आपके विवरण के आधार पर — <strong>{latest.result.breakdown.transport.toFixed(0)} किग्रा</strong> परिवहन,{' '}
                  <strong>{latest.result.breakdown.energy.toFixed(0)} किग्रा</strong> ऊर्जा,{' '}
                  <strong>{latest.result.breakdown.diet.toFixed(0)} किग्रा</strong> आहार,{' '}
                  <strong>{latest.result.breakdown.lifestyle.toFixed(0)} किग्रा</strong> जीवन शैली
                  — यहाँ आपकी शीर्ष सिफारिशें हैं:
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* ===== Tips ===== */}
        <div className="insights-grid">
          {tips.map((tip, i) => (
            <Card key={i} className="insight-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="insight-header">
                <span className="insight-emoji">{tip.icon}</span>
                <div className="insight-badges">
                  <Badge
                    style={{
                      backgroundColor: getDifficultyColor(tip.difficulty) + '20',
                      color: getDifficultyColor(tip.difficulty),
                      borderColor: getDifficultyColor(tip.difficulty) + '40',
                    }}
                  >
                    {tip.difficulty === 'Easy' ? (locale === 'en' ? 'Easy' : 'आसान') : tip.difficulty === 'Medium' ? (locale === 'en' ? 'Medium' : 'मध्यम') : (locale === 'en' ? 'Hard' : 'कठिन')}
                  </Badge>
                  <Badge className="badge-category">{t(tip.category.toLowerCase() as 'transport' | 'energy' | 'diet' | 'lifestyle' | 'shopping' | 'general')}</Badge>
                </div>
              </div>
              <h3 className="insight-title">{tip.title}</h3>
              <p className="insight-desc">{tip.description}</p>
              {tip.co2Savings > 0 && (
                <div className="insight-savings">
                  <span className="savings-badge">
                    🌿 {locale === 'en' ? `Saves ${tip.co2Savings} kg CO₂/year` : `बचत: ${tip.co2Savings} किग्रा CO₂/वर्ष`}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* ===== Bottom Actions ===== */}
        <div className="insights-actions">
          <Link to={ROUTES.calculator} className="btn btn-outline text-decoration-none">
            <ArrowLeft size={18} />
            {locale === 'en' ? 'Recalculate' : 'पुनः मापें'}
          </Link>
          <button onClick={handleShare} className="btn btn-outline flex items-center gap-2 cursor-pointer">
            <Share2 size={18} />
            {t('shareResults')}
          </button>
          <Link to={ROUTES.actions} className="btn btn-primary text-decoration-none">
            <Sparkles size={18} />
            {locale === 'en' ? 'View Green Actions' : 'हरित एक्शन्स देखें'}
          </Link>
        </div>
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy':
      return COLORS.successGreen;
    case 'Medium':
      return COLORS.warningYellow;
    case 'Hard':
      return COLORS.dangerRed;
    default:
      return COLORS.textMuted;
  }
}

