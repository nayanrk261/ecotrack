/**
 * @file Step3Diet.tsx
 * @description Renders step 3 (Diet & Lifestyle choices) for the carbon calculator.
 */

import { Salad, Shirt } from 'lucide-react';
import type { Step3DietProps, DietType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export default function Step3Diet({ data, onChange }: Step3DietProps) {
  const { locale, t } = useLanguage();

  const dietTypes: { value: DietType; label: string; emoji: string }[] = [
    { value: 'vegan', label: locale === 'en' ? 'Vegan' : 'शाकाहारी (Vegan)', emoji: '🌱' },
    { value: 'vegetarian', label: locale === 'en' ? 'Vegetarian' : 'शुद्ध शाकाहारी', emoji: '🥬' },
    { value: 'eggetarian', label: locale === 'en' ? 'Eggetarian' : 'अंडाहारी', emoji: '🥚' },
    { value: 'non-veg', label: locale === 'en' ? 'Non-Veg' : 'मांसाहारी', emoji: '🍗' },
  ];

  return (
    <div className="calc-step fade-in">
      <h2 className="calc-step-title">
        <Salad size={24} className="icon-green" />
        {t('dietHeader')}
      </h2>

      {/* Diet type */}
      <div className="form-group">
        <label className="form-label">
          {locale === 'en' ? 'What best describes your diet?' : 'आपके आहार का सबसे अच्छा वर्णन क्या है?'}
        </label>
        <div className="radio-grid radio-grid-4">
          {dietTypes.map((d) => (
            <button
              key={d.value}
              type="button"
              className={`radio-card radio-card-diet ${
                data.dietType === d.value ? 'radio-card-selected' : ''
              }`}
              onClick={() =>
                onChange((p) => ({ ...p, dietType: d.value }))
              }
            >
              <span className="diet-emoji">{d.emoji}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Online orders */}
      <div className="form-group">
        <label htmlFor="online-orders" className="form-label">
          {t('onlineOrders')}
          <span className="form-value">{data.monthlyOnlineOrders}</span>
        </label>
        <input
          id="online-orders"
          type="range"
          min={0}
          max={30}
          value={data.monthlyOnlineOrders}
          onChange={(e) =>
            onChange((p) => ({
              ...p,
              monthlyOnlineOrders: Number(e.target.value),
            }))
          }
          className="range-slider"
        />
        <div className="range-labels">
          <span>0</span>
          <span>30</span>
        </div>
      </div>

      {/* New clothes */}
      <div className="form-group">
        <label htmlFor="new-clothes" className="form-label">
          <Shirt size={16} className="icon-green" />
          {t('newClothes')}
          <span className="form-value">{data.newClothesPerMonth}</span>
        </label>
        <input
          id="new-clothes"
          type="range"
          min={0}
          max={20}
          value={data.newClothesPerMonth}
          onChange={(e) =>
            onChange((p) => ({
              ...p,
              newClothesPerMonth: Number(e.target.value),
            }))
          }
          className="range-slider"
        />
        <div className="range-labels">
          <span>0</span>
          <span>20</span>
        </div>
      </div>
    </div>
  );
}
