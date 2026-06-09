import type { InsightTip, CarbonResult } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Build the system prompt with carbon data
 */
function buildPrompt(result: CarbonResult): string {
  return `You are a carbon footprint reduction expert. Analyze the following carbon footprint data and respond with ONLY a valid JSON array (no markdown, no explanation) containing exactly 5 objects with this structure: [{"title": "string", "description": "string", "co2Savings": number, "difficulty": "Easy|Medium|Hard", "category": "Transport|Energy|Diet|Shopping|General", "icon": "emoji"}] where co2Savings is a number in kg per year.

User's carbon footprint data:
- Monthly total: ${result.totalMonthly} kg CO₂
- Annual total: ${result.totalAnnual} tons CO₂
- Transport: ${result.breakdown.transport} kg/month
- Energy: ${result.breakdown.energy} kg/month
- Diet: ${result.breakdown.diet} kg/month
- Lifestyle: ${result.breakdown.lifestyle} kg/month
- Carbon Score: ${result.score}`;
}

/**
 * Strip markdown code fences from API response
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
}

/**
 * Fetch personalized tips from Google Gemini API
 */
export async function getGeminiInsights(
  result: CarbonResult
): Promise<InsightTip[]> {
  if (!API_KEY) {
    throw new Error(
      'Gemini API key not found. Set VITE_GEMINI_API_KEY in your .env file.'
    );
  }

  const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: buildPrompt(result) }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();

  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!rawText) {
    throw new Error('Empty response from Gemini API');
  }

  const cleaned = stripMarkdown(rawText);
  const tips: InsightTip[] = JSON.parse(cleaned);

  if (!Array.isArray(tips) || tips.length === 0) {
    throw new Error('Invalid response format from Gemini API');
  }

  return tips;
}
