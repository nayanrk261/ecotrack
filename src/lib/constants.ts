/**
 * @file constants.ts
 * @description Central store for emission factors, averages, score thresholds, seed lists, and configuration settings.
 */

import type { GreenAction, EmissionSource, QuickTip, KeyFact } from '../types';

// ===== Emission Factors =====
export const EMISSION_FACTORS = {
  transport: {
    car: 0.21,      // kg CO2/km
    bike: 0.11,     // kg CO2/km
    bus: 0.089,     // kg CO2/km
    train: 0.041,   // kg CO2/km
    walk: 0,        // kg CO2/km
  },
  flights: {
    shortHaul: 255,  // kg CO2 per flight
    longHaul: 1620,  // kg CO2 per flight (annualized, divide by 12 for monthly)
  },
  energy: {
    electricity: 0.82,  // kg CO2 per kWh
    lpg: 35.76,         // kg CO2/month (12kg cylinder × 2.98)
    png: 40.8,          // kg CO2/month (20 m³ × 2.04)
    electric: 0,        // already in electricity
    induction: 0,       // already in electricity
  },
  diet: {
    vegan: 50,       // kg CO2/month
    vegetarian: 85,  // kg CO2/month
    eggetarian: 102, // kg CO2/month
    'non-veg': 140,  // kg CO2/month
  },
  lifestyle: {
    onlineOrder: 0.5,  // kg CO2 per order
    newClothes: 5,     // kg CO2 per item
  },
} as const;

// ===== Carbon Score Thresholds (monthly kg CO2) =====
export const SCORE_THRESHOLDS = {
  ecoWarrior: 150,    // < 150 kg/month
  greenLearner: 300,  // 150-300 kg/month
  average: 500,       // 300-500 kg/month
  // > 500 is Carbon Heavy
} as const;

// ===== Averages =====
export const AVERAGES = {
  india: {
    monthly: 158,    // 1.9 tons/year ÷ 12
    annual: 1.9,     // tons/year
  },
  global: {
    monthly: 392,    // 4.7 tons/year ÷ 12
    annual: 4.7,     // tons/year
  },
} as const;

// ===== Default Form Values =====
export const DEFAULT_TRANSPORT = {
  commuteMode: 'car' as const,
  dailyDistance: 10,
  shortHaulFlights: 0,
  longHaulFlights: 0,
};

export const DEFAULT_ENERGY = {
  monthlyElectricity: 150,
  cookingFuel: 'lpg' as const,
  householdSize: 4,
};

export const DEFAULT_DIET = {
  dietType: 'vegetarian' as const,
  monthlyOnlineOrders: 5,
  newClothesPerMonth: 2,
};

