import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Bike,
  Bus,
  TrainFront,
  Footprints,
  Plane,
  Zap,
  Flame,
  Users,
  Salad,
  ShoppingBag,
  Shirt,
  ArrowRight,
  ArrowLeft,
  Save,
  Sparkles,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';

import { useCarbon } from '../hooks/useCarbon';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getScoreEmoji, getScoreColor } from '../lib/carbonCalculations';
import { AVERAGES, DEFAULT_TRANSPORT, DEFAULT_ENERGY, DEFAULT_DIET } from '../lib/constants';
import type {
  CommuteMode,
  CookingFuel,
  DietType,
  CalculatorFormData,
  CarbonResult,
  TransportData,
  EnergyData,
  DietData,
} from '../types';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

  // ===== Commute mode options =====
  const commuteModes: { value: CommuteMode; label: string; icon: React.ReactNode }[] = [
    { value: 'car', label: locale === 'en' ? 'Car' : 'कार', icon: <Car size={20} /> },
    { value: 'bike', label: locale === 'en' ? 'Bike' : 'बाइक', icon: <Bike size={20} /> },
    { value: 'bus', label: locale === 'en' ? 'Bus' : 'बस', icon: <Bus size={20} /> },
    { value: 'train', label: locale === 'en' ? 'Train' : 'ट्रेन', icon: <TrainFront size={20} /> },
    { value: 'walk', label: locale === 'en' ? 'Walk' : 'पैदल', icon: <Footprints size={20} /> },
  ];

  const cookingFuels: { value: CookingFuel; label: string }[] = [
    { value: 'lpg', label: 'LPG' },
    { value: 'png', label: 'PNG' },
    { value: 'electric', label: locale === 'en' ? 'Electric' : 'बिजली' },
    { value: 'induction', label: locale === 'en' ? 'Induction' : 'इंडक्शन' },
  ];

  const dietTypes: { value: DietType; label: string; emoji: string }[] = [
    { value: 'vegan', label: locale === 'en' ? 'Vegan' : 'शाकाहारी (Vegan)', emoji: '🌱' },
    { value: 'vegetarian', label: locale === 'en' ? 'Vegetarian' : 'शुद्ध शाकाहारी', emoji: '🥬' },
    { value: 'eggetarian', label: locale === 'en' ? 'Eggetarian' : 'अंडाहारी', emoji: '🥚' },
    { value: 'non-veg', label: locale === 'en' ? 'Non-Veg' : 'मांसाहारी', emoji: '🍗' },
  ];

  // ===== Chart data =====
  const doughnutData = {
    labels: [t('transport'), t('energy'), t('diet'), t('lifestyle')],
    datasets: [
      {
        data: [
          result.breakdown.transport,
          result.breakdown.energy,
          result.breakdown.diet,
          result.breakdown.lifestyle,
        ],
        backgroundColor: ['#3b82f6', '#f97316', '#22c55e', '#a855f7'],
        borderColor: ['#2563eb', '#ea580c', '#16a34a', '#9333ea'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const barData = {
    labels: [
      locale === 'en' ? 'Your Footprint' : 'आपका फुटप्रिंट',
      locale === 'en' ? 'India Avg' : 'भारत औसत',
      locale === 'en' ? 'Global Avg' : 'वैश्विक औसत',
    ],
    datasets: [
      {
        label: locale === 'en' ? 'kg CO₂/month' : 'किग्रा CO₂/माह',
        data: [result.totalMonthly, AVERAGES.india.monthly, AVERAGES.global.monthly],
        backgroundColor: [getScoreColor(result.score), '#3b82f6', '#ef4444'],
        borderRadius: 8,
        borderSkipped: false as const,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#a1a1aa', font: { size: 12 } } },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: { ticks: { color: '#a1a1aa' }, grid: { color: '#1a1a1a' } },
      y: { ticks: { color: '#a1a1aa' }, grid: { color: '#1a1a1a' } },
    },
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
          {/* ----- Step 1: Transport ----- */}
          {currentStep === 0 && (
            <div className="calc-step fade-in">
              <h2 className="calc-step-title">
                <Car size={24} className="icon-green" />
                {t('transportHeader')}
              </h2>

              {/* Commute mode */}
              <div className="form-group">
                <label className="form-label">{locale === 'en' ? 'How do you commute daily?' : 'आप रोजाना कैसे यात्रा करते हैं?'}</label>
                <div className="radio-grid">
                  {commuteModes.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      className={`radio-card ${
                        transport.commuteMode === mode.value ? 'radio-card-selected' : ''
                      }`}
                      onClick={() =>
                        setTransport((p) => ({ ...p, commuteMode: mode.value }))
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
                  <span className="form-value">{transport.dailyDistance} km</span>
                </label>
                <input
                  id="daily-distance"
                  type="range"
                  min={0}
                  max={100}
                  value={transport.dailyDistance}
                  onChange={(e) =>
                    setTransport((p) => ({
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
                    value={transport.shortHaulFlights}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTransport((p) => ({
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
                    value={transport.longHaulFlights}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTransport((p) => ({
                        ...p,
                        longHaulFlights: val === '' ? '' : Number(val),
                      }));
                    }}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ----- Step 2: Energy ----- */}
          {currentStep === 1 && (
            <div className="calc-step fade-in">
              <h2 className="calc-step-title">
                <Zap size={24} className="icon-green" />
                {t('energyHeader')}
              </h2>

              {/* Electricity */}
              <div className="form-group">
                <label htmlFor="monthly-electricity" className="form-label">
                  {t('electricity')}
                  <span className="form-value">{energy.monthlyElectricity} kWh</span>
                </label>
                <input
                  id="monthly-electricity"
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={energy.monthlyElectricity}
                  onChange={(e) =>
                    setEnergy((p) => ({
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
                        energy.cookingFuel === fuel.value ? 'radio-card-selected' : ''
                      }`}
                      onClick={() =>
                        setEnergy((p) => ({ ...p, cookingFuel: fuel.value }))
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
                    {energy.householdSize} {locale === 'en' ? (energy.householdSize === 1 ? 'person' : 'people') : 'लोग'}
                  </span>
                </label>
                <input
                  id="household-size"
                  type="range"
                  min={1}
                  max={8}
                  value={energy.householdSize}
                  onChange={(e) =>
                    setEnergy((p) => ({
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
          )}

          {/* ----- Step 3: Diet & Lifestyle ----- */}
          {currentStep === 2 && (
            <div className="calc-step fade-in">
              <h2 className="calc-step-title">
                <Salad size={24} className="icon-green" />
                {t('dietHeader')}
              </h2>

              {/* Diet type */}
              <div className="form-group">
                <label className="form-label">{locale === 'en' ? 'What best describes your diet?' : 'आपके आहार का सबसे अच्छा वर्णन क्या है?'}</label>
                <div className="radio-grid radio-grid-4">
                  {dietTypes.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      className={`radio-card radio-card-diet ${
                        diet.dietType === d.value ? 'radio-card-selected' : ''
                      }`}
                      onClick={() =>
                        setDiet((p) => ({ ...p, dietType: d.value }))
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
                  <ShoppingBag size={16} className="icon-green" />
                  {t('onlineOrders')}
                  <span className="form-value">{diet.monthlyOnlineOrders}</span>
                </label>
                <input
                  id="online-orders"
                  type="range"
                  min={0}
                  max={30}
                  value={diet.monthlyOnlineOrders}
                  onChange={(e) =>
                    setDiet((p) => ({
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
                  <span className="form-value">{diet.newClothesPerMonth}</span>
                </label>
                <input
                  id="new-clothes"
                  type="range"
                  min={0}
                  max={20}
                  value={diet.newClothesPerMonth}
                  onChange={(e) =>
                    setDiet((p) => ({
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
          )}

          {/* ----- Step 4: Results ----- */}
          {currentStep === 3 && (
            <div className="calc-step fade-in">
              <h2 className="calc-step-title">
                <BarChart3 size={24} className="icon-green" />
                {t('yourResults')}
              </h2>

              {/* Total card */}
              <div className="result-total-card" style={{ borderColor: getScoreColor(result.score) }}>
                <div className="result-score-emoji">{getScoreEmoji(result.score)}</div>
                <div className="result-total-value">
                  {result.totalMonthly.toFixed(1)}
                  <span className="result-total-unit">{locale === 'en' ? 'kg CO₂/month' : 'किग्रा CO₂/माह'}</span>
                </div>
                <div className="result-annual">
                  {result.totalAnnual.toFixed(2)} {locale === 'en' ? 'tons/year' : 'टन/वर्ष'}
                </div>
                <div
                  className="result-score-badge"
                  style={{
                    backgroundColor: getScoreColor(result.score) + '20',
                    color: getScoreColor(result.score),
                    borderColor: getScoreColor(result.score) + '40',
                  }}
                >
                  {result.score}
                </div>
              </div>

              {/* Charts */}
              <div className="charts-grid">
                <div className="card">
                  <h3 className="card-title">{t('categoryBreakdown')}</h3>
                  <div className="chart-container">
                    <Doughnut data={doughnutData} options={chartOptions} />
                  </div>
                </div>
                <div className="card">
                  <h3 className="card-title">{locale === 'en' ? 'Comparison' : 'तुलना'}</h3>
                  <div className="chart-container">
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="result-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saved}
                >
                  <Save size={18} />
                  {saved ? (locale === 'en' ? 'Saved!' : 'सहेज लिया!') : t('saveResults')}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleGetInsights}
                >
                  <Sparkles size={18} />
                  {locale === 'en' ? 'Get AI Insights' : 'एआई इनसाइट्स प्राप्त करें'}
                </button>
              </div>
            </div>
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

