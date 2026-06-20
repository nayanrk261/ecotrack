import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Filter, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

import { useCarbon } from '../hooks/useCarbon';
import { GREEN_ACTIONS } from '../lib/constants';
import ProgressBar from '../components/ProgressBar';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import type { ActionCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

const CATEGORIES: (ActionCategory | 'All')[] = [
  'All',
  'Transport',
  'Energy',
  'Diet',
  'Lifestyle',
];

export default function Actions() {
  const { completedActions, toggleAction } = useCarbon();
  const { locale, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ActionCategory | 'All'>('All');

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? GREEN_ACTIONS
        : GREEN_ACTIONS.filter((a) => a.category === activeCategory),
    [activeCategory]
  );

  const totalSaved = useMemo(
    () =>
      GREEN_ACTIONS.filter((a) => completedActions.includes(a.id)).reduce(
        (sum, a) => sum + a.co2Savings,
        0
      ),
    [completedActions]
  );

  const handleSelectCategory = (cat: ActionCategory | 'All') => {
    setActiveCategory(cat);
  };

  const handleToggle = (actionId: string) => {
    const action = GREEN_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    const wasCompleted = completedActions.includes(actionId);
    toggleAction(actionId);

    if (!wasCompleted) {
      toast.success(
        locale === 'en'
          ? `+${action.co2Savings} kg CO₂/year saved!`
          : `+${action.co2Savings} किग्रा CO₂/वर्ष की बचत सहेजी गई!`
      );

      // Check if category completed
      const categoryActions = GREEN_ACTIONS.filter(
        (a) => a.category === action.category
      );
      const completedInCategory = categoryActions.filter(
        (a) => a.id === actionId || completedActions.includes(a.id)
      );

      if (completedInCategory.length === categoryActions.length) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#4ade80', '#86efac', '#16a34a'],
        });
        const localizedCat = t(action.category.toLowerCase() as 'transport' | 'energy' | 'diet' | 'lifestyle');
        toast.success(
          locale === 'en'
            ? `🎉 ${action.category} category complete! Amazing work!`
            : `🎉 ${localizedCat} श्रेणी पूर्ण! अद्भुत कार्य!`,
          { duration: 4000 }
        );
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">
          {locale === 'en' ? 'Green ' : 'हरित '}<span className="text-gradient">{t('actions')}</span>
        </h1>
        <p className="page-subtitle">
          {t('actionsSubtitle')}
        </p>

        {/* ===== Overall Progress ===== */}
        <Card className="actions-summary">
          <div className="actions-summary-grid">
            <div className="summary-stat">
              <Trophy size={24} className="icon-green" />
              <div>
                <div className="summary-value">{completedActions.length}/{GREEN_ACTIONS.length}</div>
                <div className="summary-label">{t('completedCount')}</div>
              </div>
            </div>
            <div className="summary-stat">
              <Sparkles size={24} className="icon-green" />
              <div>
                <div className="summary-value">{totalSaved.toLocaleString()} kg</div>
                <div className="summary-label">{locale === 'en' ? 'CO₂ Saved/Year' : 'CO₂ वार्षिक बचत'}</div>
              </div>
            </div>
          </div>
          <ProgressBar
            current={completedActions.length}
            total={GREEN_ACTIONS.length}
            label={locale === 'en' ? 'Overall Progress' : 'कुल प्रगति'}
          />
        </Card>

        {/* ===== Category Filters ===== */}
        <div className="filter-tabs">
          <Filter size={16} className="filter-icon" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? 'filter-tab-active' : ''}`}
              onClick={() => handleSelectCategory(cat)}
            >
              {cat === 'All' ? (locale === 'en' ? 'All' : 'सभी') : t(cat.toLowerCase() as 'transport' | 'energy' | 'diet' | 'lifestyle')}
              {cat !== 'All' && (
                <span className="filter-count">
                  {GREEN_ACTIONS.filter(
                    (a) =>
                      a.category === cat && completedActions.includes(a.id)
                  ).length}
                  /{GREEN_ACTIONS.filter((a) => a.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===== Action Cards ===== */}
        <div className="actions-grid">
          {filtered.map((action) => {
            const isCompleted = completedActions.includes(action.id);
            return (
              <Card
                key={action.id}
                className={`action-card ${isCompleted ? 'action-card-completed' : ''}`}
                onClick={() => handleToggle(action.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleToggle(action.id);
                }}
              >
                <div className="action-card-header">
                  <div className="action-check">
                    {isCompleted ? (
                      <CheckCircle2 size={22} className="check-done" />
                    ) : (
                      <Circle size={22} className="check-pending" />
                    )}
                  </div>
                  <span className="action-emoji">{action.icon}</span>
                </div>
                <h3 className={`action-name ${isCompleted ? 'action-name-done' : ''}`}>
                  {action.name}
                </h3>
                <p className="action-desc">{action.description}</p>
                <div className="action-footer">
                  <span className="action-savings">
                    -{action.co2Savings} {locale === 'en' ? 'kg CO₂/yr' : 'किग्रा CO₂/वर्ष'}
                  </span>
                  <Badge className="action-category-tag">{t(action.category.toLowerCase() as 'transport' | 'energy' | 'diet' | 'lifestyle')}</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
