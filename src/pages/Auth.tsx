import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCarbon } from '../hooks/useCarbon';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Analyze password strength with useMemo to avoid synchronous setState calls in useEffect
  const { passwordStrength, passwordFeedback } = useMemo(() => {
    if (!password) {
      return { passwordStrength: 0, passwordFeedback: '' };
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[a-zA-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    const feedback = (() => {
      switch (score) {
        case 1:
          return 'Weak (Include letters, numbers, and symbols)';
        case 2:
          return 'Fair (Add numbers or symbols)';
        case 3:
          return 'Good strength';
        case 4:
          return 'Strong password!';
        default:
          return '';
      }
    })();

    return { passwordStrength: score, passwordFeedback: feedback };
  }, [password]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (mode === 'signup' && !name) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await login(email, password);
        toast.success('Welcome back to EcoTrack!');
      } else {
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await register(name, email, password);
        toast.success('Account created successfully!');
      }
      handleRedirect();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthBarColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-red-500 w-1/4';
      case 2: return 'bg-amber-500 w-2/4';
      case 3: return 'bg-yellow-400 w-3/4';
      case 4: return 'bg-green-500 w-full';
      default: return 'bg-zinc-800 w-0';
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 block ml-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <UserIcon size={18} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-zinc-900/50 hover:bg-zinc-900 focus:bg-zinc-900 border border-zinc-800 focus:border-green-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 block ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-zinc-900/50 hover:bg-zinc-900 focus:bg-zinc-900 border border-zinc-800 focus:border-green-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 block ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 hover:bg-zinc-900 focus:bg-zinc-900 border border-zinc-800 focus:border-green-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Password strength visualizer (only during signup) */}
            {mode === 'signup' && password && (
              <div className="mt-2 space-y-1 px-1">
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${getStrengthBarColor()}`} />
                </div>
                <span className="text-[10px] font-medium text-zinc-400 block">
                  {passwordFeedback}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-bold rounded-xl transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2 hover:shadow-green-500/20 active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer elements */}
        <div className="mt-8 pt-6 border-t border-zinc-900/80 flex justify-center items-center gap-2 text-xs text-zinc-500">
          <ShieldCheck size={14} className="text-green-500/60" />
          <span>Secured client-side storage</span>
        </div>
      </div>
    </div>
  );
}
