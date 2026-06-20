import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint, getScoreEmoji, getScoreColor } from '../carbonCalculations';
import type { CalculatorFormData } from '../../types';

describe('carbonCalculations', () => {
  it('should correctly calculate emissions for known inputs', () => {
    const formData: CalculatorFormData = {
      transport: {
        commuteMode: 'car',
        dailyDistance: 10,
        shortHaulFlights: 2,
        longHaulFlights: 1,
      },
      energy: {
        monthlyElectricity: 200,
        cookingFuel: 'lpg',
        householdSize: 2,
      },
      diet: {
        dietType: 'vegetarian',
        monthlyOnlineOrders: 4,
        newClothesPerMonth: 2,
      },
    };

    const result = calculateCarbonFootprint(formData);

    // Transport commute: 0.21 * 10 * 30 = 63
    // Flights: (2 * 255 + 1 * 1620) / 12 = 177.5
    // Total Transport = 240.5
    expect(result.breakdown.transport).toBeCloseTo(240.5, 1);

    // Electricity: (200 * 0.82) / 2 = 82
    // Cooking: LPG = 35.76
    // Total Energy = 117.76
    expect(result.breakdown.energy).toBeCloseTo(117.76, 1);

    // Diet: vegetarian = 85
    expect(result.breakdown.diet).toBe(85);

    // Lifestyle: 4 * 0.5 + 2 * 5 = 12
    expect(result.breakdown.lifestyle).toBe(12);

    // Total Monthly = 240.5 + 117.76 + 85 + 12 = 455.26
    expect(result.totalMonthly).toBeCloseTo(455.26, 1);

    // Annual Tons: Math.round((455.26 * 12 / 1000) * 10) / 10 = Math.round(5.46312 * 10) / 10 = 5.5
    expect(result.totalAnnual).toBe(5.5);

    // Score tier: 455.26 is between 300 and 500, so 'Average'
    expect(result.score).toBe('Average');
  });

  it('should handle zero emissions/walk commute correctly (min edge case)', () => {
    const formData: CalculatorFormData = {
      transport: {
        commuteMode: 'walk',
        dailyDistance: 0,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      },
      energy: {
        monthlyElectricity: 0,
        cookingFuel: 'electric',
        householdSize: 4,
      },
      diet: {
        dietType: 'vegan',
        monthlyOnlineOrders: 0,
        newClothesPerMonth: 0,
      },
    };

    const result = calculateCarbonFootprint(formData);

    expect(result.breakdown.transport).toBe(0);
    expect(result.breakdown.energy).toBe(0); // electric cooking is 0, electricity is 0
    expect(result.breakdown.diet).toBe(50); // vegan baseline is 50
    expect(result.breakdown.lifestyle).toBe(0);
    expect(result.totalMonthly).toBe(50);
    expect(result.totalAnnual).toBe(0.6); // 50 * 12 / 1000 = 0.6 tons
    expect(result.score).toBe('Eco Warrior'); // 50 < 150
  });

  it('should handle max emissions correctly (max edge case)', () => {
    const formData: CalculatorFormData = {
      transport: {
        commuteMode: 'car',
        dailyDistance: 100,
        shortHaulFlights: 50,
        longHaulFlights: 50,
      },
      energy: {
        monthlyElectricity: 1000,
        cookingFuel: 'png',
        householdSize: 1,
      },
      diet: {
        dietType: 'non-veg',
        monthlyOnlineOrders: 30,
        newClothesPerMonth: 20,
      },
    };

    const result = calculateCarbonFootprint(formData);

    // Transport commute: 0.21 * 100 * 30 = 630
    // Flights: (50 * 255 + 50 * 1620) / 12 = 93750 / 12 = 7812.5
    // Total transport: 8442.5
    expect(result.breakdown.transport).toBeCloseTo(8442.5, 1);

    // Electricity: 1000 * 0.82 / 1 = 820
    // Cooking: PNG = 40.8
    // Total energy: 860.8
    expect(result.breakdown.energy).toBeCloseTo(860.8, 1);

    // Diet: non-veg = 140
    expect(result.breakdown.diet).toBe(140);

    // Lifestyle: 30 * 0.5 + 20 * 5 = 115
    expect(result.breakdown.lifestyle).toBe(115);

    expect(result.totalMonthly).toBeCloseTo(8442.5 + 860.8 + 140 + 115, 1); // 9558.3
    expect(result.score).toBe('Carbon Heavy');
  });

  describe('score UI helpers', () => {
    it('should return correct emojis for each tier', () => {
      expect(getScoreEmoji('Eco Warrior')).toBe('🌟');
      expect(getScoreEmoji('Green Learner')).toBe('🌿');
      expect(getScoreEmoji('Average')).toBe('⚠️');
      expect(getScoreEmoji('Carbon Heavy')).toBe('🔴');
    });

    it('should return correct colors for each tier', () => {
      expect(getScoreColor('Eco Warrior')).toBe('#22c55e');
      expect(getScoreColor('Green Learner')).toBe('#4ade80');
      expect(getScoreColor('Average')).toBe('#eab308');
      expect(getScoreColor('Carbon Heavy')).toBe('#ef4444');
    });
  });
});
