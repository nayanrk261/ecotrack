import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  BarChart3,
  Lightbulb,
  BookOpen,
  Zap,
  Shield,
  TrendingDown,
  ArrowRight,
  Leaf,
  TreePine,
} from 'lucide-react';

export default function Home() {
  const [co2Counter, setCo2Counter] = useState(422.04);

  // Animated CO₂ counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCo2Counter((prev) => {
        const newVal = prev + 0.0001;
        return Math.round(newVal * 10000) / 10000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrapper">
      {/* ===== Hero Section ===== */}
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="container hero-container">
          <div className="hero-badge">
            <Leaf size={14} />
            <span>Carbon Footprint Awareness Platform</span>
          </div>
          <h1 className="hero-title">
            Track Your{' '}
            <span className="text-gradient">Carbon Footprint</span>
          </h1>
          <p className="hero-subtitle">
            Understand your environmental impact, get personalized AI-powered
            insights, and take meaningful action to reduce your carbon emissions.
          </p>

          {/* CO₂ Counter */}
          <div className="co2-counter-card">
            <span className="co2-label">Atmospheric CO₂ (ppm)</span>
            <span className="co2-value">{co2Counter.toFixed(4)}</span>
            <span className="co2-sublabel">and rising every second…</span>
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <Link to="/calculator" className="btn btn-primary btn-lg">
              <Calculator size={20} />
              Calculate Now
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg">
              <BarChart3 size={20} />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Stats Section ===== */}
      <section className="section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-blue">🌍</div>
              <div className="stat-value">4.7<span className="stat-unit">tons</span></div>
              <div className="stat-label">Global Average Per Person/Year</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-green">🇮🇳</div>
              <div className="stat-value">1.9<span className="stat-unit">tons</span></div>
              <div className="stat-label">India Average Per Person/Year</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-emerald">
                <TreePine size={28} />
              </div>
              <div className="stat-value">7.4<span className="stat-unit">billion</span></div>
              <div className="stat-label">Trees Needed to Offset Global Emissions</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="section-subtitle">
            Three simple steps to understand and reduce your carbon footprint
          </p>

          <div className="steps-grid">
            {[
              {
                step: '01',
                icon: <Calculator size={28} />,
                title: 'Calculate',
                desc: 'Enter your transport, energy, diet, and lifestyle data into our comprehensive calculator.',
              },
              {
                step: '02',
                icon: <Lightbulb size={28} />,
                title: 'Analyze',
                desc: 'Get detailed breakdowns, charts, and AI-powered personalized insights about your impact.',
              },
              {
                step: '03',
                icon: <TrendingDown size={28} />,
                title: 'Reduce',
                desc: 'Follow actionable recommendations and track your progress towards a greener lifestyle.',
              },
            ].map((item) => (
              <div key={item.step} className="step-card">
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">
            Powerful <span className="text-gradient">Features</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to understand and minimize your environmental impact
          </p>

          <div className="features-grid">
            {[
              {
                icon: <Calculator size={24} />,
                title: 'Smart Calculator',
                desc: 'Comprehensive 4-step calculator covering transport, energy, diet, and lifestyle factors.',
              },
              {
                icon: <BarChart3 size={24} />,
                title: 'Visual Dashboard',
                desc: 'Beautiful charts and trends to track your carbon footprint over time.',
              },
              {
                icon: <Lightbulb size={24} />,
                title: 'AI Insights',
                desc: 'Personalized reduction tips powered by Google Gemini AI.',
              },
              {
                icon: <Zap size={24} />,
                title: 'Green Actions',
                desc: '20 actionable steps with real CO₂ savings data you can track.',
              },
              {
                icon: <BookOpen size={24} />,
                title: 'Learn & Educate',
                desc: 'Understand climate science with facts, charts, and curated resources.',
              },
              {
                icon: <Shield size={24} />,
                title: 'Private & Secure',
                desc: 'All data stays in your browser. No account needed, no data shared.',
              },
            ].map((feature) => (
              <div key={feature.title} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
                <div className="feature-arrow">
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow" />
            <h2 className="cta-title">
              Ready to Make a <span className="text-gradient">Difference</span>?
            </h2>
            <p className="cta-subtitle">
              Start by calculating your carbon footprint. It only takes 2 minutes.
            </p>
            <Link to="/calculator" className="btn btn-primary btn-lg">
              <Calculator size={20} />
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
