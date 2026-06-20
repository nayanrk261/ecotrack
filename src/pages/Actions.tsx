import { CheckCircle2, Circle, Filter, Trophy, Sparkles } from 'lucide-react';

import ProgressBar from '../components/ProgressBar';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useLanguage } from '../context/LanguageContext';
import { useActionsList } from '../hooks/useActionsList';
import { GREEN_ACTIONS, CATEGORY_NAMES } from '../lib/constants';

const CATEGORIES = [
  CATEGORY_NAMES.all,
  CATEGORY_NAMES.transport,
  CATEGORY_NAMES.energy,
  CATEGORY_NAMES.diet,
  CATEGORY_NAMES.lifestyle,
] as const;

export default function Actions() {
  const { locale, t } = useLanguage();
  const {
    activeCategory,
    setActiveCategory,
    filtered,
    totalSaved,
    handleToggle,
    completedActions,
  } = useActionsList();

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
              onClick={() => setActiveCategory(cat)}
            >
              {cat === CATEGORY_NAMES.all ? (locale === 'en' ? 'All' : 'सभी') : t(cat.toLowerCase() as 'transport' | 'energy' | 'diet' | 'lifestyle')}
              {cat !== CATEGORY_NAMES.all && (
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

