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

const STEPS = ['Transport', 'Energy', 'Diet & Lifestyle', 'Results'];

export default function Calculator() {
  const navigate = useNavigate();
  const { calculate, saveResult } = useCarbon();
  const [currentStep, setCurrentStep] = useState(0);
  const [saved, setSaved] = useState(false);

  // Form state
  const [transport, setTransport] = useState<TransportData>({ ...DEFAULT_TRANSPORT });
  const [energy, setEnergy] = useState<EnergyData>({ ...DEFAULT_ENERGY });
  const [diet, setDiet] = useState<DietData>({ ...DEFAULT_DIET });

  const formData: CalculatorFormData = useMemo(
    () => ({ transport, energy, diet }),
    [transport, energy, diet]
  );

  const result: CarbonResult = useMemo(() => calculate(formData), [formData, calculate]);

  const handleNext = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSave = () => {
    saveResult(formData, result);
    setSaved(true);
    toast.success('Results saved successfully!');
  };

  const handleGetInsights = () => {
    if (!saved) {
      saveResult(formData, result);
    }
    navigate('/insights');
  };

  // ===== Commute mode options =====
  const commuteModes: { value: CommuteMode; label: string; icon: React.ReactNode }[] = [
    { value: 'car', label: 'Car', icon: <Car size={20} /> },
    { value: 'bike', label: 'Bike', icon: <Bike size={20} /> },
    { value: 'bus', label: 'Bus', icon: <Bus size={20} /> },
    { value: 'train', label: 'Train', icon: <TrainFront size={20} /> },
    { value: 'walk', label: 'Walk', icon: <Footprints size={20} /> },
  ];

  const cookingFuels: { value: CookingFuel; label: string }[] = [
    { value: 'lpg', label: 'LPG' },
    { value: 'png', label: 'PNG' },
    { value: 'electric', label: 'Electric' },
    { value: 'induction', label: 'Induction' },
  ];

  const dietTypes: { value: DietType; label: string; emoji: string }[] = [
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
    { value: 'eggetarian', label: 'Eggetarian', emoji: '🥚' },
    { value: 'non-veg', label: 'Non-Veg', emoji: '🍗' },
  ];

  // ===== Chart data =====
  const doughnutData = {
    labels: ['Transport', 'Energy', 'Diet', 'Lifestyle'],
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
    labels: ['Your Footprint', 'India Avg', 'Global Avg'],
    datasets: [
      {
        label: 'kg CO₂/month',
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
          Carbon Footprint <span className="text-gradient">Calculator</span>
        </h1>
        <p className="page-subtitle">
          Answer a few questions to estimate your monthly carbon emissions
        </p>

        {/* ===== Step Progress ===== */}
        <div className="step-progress">
          {STEPS.map((label, i) => (
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
                Transportation
              </h2>

              {/* Commute mode */}
              <div className="form-group">
                <label className="form-label">How do you commute daily?</label>
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
                <label className="form-label">
                  Daily commute distance (km)
                  <span className="form-value">{transport.dailyDistance} km</span>
                </label>
                <input
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
                  <label className="form-label">
                    <Plane size={16} className="icon-green" />
                    Short-haul flights/year
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={transport.shortHaulFlights}
                    onChange={(e) =>
                      setTransport((p) => ({
                        ...p,
                        shortHaulFlights: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Plane size={16} className="icon-green" />
                    Long-haul flights/year
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={transport.longHaulFlights}
                    onChange={(e) =>
                      setTransport((p) => ({
                        ...p,
                        longHaulFlights: Math.max(0, Number(e.target.value)),
                      }))
                    }
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
                Home Energy
              </h2>

              {/* Electricity */}
              <div className="form-group">
                <label className="form-label">
                  Monthly electricity consumption
                  <span className="form-value">{energy.monthlyElectricity} kWh</span>
                </label>
                <input
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
                  Cooking fuel
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
                <label className="form-label">
                  <Users size={16} className="icon-green" />
                  Household size
                  <span className="form-value">
                    {energy.householdSize} {energy.householdSize === 1 ? 'person' : 'people'}
                  </span>
                </label>
                <input
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
                Diet & Lifestyle
              </h2>

              {/* Diet type */}
              <div className="form-group">
                <label className="form-label">What best describes your diet?</label>
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
                <label className="form-label">
                  <ShoppingBag size={16} className="icon-green" />
                  Monthly online orders
                  <span className="form-value">{diet.monthlyOnlineOrders}</span>
                </label>
                <input
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
                <label className="form-label">
                  <Shirt size={16} className="icon-green" />
                  New clothes per month
                  <span className="form-value">{diet.newClothesPerMonth}</span>
                </label>
                <input
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
                Your Results
              </h2>

              {/* Total card */}
              <div className="result-total-card" style={{ borderColor: getScoreColor(result.score) }}>
                <div className="result-score-emoji">{getScoreEmoji(result.score)}</div>
                <div className="result-total-value">
                  {result.totalMonthly.toFixed(1)}
                  <span className="result-total-unit">kg CO₂/month</span>
                </div>
                <div className="result-annual">
                  {result.totalAnnual.toFixed(2)} tons/year
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
                  <h3 className="card-title">Category Breakdown</h3>
                  <div className="chart-container">
                    <Doughnut data={doughnutData} options={chartOptions} />
                  </div>
                </div>
                <div className="card">
                  <h3 className="card-title">Comparison</h3>
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
                  {saved ? 'Saved!' : 'Save Results'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleGetInsights}
                >
                  <Sparkles size={18} />
                  Get AI Insights
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
              Back
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              Next
              <ArrowRight size={18} />
            </button>
          </div>
        )}
        {currentStep === 3 && (
          <div className="calc-nav">
            <button className="btn btn-outline" onClick={handleBack}>
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

