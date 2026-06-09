import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Filter, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

import { useCarbon } from '../hooks/useCarbon';
import { GREEN_ACTIONS } from '../lib/constants';
import ProgressBar from '../components/ProgressBar';
import type { ActionCategory } from '../types';

const CATEGORIES: (ActionCategory | 'All')[] = [
  'All',
  'Transport',
  'Energy',
  'Diet',
  'Lifestyle',
];

export default function Actions() {
  const { completedActions, toggleAction } = useCarbon();
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

  const handleToggle = (actionId: string) => {
    const action = GREEN_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    const wasCompleted = completedActions.includes(actionId);
    toggleAction(actionId);

    if (!wasCompleted) {
      toast.success(`+${action.co2Savings} kg CO₂/year saved!`);

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
        toast.success(
          `🎉 ${action.category} category complete! Amazing work!`,
          { duration: 4000 }
        );
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">
          Green <span className="text-gradient">Actions</span>
        </h1>
        <p className="page-subtitle">
          Complete these actions to reduce your carbon footprint
        </p>

        {/* ===== Overall Progress ===== */}
        <div className="card actions-summary">
          <div className="actions-summary-grid">
            <div className="summary-stat">
              <Trophy size={24} className="icon-green" />
              <div>
                <div className="summary-value">{completedActions.length}/{GREEN_ACTIONS.length}</div>
                <div className="summary-label">Actions Completed</div>
              </div>
            </div>
            <div className="summary-stat">
              <Sparkles size={24} className="icon-green" />
              <div>
                <div className="summary-value">{totalSaved.toLocaleString()} kg</div>
                <div className="summary-label">CO₂ Saved/Year</div>
              </div>
            </div>
          </div>
          <ProgressBar
            current={completedActions.length}
            total={GREEN_ACTIONS.length}
            label="Overall Progress"
          />
        </div>

        {/* ===== Category Filters ===== */}
        <div className="filter-tabs">
          <Filter size={16} className="filter-icon" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? 'filter-tab-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
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
              <div
                key={action.id}
                className={`card action-card ${isCompleted ? 'action-card-completed' : ''}`}
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
                    -{action.co2Savings} kg CO₂/yr
                  </span>
                  <span className="action-category-tag">{action.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
