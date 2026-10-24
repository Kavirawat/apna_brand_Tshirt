import React from 'react';
import { ArrowUpRight } from 'lucide-react';

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
  return (
    <section className="bg-white text-black py-16 sm:py-24 px-4 sm:px-8 lg:px-14 border-t border-gray-200 select-none">
      <div className="max-w-[1360px] mx-auto">

        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-gray-500 uppercase pb-4 mb-6 border-b border-gray-200">
          <span className="font-bold text-black">APNA BRAND</span>
          <span>OUR IDENTITY / 01–04</span>
        </div>

        <div className="mb-10 sm:mb-14">
          <span className="text-[11px] font-mono tracking-widest text-gray-500 uppercase block mb-3 font-semibold">
            BEYOND THE GARMENT
          </span>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-none">
            MORE THAN <br />
            <span className="text-gray-400">CLOTHING.</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-700 max-w-xl mt-4 leading-relaxed font-normal">
            Indian philosophy, original sacred artwork and contemporary oversized luxury streetwear.
          </p>
        </div>

        <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-4 font-bold">
          THE FOUR PILLARS
        </div>

        {/* 4 Pillars Grid: White Card Background + Black Font */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {FOUR_PILLARS.map((pillar) => (
            <div
              key={pillar.pillarNum}
              onClick={onExploreClick}
              className="flex flex-col group cursor-pointer rounded-3xl bg-white border border-gray-200 shadow-xl hover:-translate-y-3 hover:shadow-2xl transition-all duration-500 overflow-hidden justify-between"
            >

              {/* Upper Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">

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

              {/* Lower Details: Black Font */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase block font-bold">
                    {pillar.numberTitle}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold uppercase text-black tracking-tight mt-1 leading-snug group-hover:text-gray-600 transition-colors">
                    {pillar.heading}
                  </h4>
                  <p className="text-xs text-gray-600 font-normal leading-relaxed mt-1.5">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 text-[11px] font-bold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform flex items-center justify-between">
                  <span>{pillar.footerTag}</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-10 mt-12 border-t border-gray-200">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block font-bold">
              FASHION × PHILOSOPHY
            </span>
            <span className="text-xs text-gray-700 font-normal">
              A distinctive expression of Indian philosophy & luxury streetwear.
            </span>
          </div>

          <button
            type="button"
            onClick={onExploreClick}
            className="px-6 py-3 rounded-full bg-[#122832] hover:bg-black text-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
          >
            <span>EXPLORE THE COLLECTION</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}
