/**
 * @file OnboardingModal.tsx
 * @description Welcoming multi-step onboarding modal shown on first visit.
 * Implements ARIA dialog semantics, focus trapping while open, and focus
 * restoration to the triggering element on close.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle, ChevronRight, Check, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

/** All focusable element selectors (standard interactive elements) */
const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function OnboardingModal({ onClose }: Props) {
  const [step, setStep] = useState(0);

  /** Ref for the dialog container — used for focus trapping */
  const dialogRef = useRef<HTMLDivElement>(null);
  /** Remember which element was focused before we opened the modal */
  const triggerRef = useRef<Element | null>(null);
  /** Ref for the first focusable element so we can auto-focus on mount */
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const steps = [
    {
      title: '1. Calculate Footprint',
      description:
        'Enter your commute details, home electricity usage, and diet habits in our simple calculator. It takes less than 2 minutes!',
      icon: '📊',
    },
    {
      title: '2. Track Your Progress',
      description:
        'See your Carbon Score tier, analyse your category breakdown, and watch your monthly trend line decline as you log more calculations.',
      icon: '📈',
    },
    {
      title: '3. Log Green Actions',
      description:
        'Choose from 20+ eco-friendly habits to adopt. Check them off as you complete them to see your annual carbon savings grow.',
      icon: '🌿',
    },
  ];

  // Save the currently focused element so we can restore it on close
  useEffect(() => {
    triggerRef.current = document.activeElement;
    // Auto-focus the first actionable button
    firstFocusableRef.current?.focus();

    return () => {
      // Restore focus to the trigger element when the modal unmounts
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, []);

  const handleSkip = useCallback(() => {
    localStorage.setItem('ecotrack_onboarded', 'true');
    onClose();
  }, [onClose]);

  const handleNext = useCallback(() => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('ecotrack_onboarded', 'true');
      onClose();
    }
  }, [step, steps.length, onClose]);

  // Focus trap: intercept Tab / Shift+Tab to cycle within the dialog
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      handleSkip();
      return;
    }

    if (e.key !== 'Tab') return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableEls = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter((el) => !el.hasAttribute('disabled'));

    if (focusableEls.length === 0) return;

    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: wrap backwards
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: wrap forwards
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [handleSkip]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
      aria-hidden="true"
      onClick={(e) => {
        // Close when clicking the backdrop (not the card itself)
        if (e.target === e.currentTarget) handleSkip();
      }}
    >
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
        className="w-full max-w-lg card bg-zinc-950/60 backdrop-blur-2xl border border-zinc-900 rounded-3xl p-6 relative z-10 shadow-2xl shadow-black/80"
        onKeyDown={handleKeyDown}
      >
        {/* Skip button */}
        <button
          ref={firstFocusableRef}
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-300 transition-colors border-none bg-transparent cursor-pointer"
          aria-label="Skip onboarding"
        >
          <X size={18} />
        </button>

        {/* Logo and Intro */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-green-500 to-emerald-700 flex items-center justify-center text-zinc-950">
            <HelpCircle size={18} />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase text-green-400">
            Welcome to EcoTrack
          </span>
        </div>

        {/* Step details */}
        <div className="text-center mb-8 px-2">
          <div className="text-5xl mb-4 select-none" aria-hidden="true">
            {steps[step].icon}
          </div>
          <h3
            id="onboarding-title"
            className="text-xl font-bold text-white mb-2"
          >
            {steps[step].title}
          </h3>
          <p
            id="onboarding-description"
            className="text-zinc-400 text-sm leading-relaxed min-h-[64px]"
          >
            {steps[step].description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2" role="tablist" aria-label="Step progress">
            {steps.map((_, i) => (
              <div
                key={i}
                role="tab"
                aria-selected={i === step}
                aria-label={`Step ${i + 1} of ${steps.length}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-green-500' : 'w-1.5 bg-zinc-800'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              className="py-2 px-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-zinc-950 font-bold rounded-xl transition-all shadow-md shadow-green-500/10 flex items-center gap-1 cursor-pointer border-none"
              aria-label={step === steps.length - 1 ? 'Get started with EcoTrack' : `Next step: ${steps[step + 1]?.title ?? ''}`}
            >
              {step === steps.length - 1 ? (
                <>
                  Get Started
                  <Check size={16} />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
