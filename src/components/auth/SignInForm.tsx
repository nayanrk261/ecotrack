/**
 * @file SignInForm.tsx
 * @description Renders the Sign In credentials input form.
 */

import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import type { SignInFormProps } from '../../types';

export default function SignInForm({ onSubmit, isLoading }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            Sign In
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
