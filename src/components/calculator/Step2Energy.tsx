/**
 * @file Step2Energy.tsx
 * @description Renders step 2 (Home Energy consumption) for the carbon calculator.
 */

import { Zap, Flame, Users } from 'lucide-react';
import type { Step2EnergyProps, CookingFuel } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export default function Step2Energy({ data, onChange }: Step2EnergyProps) {
  const { locale, t } = useLanguage();

  const cookingFuels: { value: CookingFuel; label: string }[] = [
    { value: 'lpg', label: 'LPG' },
    { value: 'png', label: 'PNG' },
    { value: 'electric', label: locale === 'en' ? 'Electric' : 'बिजली' },
    { value: 'induction', label: locale === 'en' ? 'Induction' : 'इंडक्शन' },
  ];

  return (
    <div className="calc-step fade-in">
      <h2 className="calc-step-title">
        <Zap size={24} className="icon-green" />
        {t('energyHeader')}
      </h2>

      {/* Electricity */}
      <div className="form-group">
        <label htmlFor="monthly-electricity" className="form-label">
          {t('electricity')}
          <span className="form-value">{data.monthlyElectricity} kWh</span>
        </label>
        <input
          id="monthly-electricity"
          type="range"
          min={0}
          max={1000}
          step={10}
          value={data.monthlyElectricity}
          onChange={(e) =>
            onChange((p) => ({
              ...p,
              monthlyElectricity: Number(e.target.value),
            }))
          }
          className="range-slider"
        />
        <div className="range-labels">
          <span>0 kWh</span>
          <span>1000 kWh</span>
        </div>
      </div>

      {/* Cooking fuel */}
      <div className="form-group">
        <label className="form-label">
          <Flame size={16} className="icon-green" />
          {t('cookingFuel')}
        </label>
        <div className="radio-grid radio-grid-4">
          {cookingFuels.map((fuel) => (
            <button
              key={fuel.value}
              type="button"
              className={`radio-card ${
                data.cookingFuel === fuel.value ? 'radio-card-selected' : ''
              }`}
              onClick={() =>
                onChange((p) => ({ ...p, cookingFuel: fuel.value }))
              }
            >
              <span>{fuel.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Household size */}
      <div className="form-group">
        <label htmlFor="household-size" className="form-label">
          <Users size={16} className="icon-green" />
          {t('householdSize')}
          <span className="form-value">
            {data.householdSize} {locale === 'en' ? (data.householdSize === 1 ? 'person' : 'people') : 'लोग'}
          </span>
        </label>
        <input
          id="household-size"
          type="range"
          min={1}
          max={8}
          value={data.householdSize}
          onChange={(e) =>
            onChange((p) => ({
              ...p,
              householdSize: Number(e.target.value),
            }))
          }
          className="range-slider"
        />
        <div className="range-labels">
          <span>1</span>
          <span>8</span>
        </div>
      </div>
    </div>
  );
}
