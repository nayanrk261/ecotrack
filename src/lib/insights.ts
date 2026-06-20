import type { InsightTip } from '../types';

/**
 * Generate actionable eco-tips based on the user's carbon breakdown.
 * Evaluates each category against threshold values and selects relevant tips,
 * returning one tip per category plus one general tip — always five in total.
 *
 * @param breakdown - Per-category monthly emissions (transport, energy, diet, lifestyle) in kg CO₂.
 * @param totalMonthly - The total combined monthly emissions in kg CO₂.
 * @returns An array of InsightTip objects with title, description, co2Savings, difficulty, category, and icon.
 */
export function generateInsights(
  breakdown: { transport: number; energy: number; diet: number; lifestyle: number },
  totalMonthly: number
): InsightTip[] {
  const tips: InsightTip[] = [];

  // Transport tips
  if (breakdown.transport > 80) {
    tips.push({
      title: 'Switch to Public Transport',
      description:
        'Your transport emissions are significant. Switching from a car to buses or trains for your daily commute can reduce emissions by up to 75%.',
      co2Savings: 624,
      difficulty: 'Medium',
      category: 'Transport',
      icon: '🚌',
    });
    tips.push({
      title: 'Try Carpooling',
      description:
        'Sharing rides with colleagues or neighbors splits emissions per person and saves fuel costs too.',
      co2Savings: 312,
      difficulty: 'Easy',
      category: 'Transport',
      icon: '🚗',
    });
  } else {
    tips.push({
      title: 'Keep Up the Green Commute',
      description:
        'Your transport footprint is already low — great job! Consider cycling for short trips to keep it even lower.',
      co2Savings: 180,
      difficulty: 'Easy',
      category: 'Transport',
      icon: '🚴',
    });
  }

  // Energy tips
  if (breakdown.energy > 100) {
    tips.push({
      title: 'Reduce Electricity Usage',
      description:
        'Your home energy usage is above average. Switch to LED bulbs, use 5-star rated appliances, and unplug standby devices to cut consumption.',
      co2Savings: 400,
      difficulty: 'Easy',
      category: 'Energy',
      icon: '💡',
    });
    tips.push({
      title: 'Consider Solar Panels',
      description:
        'Rooftop solar can offset a large portion of your electricity emissions and pays for itself in 4-6 years.',
      co2Savings: 1800,
      difficulty: 'Hard',
      category: 'Energy',
      icon: '☀️',
    });
  } else {
    tips.push({
      title: 'Optimize Standby Power',
      description:
        'Even with low usage, phantom power from devices on standby wastes up to 10% of household energy. Unplug when not in use.',
      co2Savings: 80,
      difficulty: 'Easy',
      category: 'Energy',
      icon: '🔌',
    });
  }

  // Diet tips
  if (breakdown.diet > 100) {
    tips.push({
      title: 'Reduce Meat Consumption',
      description:
        'Your diet has a higher carbon impact. Even reducing meat to 2-3 days a week can cut diet emissions by 30-40%.',
      co2Savings: 480,
      difficulty: 'Medium',
      category: 'Diet',
      icon: '🥬',
    });
    tips.push({
      title: 'Buy Local Produce',
      description:
        'Locally sourced food travels fewer miles and supports your local economy while reducing transport emissions.',
      co2Savings: 200,
      difficulty: 'Easy',
      category: 'Diet',
      icon: '🛒',
    });
  } else {
    tips.push({
      title: 'Reduce Food Waste',
      description:
        'Your diet footprint is good! Focus on planning meals and storing food properly to minimize waste.',
      co2Savings: 300,
      difficulty: 'Easy',
      category: 'Diet',
      icon: '🍽️',
    });
  }

  // Lifestyle tips
  if (breakdown.lifestyle > 15) {
    tips.push({
      title: 'Cut Online Orders',
      description:
        'Each delivery generates packaging waste and transport emissions. Try consolidating orders or shopping locally.',
      co2Savings: 60,
      difficulty: 'Easy',
      category: 'Shopping',
      icon: '📦',
    });
    tips.push({
      title: 'Buy Second-Hand Clothes',
      description:
        'Fast fashion is a major polluter. Thrift shopping extends garment life and avoids manufacturing emissions entirely.',
      co2Savings: 120,
      difficulty: 'Easy',
      category: 'Shopping',
      icon: '👗',
    });
  } else {
    tips.push({
      title: 'Repair, Don\'t Replace',
      description:
        'Your shopping footprint is low — nice! Keep extending the life of items by repairing electronics and clothes.',
      co2Savings: 90,
      difficulty: 'Easy',
      category: 'Shopping',
      icon: '🔧',
    });
  }

  // General tip based on total
  if (totalMonthly > 300) {
    tips.push({
      title: 'Plant Trees to Offset',
      description:
        'While reducing emissions is the priority, planting trees can help offset what you cannot yet eliminate. A single tree absorbs ~21 kg CO₂/year.',
      co2Savings: 21,
      difficulty: 'Easy',
      category: 'General',
      icon: '🌳',
    });
  } else {
    tips.push({
      title: 'Spread Awareness',
      description:
        'Your footprint is relatively low — lead by example! Share what you know with friends and family to multiply the impact.',
      co2Savings: 0,
      difficulty: 'Easy',
      category: 'General',
      icon: '📢',
    });
  }

  return tips;
}
