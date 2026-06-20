# EcoTrack — Carbon Footprint Awareness & Habits Tracker

> **EcoTrack** is a production-grade, privacy-first carbon footprint calculator and habits tracker designed to empower individuals to measure, understand, and reduce their personal carbon footprint using localized averages and custom AI insights.

[![CI Build & Test](https://github.com/nayanrk261/ecotrack/actions/workflows/ci.yml/badge.svg)](https://github.com/nayanrk261/ecotrack/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Live Demo
[Access the Live EcoTrack Web App (Placeholder)](https://your-ecotrack-demo-link.vercel.app)

---

## 🎯 Chosen Vertical & Mission

### Carbon Footprint Awareness for Individuals
Climate change is a global systemic challenge, but systemic change is driven by individual awareness and action. EcoTrack addresses this directly:
- **Low Barriers to Entry (Guest Mode)**: No account setup, passwords, or authentication walls. Users can measure their impact instantly.
- **Privacy-First Data Storage**: All calculations and completed habits reside strictly in the user's browser `localStorage`, ensuring complete data ownership.
- **Actionable Growth**: Provides a feedback loop of calculating scores, getting AI-generated tips, and building green habits via the Actions list.

---

## ✨ Features

- **Interactive Carbon Calculator**: Estimate emissions across Transport, Home Energy, and Diet & Lifestyle in under 2 minutes. Includes active inputs validation.
- **Personalized AI Insights**: Connect with the Google Gemini API to analyze carbon footprints and recommend tailored reduction strategies.
- **Completed Habits Tracker**: Log daily and weekly green actions (e.g. switching to LED bulbs, switching to an EV, composting) and track your annual CO₂ savings.
- **Friends Leaderboard**: Compare scores with a static mock leaderboard to add narrative depth and community benchmarks.
- **Data Settings Panel**: Instantly clear all calculation history and habit logs to restart.
- **Accessibility & Keyboard Friendly**: Full WCAG AA color contrast compliance, keyboard focus rings, and screen-reader labels.
- **Print Layout Support**: Custom media CSS queries to easily screenshot, save, or print dashboard summaries.

---

## 🛠️ Tech Stack

- **Core Framework**: React 19 (TypeScript) + Vite 8
- **Styling**: Tailwind CSS v4 + Custom Theme Design System
- **Icons**: Lucide React
- **Charts**: Chart.js + React-Chartjs-2
- **Testing**: Vitest + React Testing Library + JSDOM
- **Linter**: ESLint + TypeScript ESLint + React Hooks Flat Config

---

## 📂 Project Structure

```text
ecotrack/
├── .github/workflows/   # CI/CD GitHub Actions
│   └── ci.yml           # Standardized CI pipeline
├── src/
│   ├── components/      # Common UI (Navbar, Footer, ErrorBoundary)
│   ├── context/         # AuthProvider & LanguageProvider localization
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/           # useCarbon, useLocalStorage custom hooks
│   ├── lib/             # Calculations, Constants, Gemini API, Regression
│   │   ├── __tests__/   # Library unit tests
│   │   ├── carbonCalculations.ts
│   │   ├── constants.ts
│   │   ├── geminiApi.ts
│   │   ├── localStorage.ts
│   │   └── trendAnalysis.ts # Least-squares linear regression engine
│   ├── pages/           # Pages (Home, Calculator, Dashboard, Actions, Insights, Learn, NotFound)
│   ├── test/            # Vitest environment setup
│   ├── types/           # Core TypeScript interfaces
│   ├── App.tsx          # Router config and core layout
│   ├── index.css        # Design system & print styling
│   └── main.tsx
├── ARCHITECTURE.md      # System design and data lifecycle diagram
├── SECURITY.md          # Input validations, escape rules, environment safety
├── TESTING.md           # Testing instructions and mock specs
├── package.json
├── tsconfig.json
├── vite.config.ts       # Vite config
└── vitest.config.ts     # Vitest testing config
```

---

## 🧮 Carbon Calculation Methodology

EcoTrack calculates monthly emissions in kg CO₂ based on regional emission factors (optimized for India average comparisons). 

### 1. Transportation
- **Commuting**: Daily commute distance × commute mode factor × 30 days.
  - *Car*: `0.21` kg CO₂/km
  - *Bike (Two-wheeler)*: `0.11` kg CO₂/km
  - *Bus*: `0.089` kg CO₂/km
  - *Train*: `0.041` kg CO₂/km
  - *Walk/Cycle*: `0.00` kg CO₂/km
- **Flights**: (Short-haul flights × 255 kg CO₂ + Long-haul flights × 1620 kg CO₂) / 12 months.

### 2. Home Energy
- **Electricity**: (Monthly electricity consumption in kWh × `0.82` kg CO₂/kWh) / Household Size.
- **Cooking Fuel**:
  - *LPG*: `35.76` kg CO₂/month
  - *PNG*: `40.80` kg CO₂/month
  - *Electric/Induction*: `0.00` kg CO₂/month (captured in electricity)

### 3. Diet
- Diet emissions are set at fixed monthly benchmarks based on dietary carbon load:
  - *Vegan*: `50` kg CO₂/month
  - *Vegetarian*: `85` kg CO₂/month
  - *Eggetarian*: `102` kg CO₂/month
  - *Non-Vegetarian*: `140` kg CO₂/month

### 4. Lifestyle & Shopping
- **Online Shopping**: Monthly orders count × `0.5` kg CO₂ per order.
- **New Clothing**: New garments purchased × `5` kg CO₂ per item.

### 📈 Trend Projection & Regression Methodology
To forecast user carbon emissions for subsequent periods based on their historical calculation logs, EcoTrack implements a linear regression projection using the Least Squares Method:
- **Linear Formula**: `y = mx + c`
  - `x`: Month index (time steps).
  - `y`: Calculated monthly carbon footprint (kg CO₂).
  - `m` (Slope/Trend Rate): Representing monthly footprint reduction or growth rate.
    - `m = [n * Σ(x * y) - Σx * Σy] / [n * Σ(x^2) - (Σx)^2]`
  - `c` (Intercept): Expected baseline starting emissions.
    - `c = [Σy - m * Σx] / n`
- **Projection**: The predicted value for the next month is computed as `y = m * (next_index) + c`. The trend is plotted as a dashed line on the dashboard chart.

### Carbon Score Tier Boundaries
- **Eco Warrior**: < 150 kg CO₂/month (Exemplary low-impact living)
- **Green Learner**: 150 - 300 kg CO₂/month (Healthy conscious footprint)
- **Average**: 300 - 500 kg CO₂/month (Close to Indian regional averages)
- **Carbon Heavy**: > 500 kg CO₂/month (Highly intensive consumption)

*Regional Assumptions: Averages are benchmarks based on India's per-capita carbon footprint (~1.9 tons/year per person, i.e. ~158 kg/month) and the global average (~4.7 tons/year, i.e. ~392 kg/month).*

---

## 🚀 Setup Instructions

### 1. Prerequisites
Ensure you have **Node.js v20+** and **npm** installed on your system.

### 2. Clone and Install
```bash
git clone https://github.com/nayanrk261/ecotrack.git
cd ecotrack
npm install
```

### 3. Setup Environment Variables
Duplicate `.env.example` to create a `.env` file:
```bash
cp .env.example .env
```
Open `.env` and configure your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing Instructions

Tests are written using **Vitest** and **React Testing Library**.

### Run All Tests (Single Execution)
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Build & Validate Compilation
```bash
npm run build
```

---

## 📖 Additional Project Documentation

- [ARCHITECTURE.md](file:///c:/Users/windows/OneDrive/Desktop/PROJ/ecotrack/ARCHITECTURE.md): Explains system architecture, folder layouts, and details the core React component logic.
- [SECURITY.md](file:///c:/Users/windows/OneDrive/Desktop/PROJ/ecotrack/SECURITY.md): Details input validation logic, safety measures against XSS, try-catch safety guards, and environment variables.
- [TESTING.md](file:///c:/Users/windows/OneDrive/Desktop/PROJ/ecotrack/TESTING.md): Covers automated testing suites, code verification practices, mocking patterns, and vitest command logs.
