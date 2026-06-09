import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calculator,
  ArrowLeft,
  Leaf,
} from 'lucide-react';

import { useCarbon } from '../hooks/useCarbon';
import type { InsightTip } from '../types';

/** Generate manual insights based on user's carbon data */
function generateInsights(
  breakdown: { transport: number; energy: number; diet: number; lifestyle: number },
  totalMonthly: number
): InsightTip[] {
  const tips: InsightTip[] = [];

  // Transport tips
  if (breakdown.transport > 80) {
    tips.push({
      title: 'Switch to Public Transport',
      description:
        'Your transport emissions are significant. Switching from a car to buses or trains for your daily commute can reduce emissions by up to 75%.',
      co2Savings: 624,
      difficulty: 'Medium',
      category: 'Transport',
      icon: '🚌',
    });
    tips.push({
      title: 'Try Carpooling',
      description:
        'Sharing rides with colleagues or neighbors splits emissions per person and saves fuel costs too.',
      co2Savings: 312,
      difficulty: 'Easy',
      category: 'Transport',
      icon: '🚗',
    });
  } else {
    tips.push({
      title: 'Keep Up the Green Commute',
      description:
        'Your transport footprint is already low — great job! Consider cycling for short trips to keep it even lower.',
      co2Savings: 180,
      difficulty: 'Easy',
      category: 'Transport',
      icon: '🚴',
    });
  }

  // Energy tips
  if (breakdown.energy > 100) {
    tips.push({
      title: 'Reduce Electricity Usage',
      description:
        'Your home energy usage is above average. Switch to LED bulbs, use 5-star rated appliances, and unplug standby devices to cut consumption.',
      co2Savings: 400,
      difficulty: 'Easy',
      category: 'Energy',
      icon: '💡',
    });
    tips.push({
      title: 'Consider Solar Panels',
      description:
        'Rooftop solar can offset a large portion of your electricity emissions and pays for itself in 4-6 years.',
      co2Savings: 1800,
      difficulty: 'Hard',
      category: 'Energy',
      icon: '☀️',
    });
  } else {
    tips.push({
      title: 'Optimize Standby Power',
      description:
        'Even with low usage, phantom power from devices on standby wastes up to 10% of household energy. Unplug when not in use.',
      co2Savings: 80,
      difficulty: 'Easy',
      category: 'Energy',
      icon: '🔌',
    });
  }

  // Diet tips
  if (breakdown.diet > 100) {
    tips.push({
      title: 'Reduce Meat Consumption',
      description:
        'Your diet has a higher carbon impact. Even reducing meat to 2-3 days a week can cut diet emissions by 30-40%.',
      co2Savings: 480,
      difficulty: 'Medium',
      category: 'Diet',
      icon: '🥬',
    });
    tips.push({
      title: 'Buy Local Produce',
      description:
        'Locally sourced food travels fewer miles and supports your local economy while reducing transport emissions.',
      co2Savings: 200,
      difficulty: 'Easy',
      category: 'Diet',
      icon: '🛒',
    });
  } else {
    tips.push({
      title: 'Reduce Food Waste',
      description:
        'Your diet footprint is good! Focus on planning meals and storing food properly to minimize waste.',
      co2Savings: 300,
      difficulty: 'Easy',
      category: 'Diet',
      icon: '🍽️',
    });
  }

  // Lifestyle tips
  if (breakdown.lifestyle > 15) {
    tips.push({
      title: 'Cut Online Orders',
      description:
        'Each delivery generates packaging waste and transport emissions. Try consolidating orders or shopping locally.',
      co2Savings: 60,
      difficulty: 'Easy',
      category: 'Shopping',
      icon: '📦',
    });
    tips.push({
      title: 'Buy Second-Hand Clothes',
      description:
        'Fast fashion is a major polluter. Thrift shopping extends garment life and avoids manufacturing emissions entirely.',
      co2Savings: 120,
      difficulty: 'Easy',
      category: 'Shopping',
      icon: '👗',
    });
  } else {
    tips.push({
      title: 'Repair, Don\'t Replace',
      description:
        'Your shopping footprint is low — nice! Keep extending the life of items by repairing electronics and clothes.',
      co2Savings: 90,
      difficulty: 'Easy',
      category: 'Shopping',
      icon: '🔧',
    });
  }

  // General tip based on total
  if (totalMonthly > 300) {
    tips.push({
      title: 'Plant Trees to Offset',
      description:
        'While reducing emissions is the priority, planting trees can help offset what you cannot yet eliminate. A single tree absorbs ~21 kg CO₂/year.',
      co2Savings: 21,
      difficulty: 'Easy',
      category: 'General',
      icon: '🌳',
    });
  } else {
    tips.push({
      title: 'Spread Awareness',
      description:
        'Your footprint is relatively low — lead by example! Share what you know with friends and family to multiply the impact.',
      co2Savings: 0,
      difficulty: 'Easy',
      category: 'General',
      icon: '📢',
    });
  }

  return tips;
}

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

  const tips: InsightTip[] = useMemo(() => {
    if (!latest) return [];
    return generateInsights(latest.result.breakdown, latest.result.totalMonthly);
  }, [latest]);

  // ===== No data state =====
  if (!latest) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">💡</div>
            <h2 className="empty-title">No Footprint Data</h2>
            <p className="empty-desc">
              Calculate your carbon footprint first to get personalized
              insights and recommendations.
            </p>
            <Link to="/calculator" className="btn btn-primary btn-lg">
              <Calculator size={20} />
              Calculate Now
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
          Personalized <span className="text-gradient">Insights</span>
        </h1>
        <p className="page-subtitle">
          Recommendations based on your{' '}
          {latest.result.totalMonthly.toFixed(1)} kg CO₂/month footprint
        </p>

        {/* ===== Summary Card ===== */}
        <div className="card insights-summary">
          <div className="insights-summary-inner">
            <Leaf size={24} className="icon-green" />
            <div>
              <p className="insights-summary-text">
                Based on your breakdown — <strong>{latest.result.breakdown.transport.toFixed(0)} kg</strong> transport,{' '}
                <strong>{latest.result.breakdown.energy.toFixed(0)} kg</strong> energy,{' '}
                <strong>{latest.result.breakdown.diet.toFixed(0)} kg</strong> diet,{' '}
                <strong>{latest.result.breakdown.lifestyle.toFixed(0)} kg</strong> lifestyle
                — here are your top recommendations:
              </p>
            </div>
          </div>
        </div>

        {/* ===== Tips ===== */}
        <div className="insights-grid">
          {tips.map((tip, i) => (
            <div key={i} className="card insight-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="insight-header">
                <span className="insight-emoji">{tip.icon}</span>
                <div className="insight-badges">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getDifficultyColor(tip.difficulty) + '20',
                      color: getDifficultyColor(tip.difficulty),
                      borderColor: getDifficultyColor(tip.difficulty) + '40',
                    }}
                  >
                    {tip.difficulty}
                  </span>
                  <span className="badge badge-category">{tip.category}</span>
                </div>
              </div>
              <h3 className="insight-title">{tip.title}</h3>
              <p className="insight-desc">{tip.description}</p>
              {tip.co2Savings > 0 && (
                <div className="insight-savings">
                  <span className="savings-badge">
                    🌿 Saves {tip.co2Savings} kg CO₂/year
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ===== Bottom Actions ===== */}
        <div className="insights-actions">
          <Link to="/calculator" className="btn btn-outline">
            <ArrowLeft size={18} />
            Recalculate
          </Link>
          <Link to="/actions" className="btn btn-primary">
            <Sparkles size={18} />
            View Green Actions
          </Link>
        </div>
      </div>
    </div>
  );
}
