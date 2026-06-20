# Security Policy & Implementation details

This document outlines the security controls, validation routines, and data handling practices implemented in **EcoTrack** to protect user data and ensure application stability.

## 🛡️ Key Security Vectors

### 1. Robust Input Validation

All user entry points inside the carbon calculator are guarded against anomalous, malicious, or malformed data:
- **Range Slider Constraints**: sliders for distance, electricity, and shopping are limited by predefined HTML5 `min` and `max` limits, preventing overflow or outlier inputs.
- **Flight Entry Fields**: Flights are validated dynamically on page progression:
  - If a field is empty or spaces-only, it triggers an error prompt: `Flights cannot be empty`.
  - Negative integers are caught and rejected: `Flights cannot be negative`.
  - Values are capped to prevent integer overflow.

### 2. Client-Side Parsing Protection

LocalStorage records are read and written using defensive try-catch architectures:
- Any corrupt or hand-edited JSON string in `localStorage` is wrapped in safe `JSON.parse` blocks:
  ```typescript
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Failed to parse storage key:', key, e);
    return defaultValue;
  }
  ```
- This prevents the client application from crashing during boot or render cycles if stored structures are corrupted.

### 3. XSS (Cross-Site Scripting) Mitigation

- **React Element Escaping**: EcoTrack uses React's default JSX engine, which implicitly sanitizes values before outputting them to the DOM, escaping active script tags.
- **Dangerous Renderings avoided**: The application explicitly avoids using `dangerouslySetInnerHTML` for user-generated inputs or calculated strings.

### 4. API Key Protection & Environment Controls

- **Zero-Storage of API Keys in Code**: The Google Gemini API key is loaded strictly from the environment (`import.meta.env.VITE_GEMINI_API_KEY`).
- **Commit Guarding**: The `.env` file containing local credentials is explicitly excluded in `.gitignore` to prevent leaking API keys to repository history.
- **Client-Side Restrictions**: In production systems, requests are recommended to route through a proxy endpoint to verify requests, hide API tokens from the public console inspector, and rate-limit calls.
