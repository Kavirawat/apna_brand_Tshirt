import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Tag, Copy, Check, Sparkles, Flame, Percent } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PROMO_BANNERS = [
  {
    id: 'banner-1',
    badge: 'LIMITED FESTIVE DROP • 30% SAVINGS',
    headline: 'FLAT 30% OFF',
    subheadline: 'ON ALL SACRED OVERSIZED T-SHIRTS',
    description: 'Ancient Indian philosophy woven into high-tier Indian streetwear. 280 GSM super-combed compact cotton with puff print details.',
    couponCode: 'DHARM30',
    discount: '30% OFF',
    tagline: 'WEAR YOUR DHARMA',
    themeBg: 'radial-gradient(ellipse at 50% 20%, #3a151b 0%, #1c0a0e 60%, #0c0507 100%)',
    accentColor: '#e63946',
    featuredProduct: {
      id: 15406667038794,
      title: 'KUNDALINI / कुण्डलिनी',
      category: 'Oversized T-Shirts',
      price: 5450,
      originalPrice: 7785,
      image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Kundalini_ubg2.png?v=1791201886',
      cardBg: '#ffffff',
      darkCard: false
    },
    secondaryProduct: {
      id: 15406666711114,
      title: 'INDRA / इंद्र',
      category: 'Oversized T-Shirts',
      price: 5450,
      image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Indraproexp1.png?v=1788422946',
      cardBg: '#0e343d',
      darkCard: true
    }
  },
  {
    id: 'banner-2',
    badge: 'EXCLUSIVE VAULT UNLOCK • 30% DISCOUNT',
    headline: 'BUY ANY 2 — GET 30% OFF',
    subheadline: 'LIMITED RUN OF 50 PIECES PER DROP',
    description: 'High-density Vedic puff printing on bio-washed, pre-shrunk heavyweight cotton. Ribbed lycra collar retaining structure for 50+ washes.',
    couponCode: 'APNA30',
    discount: '30% OFF',
    tagline: 'TAT TVAM ASI & PARSHURAM',
    themeBg: 'radial-gradient(ellipse at 50% 20%, #152c38 0%, #0a161e 60%, #04080b 100%)',
    accentColor: '#38bdf8',
    featuredProduct: {
      id: 15406666776650,
      title: 'TAT TVAM ASI / तत् त्वम् असि',
      category: 'Oversized T-Shirts',
      price: 5450,
      originalPrice: 7785,
      image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/45.png?v=1789397586',
      cardBg: '#38181d',
      darkCard: true
    },
    secondaryProduct: {
      id: 15406666645578,
      title: 'PARSHURAM / परशुराम',
      category: 'Oversized T-Shirts',
      price: 5450,
      image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/parshuproexp.png?v=1788421632',
      cardBg: '#25262a',
      darkCard: true
    }
  },
  {
    id: 'banner-3',
    badge: 'HEAVYWEIGHT LUXURY FLEECE • 30% OFF',
    headline: '30% OFF HOODIES & SWEATSHIRTS',
    subheadline: '340—400 GSM BRUSHED COTTON TERRY',
    description: 'Architectural streetwear form inspired by non-dual meditation. Pure sacred luxury engineered for the winter cold.',
    couponCode: 'OFF30',
    discount: '30% OFF',
    tagline: 'SACRED WINTER DROP',
    themeBg: 'radial-gradient(ellipse at 50% 20%, #2e1a28 0%, #170c14 60%, #0a0408 100%)',
    accentColor: '#d4af37',
    featuredProduct: {
      id: 15406667661386,
      title: 'MAYA / माया SWEATSHIRT',
      category: 'Oversized Sweatshirts',
      price: 6450,
      originalPrice: 9214,
      image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/55_14772461-f8e1-41f4-868d-2e8988329195.png?v=1791192979',
      cardBg: '#3a1e27',
      darkCard: true
    },
    secondaryProduct: {
      id: 15406667595850,
      title: 'BODHI / बोधि SWEATSHIRT',
      category: 'Oversized Sweatshirts',
      price: 6450,
      image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/bodhi_pro_exp.png?v=1788417381',
      cardBg: '#1f2026',
      darkCard: true
    }
  }
];

