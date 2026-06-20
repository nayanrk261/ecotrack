import type {
  CalculatorFormData,
  CarbonResult,
  CarbonScore,
  CategoryBreakdown,
} from '../types';
import { EMISSION_FACTORS, SCORE_THRESHOLDS, DAYS_IN_MONTH, MONTHS_IN_YEAR, KG_IN_TON } from './constants';

/**
 * Calculate monthly transport emissions in kg CO₂.
 * Uses emission factors per km for commute modes and standard estimates for flights.
 *
 * @param data - The transport data containing commute mode, daily distance, short-haul, and long-haul flights.
 * @returns The total monthly transport emissions in kg CO₂.
 */
function calculateTransport(data: CalculatorFormData['transport']): number {
  const commuteEmission =
    EMISSION_FACTORS.transport[data.commuteMode] * data.dailyDistance * DAYS_IN_MONTH;

  const flightEmission =
    (data.shortHaulFlights * EMISSION_FACTORS.flights.shortHaul +
      data.longHaulFlights * EMISSION_FACTORS.flights.longHaul) /
    MONTHS_IN_YEAR;

  return commuteEmission + flightEmission;
}

/**
 * Calculate monthly energy emissions in kg CO₂.
 * Accounts for electricity consumption divided by household size, plus cooking fuel factors.
 *
 * @param data - The energy data containing monthly electricity, cooking fuel, and household size.
 * @returns The total monthly energy emissions in kg CO₂.
 */
function calculateEnergy(data: CalculatorFormData['energy']): number {
  const electricityEmission =
    (data.monthlyElectricity * EMISSION_FACTORS.energy.electricity) /
    data.householdSize;

  const cookingEmission = EMISSION_FACTORS.energy[data.cookingFuel];

  return electricityEmission + cookingEmission;
}

/**
 * Calculate monthly diet emissions in kg CO₂.
 * Based on the carbon footprint of dietary choices (vegan, vegetarian, etc.).
 *
 * @param data - The diet data containing diet type.
 * @returns The monthly diet emissions in kg CO₂.
 */
function calculateDiet(data: CalculatorFormData['diet']): number {
  return EMISSION_FACTORS.diet[data.dietType];
}

/**
 * Calculate monthly lifestyle emissions in kg CO₂.
 * Sums up emissions from online orders and clothing purchases.
 *
 * @param data - The diet and lifestyle data containing online orders and new clothes.
 * @returns The monthly lifestyle emissions in kg CO₂.
 */
function calculateLifestyle(data: CalculatorFormData['diet']): number {
  return (
    data.monthlyOnlineOrders * EMISSION_FACTORS.lifestyle.onlineOrder +
    data.newClothesPerMonth * EMISSION_FACTORS.lifestyle.newClothes
  );
}

/**
 * Determine the carbon score rating based on the total monthly emissions.
 *
 * @param monthlyKg - The total monthly emissions in kg CO₂.
 * @returns The CarbonScore string representing rating tier ('Eco Warrior', 'Green Learner', etc.).
 */
function getCarbonScore(monthlyKg: number): CarbonScore {
  if (monthlyKg < SCORE_THRESHOLDS.ecoWarrior) return 'Eco Warrior';
  if (monthlyKg < SCORE_THRESHOLDS.greenLearner) return 'Green Learner';
  if (monthlyKg < SCORE_THRESHOLDS.average) return 'Average';
  return 'Carbon Heavy';
}

/**
 * Main calculation function — returns full carbon result from complete form data.
 * Computes monthly totals for transport, energy, diet, and lifestyle, and calculates the annual total in tons.
 *
 * @param formData - The complete calculator form data.
 * @returns The CarbonResult containing monthly totals, annual tons, breakdown, and score.
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
  const totalAnnual = Math.round((totalMonthly * MONTHS_IN_YEAR / KG_IN_TON) * 10) / 10; // in tons, rounded to 1 decimal place

  return {
    totalMonthly,
    totalAnnual,
    breakdown,
    score: getCarbonScore(totalMonthly),
  };
}

/**
 * Get score emoji for display based on the rating tier.
 *
 * @param score - The CarbonScore rating.
 * @returns A string containing the appropriate emoji icon.
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
 * Get score hex color value based on the rating tier.
 *
 * @param score - The CarbonScore rating.
 * @returns A string containing the hex color code.
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

