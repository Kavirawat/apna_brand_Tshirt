import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const FOUR_PILLARS = [
  {
    pillarNum: '01',
    categoryTag: '01 / PHILOSOPHY',
    bottomCardTag: 'INDIAN THOUGHT / MODERN STREETWEAR',
    cardBg: 'bg-[#18191f] border border-white/10',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/kaal_pro_exp.png?v=1791633682',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/kaal_pro_exp_1.png?v=1791633726',
    numberTitle: '01 • THE IDEA',
    heading: 'PHILOSOPHY YOU CAN WEAR.',
    desc: 'Ancient Indian thought, expressed through modern streetwear.',
    footerTag: 'ROOTED IN THOUGHT. ↗'
  },
  {
    pillarNum: '02',
    categoryTag: '02 / EXPRESSION',
    bottomCardTag: 'ARTWORK / EXPRESSION',
    cardBg: 'bg-gradient-to-b from-[#2a1318] to-[#18080d] border border-white/10',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/1_b650828b-0037-4f2d-9a8d-fe604d2e872f.png?v=1791630582',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/2_ec01ce4b-a2a4-450e-a42c-628b09d87958.png?v=1791630580',
    numberTitle: '02 • THE EXPRESSION',
    heading: 'RARE BY DESIGN.',
    desc: 'Distinctive graphics inspired by philosophy, art and cultural identity.',
    footerTag: 'ART WITH INTENTION. ↗'
  },
  {
    pillarNum: '03',
    categoryTag: '03 / CONSTRUCTION',
    bottomCardTag: 'FABRIC / FIT / FORM',
    cardBg: 'bg-gradient-to-b from-[#101c29] to-[#080d14] border border-white/10',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Indraproexp1.png?v=1788422946',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Indra_ubg2.png?v=1791201700',
    numberTitle: '03 • THE BUILD',
    heading: 'HEAVYWEIGHT. BY DESIGN.',
    desc: 'Substantial cotton, structured silhouettes and a distinctive oversized fit.',
    footerTag: 'BUILT FOR COMFORT. ↗'
  },
  {
    pillarNum: '04',
    categoryTag: '04 / ORIGIN',
    bottomCardTag: 'FROM BHARAT / FOR THE WORLD',
    cardBg: 'bg-gradient-to-b from-[#330b12] to-[#180306] border border-white/10',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_pro_exp_1.png?v=1788423293',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_ubg.png?v=1791201501',
    numberTitle: '04 • THE ORIGIN',
    heading: 'ROOTED IN BHARAT.',
    desc: 'Indian culture at the foundation of a modern streetwear label created for the world.',
    footerTag: 'MADE IN BHARAT. ↗'
  }
];

export default function MoreThanClothingSection({ onExploreClick }) {
  return (
    <section className="bg-[#0c0d10] text-white py-16 sm:py-24 px-4 sm:px-8 lg:px-14 border-t border-white/10 select-none">
      <div className="max-w-[1360px] mx-auto">

        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-gray-400 uppercase pb-4 mb-6 border-b border-white/10">
          <span>APNA BRAND</span>
          <span>OUR IDENTITY / 01–04</span>
        </div>

        <div className="mb-10 sm:mb-14">
          <span className="text-[11px] font-mono tracking-widest text-gray-400 uppercase block mb-3">
            BEYOND THE GARMENT
          </span>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
            MORE THAN <br />
            <span className="text-gray-500">CLOTHING.</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-4 leading-relaxed font-normal">
            Indian philosophy, original artwork and contemporary streetwear.
          </p>
        </div>

        <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-4">
          THE FOUR PILLARS
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUR_PILLARS.map((pillar) => (
            <div
              key={pillar.pillarNum}
              onClick={onExploreClick}
              className="flex flex-col group cursor-pointer"
            >

              <div className={`relative aspect-[4/5] w-full rounded-2xl overflow-hidden p-3.5 flex flex-col justify-between shadow-lg ${pillar.cardBg} transition-all duration-300 group-hover:border-white/25`}>

                <div className="text-[9px] font-mono tracking-widest text-white/80 uppercase z-10 drop-shadow-xs">
                  {pillar.categoryTag}
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.heading}
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      if (pillar.fallbackImage && e.currentTarget.src !== pillar.fallbackImage) {
                        e.currentTarget.src = pillar.fallbackImage;
                      }
                    }}
                  />
                </div>

                <div className="text-[9px] font-mono tracking-wider text-white/90 uppercase z-10 drop-shadow-xs pt-2">
                  {pillar.bottomCardTag}
                </div>
              </div>

              <div className="pt-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase block">
                    {pillar.numberTitle}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold uppercase text-white tracking-tight mt-1 leading-snug">
                    {pillar.heading}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 font-normal leading-relaxed mt-1">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-2 text-[10px] font-bold uppercase tracking-wider text-white group-hover:underline flex items-center gap-1">
                  <span>{pillar.footerTag}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-10 mt-10 border-t border-white/10">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block">
              FASHION × PHILOSOPHY
            </span>
            <span className="text-xs text-gray-400 font-normal">
              A different expression of Indian streetwear.
            </span>
          </div>

          <button
            type="button"
            onClick={onExploreClick}
            className="px-5 py-2.5 rounded bg-white hover:bg-gray-200 text-black text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <span>EXPLORE THE COLLECTION</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}
