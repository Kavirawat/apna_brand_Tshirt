import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const BRAND_VIDEOS = [
  'https://cdn.shopify.com/videos/c/o/v/2c22afc5b244465da8d5d90e73415798.mp4',
  'https://cdn.shopify.com/videos/c/o/v/461373431152412b8cceadbe914c70fa.mp4',
  'https://cdn.shopify.com/videos/c/o/v/18aee6f54d344f8ba3f668dd064e71f4.mp4',
  'https://cdn.shopify.com/videos/c/o/v/2b0af9e9eca141938913edb5e5ff0c44.mp4'
];

const VISUAL_STUDIES = [
  {
    id: 'indra',
    title: 'INDRA / WARLORD',
    video: BRAND_VIDEOS[0],
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Indraproexp1.png?v=1788422946',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Indra_ubg2.png?v=1791201700',
    number: '03 / 07',
    collectionTag: 'THE COLLECTION / 03',
    craftHeading: 'HEAVYWEIGHT.\nBUILT TO LAST.',
    craftDesc: 'Substantial cotton. Structured fit. Comfort and craftsmanship in every detail.',
    garmentType: 'OVERSIZED T-SHIRT'
  },
  {
    id: 'agni',
    title: 'AGNI / SACRED FIRE',
    video: BRAND_VIDEOS[1],
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_pro_exp_1.png?v=1788423293',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_ubg.png?v=1791201501',
    number: '04 / 07',
    collectionTag: 'THE COLLECTION / 04',
    craftHeading: 'VIBRANT ART.\nETERNAL DRAPE.',
    craftDesc: 'High-density Vedic puff printing on 280 GSM super-combed compact cotton.',
    garmentType: 'OVERSIZED T-SHIRT'
  },
  {
    id: 'prakriti',
    title: 'PRAKRITI / NATURE MATRIX',
    video: BRAND_VIDEOS[2],
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/1_b650828b-0037-4f2d-9a8d-fe604d2e872f.png?v=1791630582',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Prakriti_ubg2.png?v=1791201886',
    number: '02 / 07',
    collectionTag: 'THE COLLECTION / 02',
    craftHeading: 'DISTINCTIVE GRAPHICS.\nINTENTIONAL COLOR.',
    craftDesc: 'Soft rose hue paired with mythological Bengal tiger and lotus artwork.',
    garmentType: 'OVERSIZED T-SHIRT'
  },
  {
    id: 'niyati',
    title: 'NIYATI / TREE OF KARMA',
    video: BRAND_VIDEOS[3],
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/kaal_pro_exp.png?v=1791633682',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/kaal_pro_exp_1.png?v=1791633726',
    number: '01 / 07',
    collectionTag: 'THE COLLECTION / 01',
    craftHeading: 'ARCHITECTURAL FORM.\nDEEP REFLECTION.',
    craftDesc: '400 GSM heavyweight brushed fleece with sacred geometry and tree motifs.',
    garmentType: 'OVERSIZED HOODIE'
  },
  {
    id: 'tat-tvam-asi',
    title: 'TAT TVAM ASI / THOU ART THAT',
    video: BRAND_VIDEOS[0],
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Tat_pro_exp_3.png?v=1788420950',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Tat_pro_exp_1.png?v=1788420908',
    number: '05 / 07',
    collectionTag: 'THE COLLECTION / 05',
    craftHeading: 'ANCIENT TRUTH.\nCONTEMPORARY FIT.',
    craftDesc: 'Oversized boxy drop-shoulder cut honoring the foundational Advaita realization.',
    garmentType: 'OVERSIZED T-SHIRT'
  },
  {
    id: 'kundalini',
    title: 'KUNDALINI / CHAKRA AWAKENING',
    video: BRAND_VIDEOS[1],
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/3_51354c50-beed-4ec7-8d59-a3cabd790b62.png?v=1791985875',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Kundalini_ubg2.png?v=1791201886',
    number: '06 / 07',
    collectionTag: 'THE COLLECTION / 06',
    craftHeading: 'PRIMORDIAL SPIRIT.\nPURE CRAFTSMANSHIP.',
    craftDesc: 'Subtle off-white cotton paired with ascending serpent chakra iconography.',
    garmentType: 'OVERSIZED T-SHIRT'
  },
  {
    id: 'transcendence',
    title: 'TRANSCENDENCE / SUPREME SELF',
    video: BRAND_VIDEOS[2],
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/transs_pro_exp.png?v=1788413165',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/trans_pro_exp_1.png?v=1788413395',
    number: '07 / 07',
    collectionTag: 'THE COLLECTION / 07',
    craftHeading: 'TIMELESS MEDITATION.\nSUPREME COMFORT.',
    craftDesc: 'Pristine raw white zip hoodie with gold accents and ribbed lycra finishes.',
    garmentType: 'ZIP HOODIE'
  }
];

