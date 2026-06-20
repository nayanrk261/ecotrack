// ===== Calculator Types =====
export type CommuteMode = 'car' | 'bike' | 'bus' | 'train' | 'walk';
export type CookingFuel = 'lpg' | 'png' | 'electric' | 'induction';
export type DietType = 'vegan' | 'vegetarian' | 'eggetarian' | 'non-veg';

export interface TransportData {
  commuteMode: CommuteMode;
  dailyDistance: number;
  shortHaulFlights: number;
  longHaulFlights: number;
}

export interface EnergyData {
  monthlyElectricity: number;
  cookingFuel: CookingFuel;
  householdSize: number;
}

export interface DietData {
  dietType: DietType;
  monthlyOnlineOrders: number;
  newClothesPerMonth: number;
}

export interface CalculatorFormData {
  transport: TransportData;
  energy: EnergyData;
  diet: DietData;
}

// ===== Carbon Results =====
export interface CategoryBreakdown {
  transport: number;
  energy: number;
  diet: number;
  lifestyle: number;
}

export interface CarbonResult {
  totalMonthly: number;
  totalAnnual: number;
  breakdown: CategoryBreakdown;
  score: CarbonScore;
}

export type CarbonScore = 'Eco Warrior' | 'Green Learner' | 'Average' | 'Carbon Heavy';

export interface SavedFootprint {
  id: string;
  date: string;
  formData: CalculatorFormData;
  result: CarbonResult;
}

// ===== Insights Types =====
export type InsightDifficulty = 'Easy' | 'Medium' | 'Hard';
export type InsightCategory = 'Transport' | 'Energy' | 'Diet' | 'Shopping' | 'General';

export interface InsightTip {
  title: string;
  description: string;
  co2Savings: number;
  difficulty: InsightDifficulty;
  category: InsightCategory;
  icon: string;
}

// ===== Actions Types =====
export type ActionCategory = 'Transport' | 'Energy' | 'Diet' | 'Lifestyle';

export interface GreenAction {
  id: string;
  name: string;
  description: string;
  co2Savings: number;
  category: ActionCategory;
  icon: string;
}

// ===== Learn Types =====
export interface KeyFact {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

export interface QuickTip {
  icon: string;
  title: string;
  description: string;
}

export interface EmissionSource {
  label: string;
  value: number;
  color: string;
}

// ===== Authentication =====
export interface User {
  id: string;
  name: string;
  email: string;
  avatarBg: string; // Gradient Tailwind class or styling value
}