// ===== Green Actions =====
export const GREEN_ACTIONS: GreenAction[] = [
  // Transport
  { id: 't1', name: 'Switch to public transport', description: 'Use buses, metros, and trains for your daily commute instead of driving alone.', co2Savings: 624, category: 'Transport', icon: '🚌' },
  { id: 't2', name: 'Carpool regularly', description: 'Share rides with colleagues or neighbors to cut emissions per person.', co2Savings: 312, category: 'Transport', icon: '🚗' },
  { id: 't3', name: 'Cycle for short trips', description: 'Use a bicycle for distances under 5km — great for health and the planet.', co2Savings: 180, category: 'Transport', icon: '🚴' },
  { id: 't4', name: 'Work from home 2 days/week', description: 'Reduce commute emissions by working remotely part of the week.', co2Savings: 240, category: 'Transport', icon: '🏠' },
  { id: 't5', name: 'Switch to an EV', description: 'Electric vehicles produce zero direct emissions and are increasingly affordable.', co2Savings: 1200, category: 'Transport', icon: '⚡' },
  // Energy
  { id: 'e1', name: 'Switch to LED bulbs', description: 'LED bulbs use 75% less energy than incandescent and last 25 times longer.', co2Savings: 150, category: 'Energy', icon: '💡' },
  { id: 'e2', name: 'Install solar panels', description: 'Generate clean energy at home and reduce dependence on the grid.', co2Savings: 1800, category: 'Energy', icon: '☀️' },
  { id: 'e3', name: 'Use 5-star rated AC', description: 'Energy-efficient air conditioners significantly reduce electricity consumption.', co2Savings: 360, category: 'Energy', icon: '❄️' },
  { id: 'e4', name: 'Unplug standby devices', description: 'Phantom power from standby devices wastes up to 10% of household energy.', co2Savings: 80, category: 'Energy', icon: '🔌' },
  { id: 'e5', name: 'Insulate your home', description: 'Proper insulation reduces heating and cooling energy needs substantially.', co2Savings: 400, category: 'Energy', icon: '🏗️' },
  // Diet
  { id: 'd1', name: 'Go vegetarian', description: 'A plant-based diet has one of the biggest impacts on reducing your footprint.', co2Savings: 660, category: 'Diet', icon: '🥬' },
  { id: 'd2', name: 'Reduce beef consumption', description: 'Beef production is the most carbon-intensive food — even small cuts help.', co2Savings: 480, category: 'Diet', icon: '🥩' },
  { id: 'd3', name: 'Buy local produce', description: 'Locally grown food travels less distance and supports your community.', co2Savings: 200, category: 'Diet', icon: '🛒' },
  { id: 'd4', name: 'Reduce food waste', description: 'Plan meals and store food properly to avoid throwing away edibles.', co2Savings: 300, category: 'Diet', icon: '🍽️' },
  { id: 'd5', name: 'Grow your own vegetables', description: 'Home gardens eliminate transport emissions and packaging waste entirely.', co2Savings: 100, category: 'Diet', icon: '🌱' },
  // Lifestyle
  { id: 'l1', name: 'Buy second-hand clothes', description: 'Thrift shopping extends garment life and avoids manufacturing emissions.', co2Savings: 120, category: 'Lifestyle', icon: '👗' },
  { id: 'l2', name: 'Repair, don\'t replace', description: 'Fix electronics and appliances instead of buying new ones.', co2Savings: 90, category: 'Lifestyle', icon: '🔧' },
  { id: 'l3', name: 'Reduce online orders', description: 'Consolidate orders and shop locally to cut delivery emissions.', co2Savings: 60, category: 'Lifestyle', icon: '📦' },
  { id: 'l4', name: 'Use paper bags over plastic', description: 'Carry reusable bags and choose paper alternatives when possible.', co2Savings: 40, category: 'Lifestyle', icon: '🛍️' },
  { id: 'l5', name: 'Plant a tree', description: 'A single tree absorbs ~21 kg CO₂ per year and improves air quality.', co2Savings: 21, category: 'Lifestyle', icon: '🌳' },
];

// ===== Learn Page Data =====
export const KEY_FACTS: KeyFact[] = [
  { value: 36, suffix: 'B tons', label: 'Global CO₂ emissions annually', icon: '🌍' },
  { value: 4.7, suffix: ' tons', label: 'Average global carbon footprint per person/year', icon: '👤' },
  { value: 1.9, suffix: ' tons', label: 'Average Indian carbon footprint per person/year', icon: '🇮🇳' },
  { value: 2050, suffix: '', label: 'Year by which we need Net Zero emissions', icon: '🎯' },
  { value: 1.5, suffix: '°C', label: 'Maximum warming target under Paris Agreement', icon: '🌡️' },
];

export const EMISSION_SOURCES: EmissionSource[] = [
  { label: 'Electricity & Heat', value: 31, color: '#ef4444' },
  { label: 'Transport', value: 16, color: '#f97316' },
  { label: 'Manufacturing', value: 12, color: '#eab308' },
  { label: 'Agriculture', value: 11, color: '#22c55e' },
  { label: 'Buildings', value: 6, color: '#3b82f6' },
];

