import type React from 'react';

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

// ===== Alias and Sub-component Types =====
export type FootprintData = SavedFootprint;
export type CalculatorStepIndex = 0 | 1 | 2 | 3;

export interface Step1TransportProps {
  data: Omit<TransportData, 'shortHaulFlights' | 'longHaulFlights'> & {
    shortHaulFlights: number | '';
    longHaulFlights: number | '';
  };
  onChange: React.Dispatch<
    React.SetStateAction<
      Omit<TransportData, 'shortHaulFlights' | 'longHaulFlights'> & {
        shortHaulFlights: number | '';
        longHaulFlights: number | '';
      }
    >
  >;
}

export interface Step2EnergyProps {
  data: EnergyData;
  onChange: React.Dispatch<React.SetStateAction<EnergyData>>;
}

export interface Step3DietProps {
  data: DietData;
  onChange: React.Dispatch<React.SetStateAction<DietData>>;
}

export interface Step4ResultsProps {
  result: CarbonResult;
  saved: boolean;
  onSave: () => void;
  onGetInsights: () => void;
}

export interface DashboardStatsProps {
  stats: {
    monthly: number;
    annual: number;
    score: CarbonScore;
    vsIndia: number;
    vsGlobal: number;
  };
}

export interface DashboardChartsProps {
  footprints: SavedFootprint[];
  stats: {
    monthly: number;
    annual: number;
    score: CarbonScore;
    vsIndia: number;
    vsGlobal: number;
  };
}

export interface DashboardHistoryProps {
  footprints: SavedFootprint[];
  onDelete: (id: string) => void;
}

export interface LeaderboardSectionProps {
  userFootprint: number;
}

export interface SignInFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export interface FactCardProps {
  fact: KeyFact;
}

export interface QuickTipCardProps {
  tip: QuickTip;
}

export interface ResourceCardProps {
  resource: {
    title: string;
    titleHi: string;
    desc: string;
    descHi: string;
    url: string;
  };
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