export default function PhilosophyInMotion({ onExploreClick, onSelectProduct }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { applyCoupon } = useCart();

  const activeBanner = PROMO_BANNERS[currentSlide];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    applyCoupon(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? PROMO_BANNERS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % PROMO_BANNERS.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-[#0b0c10] text-white pt-10 pb-14 px-4 sm:px-8 lg:px-14 border-b border-white/10 select-none overflow-hidden"
    >
      <div className="max-w-[1380px] mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono tracking-widest text-gray-400 uppercase pb-4 mb-8 border-b border-white/10 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-bold">APNA BRAND • SACRED FESTIVE SALE</span>
          </div>
          <span className="text-[#d4af37]">FLAT 30% OFF ACTIVE SITEWIDE</span>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-white/15 p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-700"
          style={{ background: activeBanner.themeBg }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

            <div className="lg:col-span-7 space-y-6">

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase">
                <Flame size={14} className="text-red-500 fill-red-500" />
                <span>{activeBanner.badge}</span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.02]">
                  {activeBanner.headline}
                </h1>
                <p className="text-lg sm:text-2xl font-bold uppercase tracking-wide text-[#d4af37] mt-2 font-serif">
                  {activeBanner.subheadline}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed font-normal">
                {activeBanner.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-black/60 backdrop-blur-md border border-[#d4af37]/40 rounded-2xl p-1.5 pl-4 shadow-xl">
                  <div className="flex flex-col pr-3">
                    <span className="text-[9px] font-mono tracking-wider text-gray-400 uppercase">
                      COUPON CODE
                    </span>
                    <span className="font-mono text-base font-black tracking-widest text-[#d4af37]">
                      {activeBanner.couponCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(activeBanner.couponCode)}
                    className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
                  >
                    {copiedCode ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        <span>APPLIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>COPY & APPLY</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onExploreClick}
                  className="px-6 py-3.5 rounded-2xl bg-white text-black hover:bg-gray-200 transition-all text-xs font-black tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer shadow-xl hover:scale-[1.02] active:scale-95"
                >
                  <span>SHOP 30% OFF NOW</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-gray-300 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Percent size={14} className="text-[#d4af37]" />
                  <span>Flat 30% Instant Off</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#d4af37]" />
                  <span>Free Express Shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag size={14} className="text-[#d4af37]" />
                  <span>Cash on Delivery</span>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm sm:max-w-md">

                <div
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(activeBanner.featuredProduct);
                    } else if (onExploreClick) {
                      onExploreClick();
                    }
                  }}
                  className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden p-5 flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-transform duration-500 hover:scale-[1.02] group ${
                    activeBanner.featuredProduct.cardBg === '#ffffff'
                      ? 'border border-gray-200 shadow-2xl shadow-black/20'
                      : 'border border-white/15 shadow-2xl shadow-black/60'
                  }`}
                  style={{ backgroundColor: activeBanner.featuredProduct.cardBg }}
                >
                  <div className="absolute top-3.5 left-3.5 z-20 bg-red-600 text-white font-mono font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-red-400/40">
                    <Flame size={12} className="fill-white" />
                    <span>30% OFF</span>
                  </div>

                  <div className="absolute top-3.5 right-3.5 z-20 bg-black/75 backdrop-blur-md text-[#d4af37] font-mono font-bold text-[10px] px-2.5 py-1 rounded-full border border-white/10">
                    SACRED DROP
                  </div>

                  <img
                    src={activeBanner.featuredProduct.image}
                    alt={activeBanner.featuredProduct.title}
                    className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105 z-10"
                    loading="lazy"
                  />

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[72%] h-4 bg-black/45 blur-md rounded-full pointer-events-none z-0" />

                  <div className="absolute inset-x-0 bottom-0 py-3.5 px-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between z-20">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">
                        {activeBanner.featuredProduct.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide truncate max-w-[200px]">
                        {activeBanner.featuredProduct.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 line-through block font-mono">
                        ₹{activeBanner.featuredProduct.originalPrice?.toLocaleString('en-IN') || '7,785'}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#d4af37] font-mono">
                        ₹{activeBanner.featuredProduct.price?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5">
                    {PROMO_BANNERS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === currentSlide ? 'w-8 bg-[#d4af37]' : 'w-2 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                      aria-label="Previous Banner"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                      aria-label="Next Banner"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
