import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useThemeColor } from '../context/ThemeColorContext';

export default function BrandManifestoSection({ onDiscoverClick }) {
  const { themeMode = 'dark' } = useThemeColor?.() || {};
  const isLight = themeMode === 'light';

  return (
    <section className={`w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-14 border-t select-none transition-colors duration-300 ${
      isLight
        ? 'bg-white text-gray-900 border-gray-200'
        : 'bg-[#122832] text-white border-[#224b5c]'
    }`}>
      <div className="max-w-[1360px] mx-auto">

        <div className={`flex items-center justify-between text-[11px] font-mono tracking-widest uppercase pb-4 mb-8 border-b ${
          isLight ? 'border-gray-200 text-gray-500' : 'border-white/10 text-gray-400'
        }`}>
          <span className={`font-bold ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`}>APNA BRAND</span>
          <span>FASHION × PHILOSOPHY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center my-8 sm:my-16">

          <div className="md:col-span-5 flex items-center justify-center py-6">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center group cursor-pointer">

              <div className="absolute inset-0 animate-[spin_25s_linear_infinite] group-hover:[animation-play-state:paused] transition-all">
                <svg className="w-full h-full" viewBox="0 0 300 300">
                  <defs>
                    <path
                      id="circleTextPath"
                      d="M 150, 150 m -115, 0 a 115,115 0 1,1 230,0 a 115,115 0 1,1 -230,0"
                    />
                  </defs>
                  <text className={`text-[11.5px] font-mono font-bold tracking-[0.28em] uppercase ${
                    isLight ? 'fill-gray-900' : 'fill-white'
                  }`}>
                    <textPath href="#circleTextPath" startOffset="0%">
                      FASHION × PHILOSOPHY • MADE IN BHARAT • WORN EVERYWHERE •
                    </textPath>
                  </text>
                </svg>
              </div>

              <div className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full border shadow-2xl flex flex-col items-center justify-center p-3 text-center transition-transform duration-500 group-hover:scale-105 ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#163643] border-[#234f60]'
              }`}>
                <span className={`text-[9px] font-mono font-bold tracking-widest uppercase block mb-1 ${
                  isLight ? 'text-[#122731]' : 'text-[#f0aa93]'
                }`}>
                  APNA BRAND
                </span>

                <div className="w-9 h-9 rounded-full bg-[#f0aa93] text-[#122832] flex items-center justify-center my-1 text-sm font-black shadow-md">
                  ✕
                </div>

                <span className={`text-[8px] font-mono tracking-widest uppercase block mt-1 ${
                  isLight ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  EST. IN THOUGHT
                </span>
              </div>

            </div>
          </div>

          <div className="md:col-span-7 space-y-6 sm:pl-6">

            <span className={`text-[11px] font-mono tracking-widest uppercase block font-semibold ${
              isLight ? 'text-[#122731]' : 'text-[#f0aa93]'
            }`}>
              APNA BRAND / EST. IN THOUGHT
            </span>

            <h2 className={`text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.98] ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}>
              FASHION × <br />
              PHILOSOPHY.
            </h2>

            <p className={`text-xs sm:text-sm max-w-lg leading-relaxed font-normal ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Indian thought. Contemporary expression. Heavyweight luxury streetwear with an authentic cultural identity of its own.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={onDiscoverClick}
                className={`text-xs font-bold uppercase tracking-wider border-b-2 pb-1 transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                  isLight
                    ? 'text-[#122731] border-[#122731] hover:text-black hover:border-black'
                    : 'text-[#f0aa93] border-[#f0aa93] hover:text-white hover:border-white'
                }`}
              >
                <span>DISCOVER THE COLLECTION</span>
                <ArrowUpRight size={15} />
              </button>
            </div>

          </div>

        </div>

        <div className={`flex items-center justify-between text-[11px] font-mono tracking-widest uppercase pt-8 border-t ${
          isLight ? 'border-gray-200 text-gray-500' : 'border-white/10 text-gray-400'
        }`}>
          <button
            type="button"
            onClick={onDiscoverClick}
            className={`transition-colors cursor-pointer ${
              isLight ? 'hover:text-[#122731]' : 'hover:text-[#f0aa93]'
            }`}
          >
            MADE IN BHARAT. ↗
          </button>
          <span>WORN EVERYWHERE.</span>
        </div>

      </div>
    </section>
  );
}
