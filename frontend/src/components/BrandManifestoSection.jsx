import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function BrandManifestoSection({ onDiscoverClick }) {
  return (
    <section className="w-full bg-[#122731] text-white py-16 sm:py-24 px-4 sm:px-8 lg:px-14 border-t border-[#224b5c] select-none">
      <div className="max-w-[1360px] mx-auto">

        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-gray-400 uppercase pb-4 mb-8 border-b border-white/10">
          <span className="text-[#f0aa93] font-bold">APNA BRAND</span>
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
                  <text className="text-[11.5px] font-mono font-bold tracking-[0.28em] fill-white uppercase">
                    <textPath href="#circleTextPath" startOffset="0%">
                      FASHION × PHILOSOPHY • MADE IN BHARAT • WORN EVERYWHERE •
                    </textPath>
                  </text>
                </svg>
              </div>

              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#163643] border border-[#234f60] shadow-2xl flex flex-col items-center justify-center p-3 text-center transition-transform duration-500 group-hover:scale-105">
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#f0aa93] uppercase block mb-1">
                  APNA BRAND
                </span>

                <div className="w-9 h-9 rounded-full bg-[#f0aa93] text-[#122832] flex items-center justify-center my-1 text-sm font-black shadow-md">
                  ✕
                </div>

                <span className="text-[8px] font-mono tracking-widest text-gray-300 uppercase block mt-1">
                  EST. IN THOUGHT
                </span>
              </div>

            </div>
          </div>

          <div className="md:col-span-7 space-y-6 sm:pl-6">

            <span className="text-[11px] font-mono tracking-widest text-[#f0aa93] uppercase block font-semibold">
              APNA BRAND / EST. IN THOUGHT
            </span>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.98]">
              FASHION × <br />
              PHILOSOPHY.
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-normal">
              Indian thought. Contemporary expression. Heavyweight luxury streetwear with an authentic cultural identity of its own.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={onDiscoverClick}
                className="text-xs font-bold uppercase tracking-wider text-[#f0aa93] border-b-2 border-[#f0aa93] pb-1 hover:text-white hover:border-white transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>DISCOVER THE COLLECTION</span>
                <ArrowUpRight size={15} />
              </button>
            </div>

          </div>

        </div>

        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-gray-400 uppercase pt-8 border-t border-white/10">
          <button
            type="button"
            onClick={onDiscoverClick}
            className="hover:text-[#f0aa93] transition-colors cursor-pointer"
          >
            MADE IN BHARAT. ↗
          </button>
          <span>WORN EVERYWHERE.</span>
        </div>

      </div>
    </section>
  );
}
