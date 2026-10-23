import React from 'react';
import { ArrowUpRight, Sparkles, Shield, Flame } from 'lucide-react';

export default function EditorialSection({ onExploreClick }) {
  return (
    <div className="bg-black text-white py-16 sm:py-24 px-4 sm:px-8 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto space-y-20">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase block mb-2">
              MOTION ARCHIVE / 001—007
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none font-serif">
              PHILOSOPHY <br />
              <span className="text-gray-400">IN MOTION.</span>
            </h2>
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Oversized by design. Crafted with 280-340 GSM super combed loopback cotton.
              Each silhouette is an immortal canvas translating ancient Sanskrit insights into underground contemporary streetwear.
            </p>
            <button
              onClick={onExploreClick}
              className="text-xs font-bold tracking-widest uppercase text-white hover:text-[#d4af37] inline-flex items-center gap-1.5 transition-colors border-b border-white hover:border-[#d4af37] pb-1"
            >
              <span>EXPLORE ALL PRODUCTS</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div>
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="text-xs font-mono tracking-widest text-gray-500 uppercase block mb-1">
              THE WEARABLE MANIFESTO
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              MORE THAN CLOTHING. <br />
              <span className="text-[#d4af37]">FASHION × PHILOSOPHY.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'PHILOSOPHY YOU CAN WEAR',
                desc: 'Ancient Upanishadic wisdom transformed into wearable contemporary expressions.'
              },
              {
                num: '02',
                title: 'RARE BY DESIGN',
                desc: 'Strictly limited runs. Once an edition is retired to the archives, it never returns.'
              },
              {
                num: '03',
                title: 'HEAVYWEIGHT DRAPE',
                desc: '280 to 340 GSM compact cotton engineered with Lycra rib collars that never stretch out.'
              },
              {
                num: '04',
                title: 'ROOTED IN BHARAT',
                desc: 'Every garment is milled, spun, cut, and printed with reverence within India.'
              }
            ].map((item) => (
              <div
                key={item.num}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/40 transition-all group"
              >
                <span className="text-2xl font-mono font-bold text-gray-600 group-hover:text-[#d4af37] transition-colors block mb-4">
                  {item.num}
                </span>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
