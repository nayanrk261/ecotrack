/**
 * @file Step1Transport.tsx
 * @description Renders step 1 (Transportation details) for the carbon calculator.
 */

import type React from 'react';
import { Car, Bike, Bus, TrainFront, Footprints, Plane } from 'lucide-react';
import type { Step1TransportProps, CommuteMode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export default function Step1Transport({ data, onChange }: Step1TransportProps) {
  const { locale, t } = useLanguage();

  const commuteModes: { value: CommuteMode; label: string; icon: React.ReactNode }[] = [
    { value: 'car', label: locale === 'en' ? 'Car' : 'कार', icon: <Car size={20} /> },
    { value: 'bike', label: locale === 'en' ? 'Bike' : 'बाइक', icon: <Bike size={20} /> },
    { value: 'bus', label: locale === 'en' ? 'Bus' : 'बस', icon: <Bus size={20} /> },
    { value: 'train', label: locale === 'en' ? 'Train' : 'ट्रेन', icon: <TrainFront size={20} /> },
    { value: 'walk', label: locale === 'en' ? 'Walk' : 'पैदल', icon: <Footprints size={20} /> },
  ];

  return (
    <div className="calc-step fade-in">
      <h2 className="calc-step-title">
        <Car size={24} className="icon-green" />
        {t('transportHeader')}
      </h2>

      {/* Commute mode */}
      <div className="form-group">
        <label className="form-label">
          {locale === 'en' ? 'How do you commute daily?' : 'आप रोजाना कैसे यात्रा करते हैं?'}
        </label>
        <div className="radio-grid">
          {commuteModes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              className={`radio-card ${
                data.commuteMode === mode.value ? 'radio-card-selected' : ''
              }`}
              onClick={() =>
                onChange((p) => ({ ...p, commuteMode: mode.value }))
              }
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily distance */}
      <div className="form-group">
        <label htmlFor="daily-distance" className="form-label">
          {t('dailyDistance')}
          <span className="form-value">{data.dailyDistance} km</span>
        </label>
        <input
          id="daily-distance"
          type="range"
          min={0}
          max={100}
          value={data.dailyDistance}
          onChange={(e) =>
            onChange((p) => ({
              ...p,
              dailyDistance: Number(e.target.value),
            }))
          }
          className="range-slider"
        />
        <div className="range-labels">
          <span>0 km</span>
          <span>100 km</span>
        </div>
      </div>

      {/* Flights */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="short-haul-flights" className="form-label">
            <Plane size={16} className="icon-green" />
            {t('shortFlights')}
          </label>
          <input
            id="short-haul-flights"
            type="number"
            min={0}
            max={50}
            value={data.shortHaulFlights}
            onChange={(e) => {
              const val = e.target.value;
              onChange((p) => ({
                ...p,
                shortHaulFlights: val === '' ? '' : Number(val),
              }));
            }}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="long-haul-flights" className="form-label">
            <Plane size={16} className="icon-green" />
            {t('longFlights')}
          </label>
          <input
            id="long-haul-flights"
            type="number"
            min={0}
            max={50}
            value={data.longHaulFlights}
            onChange={(e) => {
              const val = e.target.value;
              onChange((p) => ({
                ...p,
                longHaulFlights: val === '' ? '' : Number(val),
              }));
            }}
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
}
