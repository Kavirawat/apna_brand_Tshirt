import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useThemeColor } from '../context/ThemeColorContext';

const FOUR_PILLARS = [
  {
    pillarNum: '01',
    categoryTag: '01 / PHILOSOPHY',
    bottomCardTag: 'INDIAN THOUGHT / MODERN STREETWEAR',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/kaal_pro_exp.png?v=1791633682',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/kaal_pro_exp_1.png?v=1791633726',
    numberTitle: '01 • THE IDEA',
    heading: 'PHILOSOPHY YOU CAN WEAR.',
    desc: 'Ancient Indian thought, expressed through modern heavyweight streetwear.',
    footerTag: 'ROOTED IN THOUGHT ↗'
  },
  {
    pillarNum: '02',
    categoryTag: '02 / EXPRESSION',
    bottomCardTag: 'ARTWORK / EXPRESSION',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/1_b650828b-0037-4f2d-9a8d-fe604d2e872f.png?v=1791630582',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/2_ec01ce4b-a2a4-450e-a42c-628b09d87958.png?v=1791630580',
    numberTitle: '02 • THE EXPRESSION',
    heading: 'RARE BY DESIGN.',
    desc: 'Distinctive graphics inspired by Vedic philosophy, sacred geometry and cultural identity.',
    footerTag: 'ART WITH INTENTION ↗'
  },
  {
    pillarNum: '03',
    categoryTag: '03 / CONSTRUCTION',
    bottomCardTag: 'FABRIC / FIT / FORM',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Indraproexp1.png?v=1788422946',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Indra_ubg2.png?v=1791201700',
    numberTitle: '03 • THE BUILD',
    heading: 'HEAVYWEIGHT. BY DESIGN.',
    desc: 'Substantial 280-340 GSM cotton, structured silhouettes and drop-shoulder boxy fit.',
    footerTag: 'BUILT FOR COMFORT ↗'
  },
  {
    pillarNum: '04',
    categoryTag: '04 / ORIGIN',
    bottomCardTag: 'FROM BHARAT / FOR THE WORLD',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_pro_exp_1.png?v=1788423293',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_ubg.png?v=1791201501',
    numberTitle: '04 • THE ORIGIN',
    heading: 'ROOTED IN BHARAT.',
    desc: 'Indian culture at the foundation of a modern luxury streetwear label created for the world.',
    footerTag: 'MADE IN BHARAT ↗'
  }
];

export default function MoreThanClothingSection({ onExploreClick }) {
  const { themeMode = 'dark' } = useThemeColor?.() || {};
  const isLight = themeMode === 'light';

  return (
    <section className={`py-16 sm:py-24 px-4 sm:px-8 lg:px-14 select-none border-t transition-colors duration-300 ${
      isLight
        ? 'bg-[#122832] text-white border-[#224b5c]'
        : 'bg-white text-black border-gray-200'
    }`}>
      <div className="max-w-[1360px] mx-auto">

        <div className={`flex items-center justify-between text-[11px] font-mono tracking-widest uppercase pb-4 mb-6 border-b ${
          isLight ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-500'
        }`}>
          <span className={`font-bold ${isLight ? 'text-white' : 'text-black'}`}>APNA BRAND</span>
          <span>OUR IDENTITY / 01–04</span>
        </div>

        <div className="mb-10 sm:mb-14">
          <span className={`text-[11px] font-mono tracking-widest uppercase block mb-3 font-semibold ${
            isLight ? 'text-gray-400' : 'text-gray-500'
          }`}>
            BEYOND THE GARMENT
          </span>

          <h2 className={`text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none ${
            isLight ? 'text-white' : 'text-black'
          }`}>
            MORE THAN <br />
            <span className={isLight ? 'text-gray-400' : 'text-gray-400'}>CLOTHING.</span>
          </h2>

          <p className={`text-xs sm:text-sm max-w-xl mt-4 leading-relaxed font-normal ${
            isLight ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Indian philosophy, original sacred artwork and contemporary oversized luxury streetwear.
          </p>
        </div>

        <div className={`text-[10px] font-mono tracking-widest uppercase mb-4 font-bold ${
          isLight ? 'text-gray-400' : 'text-gray-500'
        }`}>
          THE FOUR PILLARS
        </div>

        {/* 4 Pillars Grid: Inverted contrast for perfect theme rhythm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {FOUR_PILLARS.map((pillar) => (
            <div
              key={pillar.pillarNum}
              onClick={onExploreClick}
              className={`flex flex-col group cursor-pointer rounded-3xl border shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden justify-between ${
                isLight
                  ? 'bg-white border-gray-200 text-gray-900 hover:border-[#f0aa93] hover:shadow-2xl'
                  : 'bg-[#163643] border-[#224b5c] text-white hover:shadow-[0_20px_45px_rgba(18,39,49,0.35)] hover:border-[#f0aa93]'
              }`}
            >

              {/* Upper Image Container */}
              <div className={`relative aspect-[4/5] w-full overflow-hidden ${
                isLight ? 'bg-gray-100' : 'bg-[#122731]'
              }`}>

                <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-mono tracking-widest text-white uppercase font-bold">
                  {pillar.categoryTag}
                </div>

                <img
                  src={pillar.image}
                  alt={pillar.heading}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    if (pillar.fallbackImage && e.currentTarget.src !== pillar.fallbackImage) {
                      e.currentTarget.src = pillar.fallbackImage;
                    }
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10">
                  <span className="text-[9px] font-mono tracking-wider text-gray-200 uppercase block font-semibold">
                    {pillar.bottomCardTag}
                  </span>
                </div>
              </div>

              {/* Lower Details */}
              <div className={`p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 ${
                isLight ? 'bg-white' : 'bg-[#163643]'
              }`}>
                <div>
                  <span className={`text-[10px] font-mono tracking-wider uppercase block font-bold ${
                    isLight ? 'text-[#122731]' : 'text-[#f0aa93]'
                  }`}>
                    {pillar.numberTitle}
                  </span>
                  <h4 className={`text-sm sm:text-base font-bold uppercase tracking-tight mt-1 leading-snug transition-colors ${
                    isLight
                      ? 'text-gray-900 group-hover:text-[#122731]'
                      : 'text-white group-hover:text-[#f0aa93]'
                  }`}>
                    {pillar.heading}
                  </h4>
                  <p className={`text-xs font-normal leading-relaxed mt-1.5 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {pillar.desc}
                  </p>
                </div>

                <div className={`pt-2 border-t text-[11px] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center justify-between ${
                  isLight
                    ? 'border-gray-100 text-[#122731]'
                    : 'border-[#224b5c] text-[#f0aa93]'
                }`}>
                  <span>{pillar.footerTag}</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-10 mt-12 border-t ${
          isLight ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div>
            <span className={`text-[10px] font-mono tracking-widest uppercase block font-bold ${
              isLight ? 'text-gray-400' : 'text-gray-500'
            }`}>
              FASHION × PHILOSOPHY
            </span>
            <span className={`text-xs font-normal ${
              isLight ? 'text-gray-300' : 'text-gray-700'
            }`}>
              A distinctive expression of Indian philosophy & luxury streetwear.
            </span>
          </div>

          <button
            type="button"
            onClick={onExploreClick}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 ${
              isLight
                ? 'bg-white hover:bg-gray-100 text-[#122832]'
                : 'bg-[#122832] hover:bg-black text-white'
            }`}
          >
            <span>EXPLORE THE COLLECTION</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}
