/**
 * @file Calculator.tsx
 * @description Orchestrates the 4-step carbon footprint calculation form flow.
 * Manages form state, input validation, scoring execution, and persists results.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

import { useCarbon } from '../hooks/useCarbon';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_TRANSPORT, DEFAULT_ENERGY, DEFAULT_DIET } from '../lib/constants';
import type {
  CalculatorFormData,
  CarbonResult,
  TransportData,
  EnergyData,
  DietData,
} from '../types';

import Step1Transport from '../components/calculator/Step1Transport';
import Step2Energy from '../components/calculator/Step2Energy';
import Step3Diet from '../components/calculator/Step3Diet';
import Step4Results from '../components/calculator/Step4Results';

export default function Calculator() {
  const navigate = useNavigate();
  const { locale, t } = useLanguage();
  const { calculate, saveResult } = useCarbon();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const localizedSteps = useMemo(() => [
    t('stepTransport'),
    t('stepEnergy'),
    t('stepDiet'),
    t('stepResults')
  ], [t]);

  // Form state (allow empty inputs while typing)
  const [transport, setTransport] = useState<Omit<TransportData, 'shortHaulFlights' | 'longHaulFlights'> & { shortHaulFlights: number | ''; longHaulFlights: number | '' }>({
    ...DEFAULT_TRANSPORT
  });
  const [energy, setEnergy] = useState<EnergyData>({ ...DEFAULT_ENERGY });
  const [diet, setDiet] = useState<DietData>({ ...DEFAULT_DIET });

  const formData: CalculatorFormData = useMemo(
    () => ({
      transport: {
        ...transport,
        shortHaulFlights: transport.shortHaulFlights === '' ? 0 : transport.shortHaulFlights,
        longHaulFlights: transport.longHaulFlights === '' ? 0 : transport.longHaulFlights,
      },
      energy,
      diet,
    }),
    [transport, energy, diet]
  );

  const result: CarbonResult = useMemo(() => calculate(formData), [formData, calculate]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (transport.shortHaulFlights === '') {
        toast.error('Short-haul flights cannot be empty. Please enter a value (0 or more).');
        return;
      }
      if (transport.shortHaulFlights < 0) {
        toast.error('Short-haul flights cannot be negative.');
        return;
      }
      if (transport.longHaulFlights === '') {
        toast.error('Long-haul flights cannot be empty. Please enter a value (0 or more).');
        return;
      }
      if (transport.longHaulFlights < 0) {
        toast.error('Long-haul flights cannot be negative.');
        return;
      }
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSave = () => {
    saveResult(formData, result);
    setSaved(true);
    if (user) {
      toast.success('Results saved to your account!');
    } else {
      toast.success('Results saved to this device (Guest Mode)!');
    }
  };

  const handleGetInsights = () => {
    if (!saved) {
      saveResult(formData, result);
    }
    navigate('/insights');
  };

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
