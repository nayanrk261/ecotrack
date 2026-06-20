/**
 * @file DashboardHistory.tsx
 * @description Renders the saved carbon calculation logs in a readable history log grid.
 */

import type { DashboardHistoryProps } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getScoreColor, getScoreEmoji } from '../../lib/carbonCalculations';
import { Card } from '../Card';

export default function DashboardHistory({ footprints }: Omit<DashboardHistoryProps, 'onDelete'>) {
  const { locale, t } = useLanguage();

  return (
    <Card>
      <h3 className="card-title">{t('recentHistory')}</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>{locale === 'en' ? 'Date' : 'दिनांक'}</th>
              <th>{locale === 'en' ? 'Monthly (kg)' : 'मासिक (किग्रा)'}</th>
              <th>{locale === 'en' ? 'Annual (tons)' : 'वार्षिक (टन)'}</th>
              <th>{locale === 'en' ? 'Score' : 'स्कोर'}</th>
            </tr>
          </thead>
          <tbody>
            {footprints.slice(0, 5).map((f) => (
              <tr key={f.id}>
                <td>
                  {new Date(f.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td>{f.result.totalMonthly.toFixed(1)}</td>
                <td>{f.result.totalAnnual.toFixed(2)}</td>
                <td>
                  <span
                    className="table-badge"
                    style={{
                      backgroundColor: getScoreColor(f.result.score) + '20',
                      color: getScoreColor(f.result.score),
                    }}
                  >
                    {getScoreEmoji(f.result.score)} {f.result.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
