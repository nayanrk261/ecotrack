# Testing Documentation Suite

This document outlines the testing architecture, mock setups, coverage details, and running procedures for **EcoTrack**.

## 🧪 Testing Stack

EcoTrack uses a modern testing stack designed for speed, isolation, and reliable DOM simulation:
- **Vitest**: A fast Vite-native testing framework.
- **React Testing Library**: Enforces testing components based on user interaction rather than internal state implementation details.
- **jsdom**: Simulates a web browser environment inside Node.js.

---

## 📂 Test Structure

The codebase separates unit tests (pure calculation logic) from integration/component tests:

```text
ecotrack/
├── src/
│   ├── lib/
│   │   ├── __tests__/           # Pure unit tests
│   │   │   ├── carbonCalculations.test.ts # Verifies emission calculators
│   │   │   ├── localStorage.test.ts       # Validates store operations
│   │   │   └── trendAnalysis.test.ts      # Tests least-squares linear regression
│   └── pages/
│       ├── __tests__/           # Component & Integration tests
│       │   ├── Actions.test.tsx      # Tests habit completions and categories
│       │   ├── Calculator.test.tsx   # Tests step routing, validations, and hooks
│       │   └── Dashboard.test.tsx    # Tests charts, history, and regression slope
```

---

## ⚙️ Mock Configurations

To isolate components from external side effects during test runs, we mock the following web browser APIs and modules:

### 1. Web Router Mocking
Components using `useNavigate` or dynamic links are rendered inside a `<BrowserRouter>` wrapper to avoid routing errors:
```typescript
render(
  <BrowserRouter>
    <Calculator />
  </BrowserRouter>
);
```

### 2. Localization Integration
All component render functions are wrapped inside `<LanguageProvider>` to ensure translation hooks do not return undefined keys:
```typescript
render(
  <BrowserRouter>
    <LanguageProvider>
      <Calculator />
    </LanguageProvider>
  </BrowserRouter>
);
```

### 3. Chart.js Mocking
Chart.js uses HTML Canvas APIs which are not natively supported by jsdom. We mock `react-chartjs-2` to verify data flows to graphs without crash triggers:
```typescript
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart" />,
  Doughnut: () => <div data-testid="doughnut-chart" />,
  Line: () => <div data-testid="line-chart" />,
}));
```

---

## 🚀 Commands

### Run All Tests (Single Run)
```bash
npm run test
```

### Watch Mode (Interactive Development)
```bash
npm run test:watch
```
