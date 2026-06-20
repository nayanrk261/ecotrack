import type { InsightTip, CarbonResult } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Build the system prompt populated with user's carbon footprint data.
 *
 * @param result - The user's carbon calculation result.
 * @returns The formatted string prompt for the Gemini model.
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
 * Strip markdown code fences (like ```json ... ```) from a text response.
 *
 * @param text - The raw text containing code fences.
 * @returns The cleaned text content.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
}

/**
 * Fetch personalized tips from Google Gemini API.
 * Uses the user's carbon footprint data to query the API and receive structured advice.
 *
 * @param result - The user's carbon footprint result.
 * @returns A promise resolving to an array of InsightTip objects.
 * @throws Error if the API key is missing, the response is not OK, the response is empty, or JSON parsing fails.
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
  let tips: InsightTip[];
  try {
    tips = JSON.parse(cleaned) as InsightTip[];
  } catch (e) {
    throw new Error(`Failed to parse Gemini API response: ${e instanceof Error ? e.message : 'Invalid JSON format'}`, { cause: e });
  }

  if (!Array.isArray(tips) || tips.length === 0) {
    throw new Error('Invalid response format from Gemini API');
  }

  return tips;
}

