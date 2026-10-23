import React from 'react';
import { ArrowDown, Flame, Shield, Sparkles, Compass } from 'lucide-react';
import { useThemeColor } from '../context/ThemeColorContext';

export default function Hero({ onExploreClick, onBestsellerClick }) {
  const { currentColor } = useThemeColor();

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16">

      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: currentColor.bgGradient
        }}
      />

      <div
        className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-1000"
        style={{
          backgroundColor: currentColor.accent
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] select-none pointer-events-none overflow-hidden">
        <span className="font-sanskrit text-[18vw] leading-none whitespace-nowrap text-white">
          अहं ब्रह्मास्मि
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">

        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-xs tracking-[0.25em] uppercase text-gray-300 mb-6 transition-all duration-500 shadow-lg"
          style={{ borderColor: currentColor.borderGlow }}
        >
          <Sparkles size={14} className="text-[#d4af37]" />
          <span>{currentColor.tagline || 'INDIAN PHILOSOPHY STREETWEAR'}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.05] drop-shadow-2xl">
          WEAR YOUR <br />
          <span className="text-gold-gradient underline decoration-white/20 underline-offset-8">
            DHARMA
          </span>
        </h1>

        <p className="font-sanskrit text-lg sm:text-2xl text-gray-300 mt-4 tracking-widest">
          सर्वं खल्विदं ब्रह्म • ALL THIS IS BRAHMAN
        </p>

        <p className="mt-5 max-w-2xl text-sm sm:text-base text-gray-400 font-normal leading-relaxed">
          Oversized, drop-shoulder silhouettes engineered with 280–340 GSM luxury French Terry.
          Where ancient Vedic non-duality meets modern underground street fashion.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold tracking-[0.15em] text-xs uppercase bg-[#d4af37] text-black hover:bg-yellow-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowDown size={16} className="transition-transform group-hover:translate-y-1" />
          </button>

          <button
            onClick={onBestsellerClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold tracking-[0.15em] text-xs uppercase bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>SACRED BESTSELLERS</span>
          </button>
        </div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left sm:text-center w-full max-w-4xl pt-8 border-t border-white/10 text-gray-400 text-xs">
          <div className="flex items-center sm:justify-center gap-2">
            <Shield size={16} className="text-[#d4af37] flex-shrink-0" />
            <span>280-340 GSM Terry</span>
          </div>
          <div className="flex items-center sm:justify-center gap-2">
            <Flame size={16} className="text-[#d4af37] flex-shrink-0" />
            <span>Bio-Washed & Pre-Shrunk</span>
          </div>
          <div className="flex items-center sm:justify-center gap-2">
            <Compass size={16} className="text-[#d4af37] flex-shrink-0" />
            <span>Boxy Drop-Shoulder</span>
          </div>
          <div className="flex items-center sm:justify-center gap-2">
            <Sparkles size={16} className="text-[#d4af37] flex-shrink-0" />
            <span>Crafted in Bharat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