export const QUICK_TIPS: QuickTip[] = [
  { icon: '🚶', title: 'Walk more', description: 'Walk or cycle for trips under 2 km.' },
  { icon: '💡', title: 'Switch off lights', description: 'Turn off lights when leaving a room.' },
  { icon: '🌡️', title: 'Set AC to 24°C', description: 'Every degree lower uses 6% more energy.' },
  { icon: '🥗', title: 'Eat more plants', description: 'Even one meatless day per week helps.' },
  { icon: '🔌', title: 'Unplug chargers', description: 'Chargers draw power even when idle.' },
  { icon: '🚿', title: 'Shorter showers', description: 'Save water and the energy used to heat it.' },
  { icon: '📱', title: 'Go paperless', description: 'Switch to digital bills and statements.' },
  { icon: '🛒', title: 'Buy local', description: 'Reduce transport emissions from imported goods.' },
  { icon: '♻️', title: 'Recycle properly', description: 'Separate waste into correct categories.' },
  { icon: '🌳', title: 'Plant trees', description: 'Trees absorb CO₂ and provide shade.' },
  { icon: '🧊', title: 'Full loads only', description: 'Run washing machines and dishwashers when full.' },
  { icon: '🏠', title: 'Seal drafts', description: 'Prevent air leaks around windows and doors.' },
];

// ===== localStorage Keys =====
export const STORAGE_KEYS = {
  footprints: 'ecotrack_footprints',
  actions: 'ecotrack_completed_actions',
  lastCalculation: 'ecotrack_last_calculation',
  currentUser: 'ecotrack_current_user',
  users: 'ecotrack_users',
  onboarded: 'ecotrack_onboarded',
  pendingCalculation: 'ecotrack_pending_calculation',
  locale: 'ecotrack_locale',
} as const;

// ===== Navigation Links =====
export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/calculator', label: 'Calculator' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/actions', label: 'Actions' },
  { path: '/insights', label: 'Insights' },
  { path: '/learn', label: 'Learn' },
] as const;

// ===== Routes =====
export const ROUTES = {
  home: '/',
  calculator: '/calculator',
  login: '/login',
  dashboard: '/dashboard',
  actions: '/actions',
  insights: '/insights',
  learn: '/learn',
} as const;

// ===== Category Names =====
export const CATEGORY_NAMES = {
  transport: 'Transport',
  energy: 'Energy',
  diet: 'Diet',
  lifestyle: 'Lifestyle',
  shopping: 'Shopping',
  general: 'General',
  all: 'All',
} as const;

// ===== Colors =====
export const COLORS = {
  primaryGreen: '#22c55e',
  bgDark: '#09090b',
  bgCard: '#18181b',
  borderDark: '#27272a',
  blueScore: '#3b82f6',
  textLight: '#ffffff',
  textMuted: '#a1a1aa',
  textGray: '#71717a',
  textPrimary: '#e4e4e7',
  warningYellow: '#eab308',
  dangerRed: '#ef4444',
  successGreen: '#22c55e',
  green400: '#4ade80',
  emerald600: '#059669',
  emerald700: '#047857',
  purple500: '#a855f7',
  zinc800: '#27272a',
  zinc900: '#18181b',
  zinc950: '#09090b',
  chartTransport: '#3b82f6',
  chartEnergy: '#f97316',
  chartDiet: '#22c55e',
  chartLifestyle: '#a855f7',
  chartTransportBorder: '#2563eb',
  chartEnergyBorder: '#ea580c',
  chartDietBorder: '#16a34a',
  chartLifestyleBorder: '#9333ea',
  chartGrid: '#1a1a1a',
  chartLineBorder: '#22c55e',
  chartLineBg: 'rgba(34,197,94,0.1)',
} as const;

// ===== PDF Config =====
export const PDF_CONFIG = {
  a4WidthMm: 210,
  a4HeightMm: 297,
  scale: 2,
  hiddenOffset: '-9999px',
  tipLimit: 3,
} as const;

// ===== Calculation Constants =====
export const DAYS_IN_MONTH = 30;
export const MONTHS_IN_YEAR = 12;
export const KG_IN_TON = 1000;


