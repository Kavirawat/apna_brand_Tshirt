import React, { useState, useEffect } from 'react';
import { Clock, Flame, Lock, ShieldAlert, Sparkles } from 'lucide-react';

export function useCountdown(targetDateString) {
  const calculateTimeLeft = () => {
    if (!targetDateString) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
    const difference = new Date(targetDateString).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateString]);

  return timeLeft;
}

export default function DropCountdown({ expiresAt, totalUnits = 50, remainingUnits = 14, isLight = false }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(expiresAt);

  const stockPercent = Math.min(100, Math.max(0, Math.round(((totalUnits - remainingUnits) / totalUnits) * 100)));

  if ((expiresAt && isExpired) || (remainingUnits !== undefined && remainingUnits <= 0)) {
    return (
      <div className={`p-4 rounded-xl border ${
        isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-950/40 border-red-800/40 text-red-200'
      }`}>
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
          <Lock size={15} className="text-red-400" />
          <span>LIMITED DROP HAS EXPIRED • VAULT LOCKED</span>
        </div>
        <p className="text-[11px] opacity-80 leading-relaxed">
          This piece was a strictly time-limited drop. The archive is closed. New stocks will launch in the next drop cycle.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isLight
        ? 'bg-black/5 border-black/15 text-[#121212]'
        : 'bg-white/5 border-white/10 text-white'
    }`}>

      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500">
          <Flame size={15} className="animate-pulse" />
          <span>LIMITED DROP CLOSES IN:</span>
        </span>
        <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-red-600/10 text-red-500 border border-red-500/20">
          EXPIRES SOON
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center mb-3.5">
        <div className={`p-2 rounded-lg border ${isLight ? 'bg-white border-black/10' : 'bg-black/40 border-white/10'}`}>
          <span className="text-base sm:text-lg font-black font-mono block leading-none">{String(days).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mt-1 block">Days</span>
        </div>
        <div className={`p-2 rounded-lg border ${isLight ? 'bg-white border-black/10' : 'bg-black/40 border-white/10'}`}>
          <span className="text-base sm:text-lg font-black font-mono block leading-none">{String(hours).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mt-1 block">Hours</span>
        </div>
        <div className={`p-2 rounded-lg border ${isLight ? 'bg-white border-black/10' : 'bg-black/40 border-white/10'}`}>
          <span className="text-base sm:text-lg font-black font-mono block leading-none">{String(minutes).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mt-1 block">Mins</span>
        </div>
        <div className={`p-2 rounded-lg border ${isLight ? 'bg-white border-black/10' : 'bg-black/40 border-white/10'}`}>
          <span className="text-base sm:text-lg font-black font-mono block leading-none text-red-500">{String(seconds).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mt-1 block">Secs</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
          <span className="text-gray-400">Limited Stock:</span>
          <span className="font-mono text-red-500 font-bold">Only {remainingUnits} of {totalUnits} left</span>
        </div>
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-black/10' : 'bg-white/10'}`}>
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full transition-all duration-700"
            style={{ width: `${stockPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
