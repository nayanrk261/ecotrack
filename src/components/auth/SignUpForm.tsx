/**
 * @file SignUpForm.tsx
 * @description Renders the registration form with email/password collection and password strength visualizer metrics.
 */

import { useState, useMemo } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import type { SignUpFormProps } from '../../types';

export default function SignUpForm({ onSubmit, isLoading }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Password strength visualizer calculation logic
  const { passwordStrength, passwordFeedback } = useMemo(() => {
    if (!password) {
      return { passwordStrength: 0, passwordFeedback: '' };
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[a-zA-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // standard character checks

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

  const getStrengthBarColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-red-500 w-1/4';
      case 2: return 'bg-amber-500 w-2/4';
      case 3: return 'bg-yellow-400 w-3/4';
      case 4: return 'bg-green-500 w-full';
      default: return 'bg-zinc-800 w-0';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

        {password && (
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
        disabled={isLoading}
        className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-bold rounded-xl transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2 hover:shadow-green-500/20 active:scale-[0.98]"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Create Account
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
