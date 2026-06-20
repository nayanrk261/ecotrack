/**
 * @file Calculator.tsx
 * @description Orchestrates the 4-step carbon footprint calculation form flow.
 * Manages form state, input validation, scoring execution, and persists results.
 */

import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { useCalculator } from '../hooks/useCalculator';

import Step1Transport from '../components/calculator/Step1Transport';
import Step2Energy from '../components/calculator/Step2Energy';
import Step3Diet from '../components/calculator/Step3Diet';
import Step4Results from '../components/calculator/Step4Results';

export default function Calculator() {
  const { locale, t } = useLanguage();
  const {
    currentStep,
    saved,
    transport,
    setTransport,
    energy,
    setEnergy,
    diet,
    setDiet,
    result,
    handleNext,
    handleBack,
    handleSave,
    handleGetInsights,
    localizedSteps,
  } = useCalculator();

  return (
    <div className="page-wrapper">
      <div className="container calculator-container">
        <h1 className="page-title">
          {locale === 'en' ? 'Carbon Footprint ' : 'कार्बन '}<span className="text-gradient">{locale === 'en' ? 'Calculator' : 'कैलकुलेटर'}</span>
        </h1>
        <p className="page-subtitle">
          {t('calcSubtitle')}
        </p>

        {/* ===== Step Progress ===== */}
        <div className="step-progress">
          {localizedSteps.map((label, i) => (
            <div
              key={label}
              className={`step-progress-item ${
                i <= currentStep ? 'step-active' : ''
              } ${i < currentStep ? 'step-completed' : ''}`}
            >
              <div className="step-circle">
                {i < currentStep ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className="step-label">{label}</span>
            </div>
          ))}
          <div className="step-progress-bar">
            <div
              className="step-progress-fill"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* ===== Step Content ===== */}
        <div className="calculator-content">
          {currentStep === 0 && (
            <Step1Transport data={transport} onChange={setTransport} />
          )}
          {currentStep === 1 && (
            <Step2Energy data={energy} onChange={setEnergy} />
          )}
          {currentStep === 2 && (
            <Step3Diet data={diet} onChange={setDiet} />
          )}
          {currentStep === 3 && (
            <Step4Results
              result={result}
              saved={saved}
              onSave={handleSave}
              onGetInsights={handleGetInsights}
            />
          )}
        </div>

        {/* ===== Navigation Buttons ===== */}
        {currentStep < 3 && (
          <div className="calc-nav">
            <button
              className="btn btn-outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft size={18} />
              {t('back')}
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              {t('next')}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
        {currentStep === 3 && (
          <div className="calc-nav">
            <button className="btn btn-outline" onClick={handleBack}>
              <ArrowLeft size={18} />
              {t('back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

