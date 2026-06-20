/**
 * @file Auth.tsx
 * @description Orchestrates the Authentication gate page.
 * Provides the visual tab switching shell and handles login/registration API triggers and post-auth page redirects.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { useCarbon } from '../hooks/useCarbon';

import SignInForm from '../components/auth/SignInForm';
import SignUpForm from '../components/auth/SignUpForm';

type AuthMode = 'signin' | 'signup';

interface LocationState {
  from?: {
    pathname: string;
  };
  action?: string;
}

export default function Auth() {
  const { login, register, user } = useAuth();
  const { saveResult } = useCarbon();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);

  const handleRedirect = useCallback(() => {
    // Check if there was a pending guest calculation to save
    const pendingCalcRaw = sessionStorage.getItem('ecotrack_pending_calculation');
    if (pendingCalcRaw) {
      try {
        const { formData, result } = JSON.parse(pendingCalcRaw);
        saveResult(formData, result);
        toast.success('Your calculation has been saved to your account!');
        sessionStorage.removeItem('ecotrack_pending_calculation');
      } catch (e) {
        console.error('Failed to restore pending calculation:', e);
      }
    }

    // Redirect to requested page or fall back to home
    const state = location.state as LocationState | null;
    const from = state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  }, [location.state, navigate, saveResult]);

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      handleRedirect();
    }
  }, [user, handleRedirect]);

  const handleSignInSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to EcoTrack!');
      handleRedirect();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (name: string, email: string, password: string) => {
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      handleRedirect();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine dynamic headers based on mode and triggered action / source path
  const headerContent = useMemo(() => {
    const state = location.state as LocationState | null;
    const action = state?.action;
    const fromPath = state?.from?.pathname;

    if (mode === 'signin') {
      if (action === 'save') {
        return {
          title: 'Save Your Results',
          subtitle: 'Sign in to save this carbon calculation to your profile.',
        };
      }
      if (action === 'insights') {
        return {
          title: 'Get AI Insights',
          subtitle: 'Sign in to unlock customized carbon-reduction advice.',
        };
      }
      if (action === 'protect' && fromPath === '/dashboard') {
        return {
          title: 'Access Dashboard',
          subtitle: 'Sign in to view your history and carbon trends.',
        };
      }
      if (action === 'protect' && fromPath === '/actions') {
        return {
          title: 'Track Green Actions',
          subtitle: 'Sign in to view and tick off your eco actions list.',
        };
      }
      if (action === 'protect' && fromPath === '/insights') {
        return {
          title: 'View AI Insights',
          subtitle: 'Sign in to access your customized carbon-reduction advice.',
        };
      }
      return {
        title: 'Welcome Back',
        subtitle: 'Sign in to access your dashboard and sync insights.',
      };
    } else {
      if (action === 'save') {
        return {
          title: 'Save Your Results',
          subtitle: 'Create an account to save this calculation to your profile.',
        };
      }
      if (action === 'insights') {
        return {
          title: 'Get AI Insights',
          subtitle: 'Create an account to unlock customized carbon-reduction advice.',
        };
      }
      if (action === 'protect' && fromPath === '/dashboard') {
        return {
          title: 'Access Dashboard',
          subtitle: 'Create an account to view your history and carbon trends.',
        };
      }
      if (action === 'protect' && fromPath === '/actions') {
        return {
          title: 'Track Green Actions',
          subtitle: 'Create an account to view and tick off your eco actions list.',
        };
      }
      if (action === 'protect' && fromPath === '/insights') {
        return {
          title: 'View AI Insights',
          subtitle: 'Create an account to access your customized carbon-reduction advice.',
        };
      }
      return {
        title: 'Create an Account',
        subtitle: 'Join EcoTrack today and start tracking your carbon footprint.',
      };
    }
  }, [mode, location.state]);

  return (
    <div className="page-wrapper min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background glow animations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md card bg-zinc-950/40 backdrop-blur-2xl border border-zinc-900 rounded-3xl p-8 relative z-10 shadow-2xl shadow-black/80 transition-all duration-300">
        
        {/* Header/Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-700 flex items-center justify-center text-zinc-950 shadow-lg shadow-green-500/20 mb-4 animate-pulse">
            <Leaf size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2 text-center">
            {headerContent.title}
          </h2>
          <p className="text-zinc-400 text-sm text-center">
            {headerContent.subtitle}
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="grid grid-cols-2 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800/80 mb-6">
          <button
            type="button"
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            onClick={() => setMode('signup')}
          >
            Register
          </button>
        </div>

        {/* Form rendering */}
        {mode === 'signin' ? (
          <SignInForm onSubmit={handleSignInSubmit} isLoading={isLoading} />
        ) : (
          <SignUpForm onSubmit={handleSignUpSubmit} isLoading={isLoading} />
        )}

        {/* Footer elements */}
        <div className="mt-8 pt-6 border-t border-zinc-900/80 flex justify-center items-center gap-2 text-xs text-zinc-500">
          <ShieldCheck size={14} className="text-green-500/60" />
          <span>Secured client-side storage</span>
        </div>
      </div>
    </div>
  );
}
