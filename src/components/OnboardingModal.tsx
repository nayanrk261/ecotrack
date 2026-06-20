import { useState } from 'react';
import { HelpCircle, ChevronRight, Check, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: Props) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '1. Calculate Footprint',
      description: 'Enter your commute details, home electricity usage, and diet habits in our simple calculator. It takes less than 2 minutes!',
      icon: '📊',
    },
    {
      title: '2. Track Your Progress',
      description: 'See your Carbon Score tier, analyze your category breakdown, and watch your monthly trend line decline as you log more calculations.',
      icon: '📈',
    },
    {
      title: '3. Log Green Actions',
      description: 'Choose from 20+ eco-friendly habits to adopt. Check them off as you complete them to see your annual carbon savings grow.',
      icon: '🌿',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('ecotrack_onboarded', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('ecotrack_onboarded', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="w-full max-w-lg card bg-zinc-950/60 backdrop-blur-2xl border border-zinc-900 rounded-3xl p-6 relative z-10 shadow-2xl shadow-black/80">
        
        {/* Skip button top right */}
        <button
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
          <span className="text-sm font-bold tracking-wider uppercase text-green-400">Welcome to EcoTrack</span>
        </div>

        {/* Step details */}
        <div className="text-center mb-8 px-2">
          <div className="text-5xl mb-4 select-none">{steps[step].icon}</div>
          <h3 id="onboarding-title" className="text-xl font-bold text-white mb-2">{steps[step].title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed min-h-[64px]">{steps[step].description}</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
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