export default function PhilosophyInMotion({ onExploreClick, onSelectProduct }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStudy = VISUAL_STUDIES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? VISUAL_STUDIES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === VISUAL_STUDIES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#0c0d10] text-white pt-8 pb-12 px-4 sm:px-8 lg:px-14 border-b border-white/10 select-none">
      <div className="max-w-[1360px] mx-auto">

        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-gray-400 uppercase pb-4 mb-8 border-b border-white/10">
          <span>APNA BRAND</span>
          <span>MOTION ARCHIVE / 001—007</span>
        </div>

        <div className="mb-10 sm:mb-14">
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-gray-400 uppercase block mb-3">
            A STUDY IN FASHION × PHILOSOPHY
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.02]">
            PHILOSOPHY <br />
            IN MOTION.
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-4 leading-relaxed font-normal">
            A closer look at the silhouettes, artwork, and ideas behind the collection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          <div className="lg:col-span-5 flex flex-col">

            <div
              onClick={() => {
                if (onSelectProduct) {
                  onSelectProduct({
                    id: currentStudy.id,
                    title: currentStudy.title,
                    price: 5450,
                    images: [currentStudy.image, currentStudy.fallbackImage],
                    category: 'Streetwear'
                  });
                } else if (onExploreClick) {
                  onExploreClick();
                }
              }}
              className="relative aspect-square w-full rounded-2xl border border-white/10 bg-[#14161d] p-5 sm:p-6 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-2xl transition-all hover:border-white/20"
            >

              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/70 uppercase z-10">
                <span>VISUAL STUDY</span>
                <span className="text-white/50">{currentStudy.number}</span>
              </div>

              <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center">
                <video
                  key={currentStudy.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-opacity duration-700"
                >
                  <source src={currentStudy.video} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/50 pointer-events-none" />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-white/80 uppercase z-10 pt-4">
                <span className="text-white/60">APNA BRAND</span>
                <span className="group-hover:text-white transition-colors flex items-center gap-1 font-bold">
                  VIEW COLLECTION ↗
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 text-xs text-gray-400">
              <span className="font-mono text-[11px] tracking-wider text-gray-300">
                {currentStudy.number}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Previous study"
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Next study"
                >
                  <ArrowRight size={14} />
                </button>
              </div>

              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                DRAG TO EXPLORE
              </span>
            </div>

          </div>

          <div className="lg:col-span-7 flex flex-col justify-between py-2 space-y-12 sm:space-y-16">

            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-gray-400 uppercase pb-3 border-b border-white/10">
              <span>{currentStudy.collectionTag}</span>
              <span>MOTION / RIGHT</span>
            </div>

            <div className="space-y-4">
              <span className="text-[11px] font-mono tracking-widest text-gray-400 uppercase block">
                THE CRAFT
              </span>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                {currentStudy.craftHeading.split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h2>

              <p className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed pt-2 font-normal">
                {currentStudy.craftDesc}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-6 border-t border-white/10">
              <span className="font-mono text-[11px] tracking-wider text-gray-400 uppercase">
                FASHION × PHILOSOPHY
              </span>

              <button
                type="button"
                onClick={onExploreClick}
                className="text-xs font-semibold tracking-wider uppercase text-white hover:text-gray-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer border-b border-white/40 hover:border-white pb-0.5"
              >
                <span>EXPLORE ALL PRODUCTS</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

          </div>

        </div>

        <div className="text-right text-[11px] font-mono tracking-widest text-gray-500 uppercase pt-10 mt-6 border-t border-white/10">
          MADE IN BHARAT. WORN EVERYWHERE.
        </div>

      </div>
    </section>
  );
}
