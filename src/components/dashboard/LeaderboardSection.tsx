/**
 * @file LeaderboardSection.tsx
 * @description Computes social rankings and displays the friends carbon footprint comparison table.
 */

import { useMemo } from 'react';
import { Users } from 'lucide-react';
import type { LeaderboardSectionProps } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const LEADERBOARD_DEMO = [
  { name: 'Aditya Sharma', footprint: 120.5, avatarBg: 'from-emerald-400 to-teal-600 text-slate-950' },
  { name: 'Priya Patel', footprint: 145.2, avatarBg: 'from-cyan-400 to-blue-600 text-slate-950' },
  { name: 'You', footprint: 0, avatarBg: 'from-green-400 to-emerald-600 text-slate-950', isUser: true },
  { name: 'Rahul Verma', footprint: 210.0, avatarBg: 'from-amber-400 to-orange-600 text-slate-950' },
  { name: 'Sneha Reddy', footprint: 320.8, avatarBg: 'from-pink-500 to-rose-600 text-white' },
];

export default function LeaderboardSection({ userFootprint }: LeaderboardSectionProps) {
  const { locale, t } = useLanguage();

  const sortedLeaderboard = useMemo(() => {
    return LEADERBOARD_DEMO.map((friend) => {
      if (friend.isUser) {
        return { ...friend, footprint: userFootprint };
      }
      return friend;
    })
      .sort((a, b) => a.footprint - b.footprint)
      .map((friend, idx) => ({ ...friend, rank: idx + 1 }));
  }, [userFootprint]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="card-title mb-0 flex items-center gap-2">
          <Users size={18} className="text-green-500" />
          {t('compareFriends')}
        </h3>
        <span className="text-[10px] font-bold tracking-wider uppercase bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-800">
          {locale === 'en' ? 'Demo Data' : 'डेमो डेटा'}
        </span>
      </div>
      <div className="space-y-3">
        {sortedLeaderboard.map((friend) => (
          <div
            key={friend.name}
            className={`flex items-center justify-between p-2.5 rounded-xl border ${
              friend.isUser
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-zinc-900/30 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 text-center text-sm font-bold ${
                  friend.rank === 1
                    ? 'text-yellow-400'
                    : friend.rank === 2
                    ? 'text-zinc-400'
                    : friend.rank === 3
                    ? 'text-amber-600'
                    : 'text-zinc-500'
                }`}
              >
                #{friend.rank}
              </span>
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-tr ${friend.avatarBg} flex items-center justify-center font-bold text-xs shadow-sm`}
              >
                {friend.name[0]}
              </div>
              <span className={`text-sm font-bold ${friend.isUser ? 'text-green-400' : 'text-zinc-400'}`}>
                {friend.name} {friend.isUser && `(${locale === 'en' ? 'You' : 'आप'})`}
              </span>
            </div>
            <span className="text-sm font-semibold text-zinc-400">
              {friend.footprint.toFixed(1)} {locale === 'en' ? 'kg/mo' : 'किग्रा/माह'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
