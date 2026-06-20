import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calculator,
  ArrowLeft,
  Leaf,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useCarbon } from '../hooks/useCarbon';
import type { InsightTip } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { generateInsights } from '../lib/insights';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy':
      return '#22c55e';
    case 'Medium':
      return '#eab308';
    case 'Hard':
      return '#ef4444';
    default:
      return '#a1a1aa';
  }
};

export default function Insights() {
  const { latest } = useCarbon();
  const { locale, t } = useLanguage();

  const tips: InsightTip[] = useMemo(() => {
    if (!latest) return [];
    return generateInsights(latest.result.breakdown, latest.result.totalMonthly);
  }, [latest]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(locale === 'en' ? 'Summary copied to clipboard!' : 'सारांश क्लिपबोर्ड पर कॉपी किया गया!');
      })
      .catch(() => {
        toast.error(locale === 'en' ? 'Failed to copy to clipboard.' : 'क्लिपबोर्ड पर कॉपी करने में विफल।');
      });
  };

  const handleShare = async () => {
    if (!latest) return;
    const footprint = latest.result.totalMonthly.toFixed(1);
    const topTip = tips.length > 0 ? `"${tips[0].title}: ${tips[0].description}"` : 'Reduce your footprint!';
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
            <Link to="/calculator" className="btn btn-primary btn-lg text-decoration-none">
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
          <Link to="/calculator" className="btn btn-outline text-decoration-none">
            <ArrowLeft size={18} />
            {locale === 'en' ? 'Recalculate' : 'पुनः मापें'}
          </Link>
          <button onClick={handleShare} className="btn btn-outline flex items-center gap-2 cursor-pointer">
            <Share2 size={18} />
            {t('shareResults')}
          </button>
          <Link to="/actions" className="btn btn-primary text-decoration-none">
            <Sparkles size={18} />
            {locale === 'en' ? 'View Green Actions' : 'हरित एक्शन्स देखें'}
          </Link>
        </div>
      </div>
    </div>
  );
}
