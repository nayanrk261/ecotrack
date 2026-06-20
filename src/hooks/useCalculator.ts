import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCarbon } from './useCarbon';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_TRANSPORT, DEFAULT_ENERGY, DEFAULT_DIET, ROUTES } from '../lib/constants';
import type {
  CalculatorFormData,
  CarbonResult,
  TransportData,
  EnergyData,
  DietData,
} from '../types';

export interface UseCalculatorReturn {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  saved: boolean;
  setSaved: React.Dispatch<React.SetStateAction<boolean>>;
  transport: Omit<TransportData, 'shortHaulFlights' | 'longHaulFlights'> & {
    shortHaulFlights: number | '';
    longHaulFlights: number | '';
  };
  setTransport: React.Dispatch<
    React.SetStateAction<
      Omit<TransportData, 'shortHaulFlights' | 'longHaulFlights'> & {
        shortHaulFlights: number | '';
        longHaulFlights: number | '';
      }
    >
  >;
  energy: EnergyData;
  setEnergy: React.Dispatch<React.SetStateAction<EnergyData>>;
  diet: DietData;
  setDiet: React.Dispatch<React.SetStateAction<DietData>>;
  formData: CalculatorFormData;
  result: CarbonResult;
  handleNext: () => void;
  handleBack: () => void;
  handleSave: () => void;
  handleGetInsights: () => void;
  localizedSteps: string[];
}

/**
 * Hook encapsulating all multi-step calculator logic.
 * Owns form state (transport, energy, diet) and step navigation, computes a
 * live {@link CarbonResult} via memoization, and handles save/navigate actions.
 *
 * @returns A {@link UseCalculatorReturn} object with form state, derived result,
 * navigation handlers, and step labels localized to the active language.
 */
export function useCalculator(): UseCalculatorReturn {
  const navigate = useNavigate();
  const { t } = useLanguage();
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

  const [transport, setTransport] = useState<
    Omit<TransportData, 'shortHaulFlights' | 'longHaulFlights'> & {
      shortHaulFlights: number | '';
      longHaulFlights: number | '';
    }
  >({
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
    navigate(ROUTES.insights);
  };

  return {
    currentStep,
    setCurrentStep,
    saved,
    setSaved,
    transport,
    setTransport,
    energy,
    setEnergy,
    diet,
    setDiet,
    formData,
    result,
    handleNext,
    handleBack,
    handleSave,
    handleGetInsights,
    localizedSteps,
  };
}
