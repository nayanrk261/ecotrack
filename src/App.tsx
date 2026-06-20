import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import OnboardingModal from './components/OnboardingModal';

// ── Code-split page-level routes ─────────────────────────────────────────────
// Each page is loaded on-demand, keeping the initial bundle small.
const Home       = lazy(() => import('./pages/Home'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Actions    = lazy(() => import('./pages/Actions'));
const Insights   = lazy(() => import('./pages/Insights'));
const Learn      = lazy(() => import('./pages/Learn'));
const Auth       = lazy(() => import('./pages/Auth'));
const NotFound   = lazy(() => import('./pages/NotFound'));

/** Full-screen loading spinner shown while a lazy page chunk is being fetched. */
function PageLoadingSpinner() {
  return (
    <div
      aria-label="Loading page…"
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <div className="page-spinner" />
    </div>
  );
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('ecotrack_onboarded');
    } catch {
      return false;
    }
  });

  return (
    <ErrorBoundary>
      <div className="app">
        {/* Accessibility: skip navigation for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#ffffff',
              border: '1px solid #1a1a1a',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#111111' },
            },
          }}
        />
        <Navbar />
        <main id="main-content" className="main-content">
          <Suspense fallback={<PageLoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/login" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/actions"
                element={
                  <ProtectedRoute>
                    <Actions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute>
                    <Insights />
                  </ProtectedRoute>
                }
              />
              <Route path="/learn" element={<Learn />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      </div>
    </ErrorBoundary>
  );
}
