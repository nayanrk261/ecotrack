import type {
  CalculatorFormData,
  CarbonResult,
  CarbonScore,
  CategoryBreakdown,
} from '../types';
import { EMISSION_FACTORS, SCORE_THRESHOLDS } from './constants';

/**
 * Calculate monthly transport emissions in kg CO₂
 */
function calculateTransport(data: CalculatorFormData['transport']): number {
  const commuteEmission =
    EMISSION_FACTORS.transport[data.commuteMode] * data.dailyDistance * 30;

  const flightEmission =
    (data.shortHaulFlights * EMISSION_FACTORS.flights.shortHaul +
      data.longHaulFlights * EMISSION_FACTORS.flights.longHaul) /
    12;

  return commuteEmission + flightEmission;
}

/**
 * Calculate monthly energy emissions in kg CO₂
 */
function calculateEnergy(data: CalculatorFormData['energy']): number {
  const electricityEmission =
    (data.monthlyElectricity * EMISSION_FACTORS.energy.electricity) /
    data.householdSize;

  const cookingEmission = EMISSION_FACTORS.energy[data.cookingFuel];

  return electricityEmission + cookingEmission;
}

/**
 * Calculate monthly diet emissions in kg CO₂
 */
function calculateDiet(data: CalculatorFormData['diet']): number {
  return EMISSION_FACTORS.diet[data.dietType];
}

/**
 * Calculate monthly lifestyle emissions in kg CO₂
 */
function calculateLifestyle(data: CalculatorFormData['diet']): number {
  return (
    data.monthlyOnlineOrders * EMISSION_FACTORS.lifestyle.onlineOrder +
    data.newClothesPerMonth * EMISSION_FACTORS.lifestyle.newClothes
  );
}

/**
 * Determine carbon score based on monthly total
 */
function getCarbonScore(monthlyKg: number): CarbonScore {
  if (monthlyKg < SCORE_THRESHOLDS.ecoWarrior) return 'Eco Warrior';
  if (monthlyKg < SCORE_THRESHOLDS.greenLearner) return 'Green Learner';
  if (monthlyKg < SCORE_THRESHOLDS.average) return 'Average';
  return 'Carbon Heavy';
}

/**
 * Main calculation function — returns full result from form data
 */
export function calculateCarbonFootprint(
  formData: CalculatorFormData
): CarbonResult {
  const transport = Math.round(calculateTransport(formData.transport) * 100) / 100;
  const energy = Math.round(calculateEnergy(formData.energy) * 100) / 100;
  const diet = Math.round(calculateDiet(formData.diet) * 100) / 100;
  const lifestyle = Math.round(calculateLifestyle(formData.diet) * 100) / 100;

  const breakdown: CategoryBreakdown = { transport, energy, diet, lifestyle };
  const totalMonthly =
    Math.round((transport + energy + diet + lifestyle) * 100) / 100;
  const totalAnnual = Math.round((totalMonthly * 12) / 100) / 10; // in tons

  return {
    totalMonthly,
    totalAnnual,
    breakdown,
    score: getCarbonScore(totalMonthly),
  };
}

/**
 * Get score emoji for display
 */
export function getScoreEmoji(score: CarbonScore): string {
  switch (score) {
    case 'Eco Warrior':
      return '🌟';
    case 'Green Learner':
      return '🌿';
    case 'Average':
      return '⚠️';
    case 'Carbon Heavy':
      return '🔴';
  }
}

/**
 * Get score color class
 */
export function getScoreColor(score: CarbonScore): string {
  switch (score) {
    case 'Eco Warrior':
      return '#22c55e';
    case 'Green Learner':
      return '#4ade80';
    case 'Average':
      return '#eab308';
    case 'Carbon Heavy':
      return '#ef4444';
  }
}
