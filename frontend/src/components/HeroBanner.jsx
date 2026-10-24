import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
  Flame,
  Zap,
  Crown,
  Sparkles,
  Percent,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const OFFER_SLIDES = [
  {
    id: 'slide-30-off',
    badge: '🔥 LIMITED FESTIVE DROP • 30% SAVINGS',
    badgeColor: 'border-[#f0aa93]/40 bg-[#f0aa93]/20 text-[#f0aa93]',
    discountBig: '30% OFF',
    discountPill: 'FLAT 30% DISCOUNT',
    headline: 'FLAT 30% OFF SITEWIDE',
    subheadline: 'SACRED VEDIC STREETWEAR • OVERSIZED DROPS',
    description:
      'Engineered with 280-320 GSM super-combed compact cotton, custom oversized drop-shoulder drape, and high-density sacred iconography.',
    couponCode: 'DHARM30',
    ctaText: 'SHOP 30% OFF NOW',
    accentColor: '#f0aa93',
    glyph: 'धर्मो रक्षति रक्षितः',
    secondaryGlyph: 'TAT TVAM ASI • BHARAT STREETWEAR',
    backgroundStyle: 'radial-gradient(ellipse at 50% 20%, #204c5d 0%, #153440 55%, #0d222b 100%)',
    glowColor: 'rgba(240, 170, 147, 0.22)'
  },
  {
    id: 'slide-25-off',
    badge: '⚡ FLASH VAULT PRIVILEGE • 25% SAVINGS',
    badgeColor: 'border-cyan-500/40 bg-cyan-600/20 text-cyan-300',
    discountBig: '25% OFF',
    discountPill: 'EXCLUSIVE DROP SAVINGS',
    headline: 'EXCLUSIVE 25% OFF ALL ORDERS',
    subheadline: 'LIMITED RUN OF 50 PIECES PER DROP • BIO-WASHED',
    description:
      'Ribbed lycra collar retaining architectural form for 50+ washes. Pure non-dual Upanishadic art you can wear on the street.',
    couponCode: 'VEDA25',
    ctaText: 'EXPLORE VAULT DROPS',
    accentColor: '#f0aa93',
    glyph: 'अहं ब्रह्मास्मि',
    secondaryGlyph: 'INDRA & PARSHURAM • 280 GSM',
    backgroundStyle: 'radial-gradient(ellipse at 50% 20%, #25586b 0%, #173845 55%, #0e242d 100%)',
    glowColor: 'rgba(240, 170, 147, 0.22)'
  },
  {
    id: 'slide-buy2-30',
    badge: '👑 APNA BRAND PRIVILEGE • BUNDLE SPECIAL',
    badgeColor: 'border-emerald-500/40 bg-emerald-600/20 text-emerald-300',
    discountBig: 'BUY 2 GET 30%',
    discountPill: 'DOUBLE LUXURY PRIVILEGE',
    headline: 'BUY ANY 2 — GET 30% OFF',
    subheadline: 'MIX & MATCH TEES, DROP HOODIES & SWEATSHIRTS',
    description:
      'Curate your sacred rotation. Automatic discount applied at checkout with zero delivery charges across all 26,000+ PIN codes.',
    couponCode: 'APNA30',
    ctaText: 'BUILD YOUR BUNDLE',
    accentColor: '#f0aa93',
    glyph: 'सत्यमेव जयते',
    secondaryGlyph: 'SOVEREIGN DRAPE • BIO-PRESHRUNK',
    backgroundStyle: 'radial-gradient(ellipse at 50% 20%, #1d4655 0%, #13313d 55%, #0a1c23 100%)',
    glowColor: 'rgba(240, 170, 147, 0.22)'
  },
  {
    id: 'slide-winter-35',
    badge: '❄️ SACRED WINTER DROP • 35% OFF',
    badgeColor: 'border-amber-500/40 bg-amber-600/20 text-amber-300',
    discountBig: '35% OFF',
    discountPill: 'WINTER FLEECE SPECIAL',
    headline: 'UP TO 35% OFF FLEECE & HOODIES',
    subheadline: '340—400 GSM BRUSHED FRENCH TERRY FLEECE',
    description:
      'Architectural boxy form built for cold resilience and meditative stillness. High-density puff typography and double-layered hoods.',
    couponCode: 'OFF30',
    ctaText: 'SHOP WINTER LUXURY',
    accentColor: '#f0aa93',
    glyph: 'महाकाल • KAAL',
    secondaryGlyph: 'FRENCH TERRY • ZERO SHRINKAGE',
    backgroundStyle: 'radial-gradient(ellipse at 50% 20%, #2a5a6c 0%, #193c4a 55%, #0e2630 100%)',
    glowColor: 'rgba(240, 170, 147, 0.22)'
  }
];

export default function HeroBanner({ onShopNowClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { applyCoupon } = useCart?.() || {};

  const active = OFFER_SLIDES[currentSlide];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % OFFER_SLIDES.length);
    }, 4800);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleCopy = (code) => {
    try {
      navigator.clipboard?.writeText(code);
    } catch {
      // fallback
    }
    if (typeof applyCoupon === 'function') {
      applyCoupon(code);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? OFFER_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % OFFER_SLIDES.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden select-none border-b border-white/10"
      style={{
        background: active.backgroundStyle,
        transition: 'background 0.8s ease-in-out'
      }}
    >
      {/* Ambient background glow accents */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ background: active.glowColor }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ background: active.glowColor }}
      />

      {/* Decorative Subtle Cyber Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-[1380px] mx-auto px-5 sm:px-10 lg:px-16 py-14 sm:py-20 lg:py-24 z-10">

        {/* Top Ticker Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono tracking-widest text-gray-400 uppercase pb-6 mb-8 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-bold">APNA BRAND • SACRED FESTIVE CAMPAIGN</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-[#d4af37] font-semibold">{active.glyph}</span>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-gray-400">{active.secondaryGlyph}</span>
          </div>
        </div>

        {/* Main Banner Body (NO PHOTOS, PURE LUXURY TYPOGRAPHY) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Offer Details & Actions */}
          <div className="lg:col-span-8 space-y-6">

            <div className="flex flex-wrap items-center gap-2.5">
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-mono font-bold tracking-widest uppercase backdrop-blur-md ${active.badgeColor}`}>
                <Flame size={14} className="fill-current" />
                <span>{active.badge}</span>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-widest text-white uppercase font-bold">
                <Tag size={12} className="text-[#d4af37]" />
                <span>{active.discountPill}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-2xl">
                {active.headline}
              </h1>
              <p
                className="text-lg sm:text-2xl font-bold uppercase tracking-wide font-serif"
                style={{ color: active.accentColor }}
              >
                {active.subheadline}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed font-normal">
              {active.description}
            </p>

            {/* Interactive Coupon Box & CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">

              {/* Coupon Box */}
              <div className="flex items-center bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 pl-4 shadow-2xl">
                <div className="flex flex-col pr-3">
                  <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">
                    PROMO CODE
                  </span>
                  <span
                    className="font-mono text-base font-black tracking-widest"
                    style={{ color: active.accentColor }}
                  >
                    {active.couponCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(active.couponCode)}
                  className="px-4 py-2.5 rounded-xl text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
                  style={{
                    backgroundColor: active.accentColor
                  }}
                  title="Copy coupon & apply to cart"
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

              {/* Shop CTA */}
              <button
                type="button"
                onClick={onShopNowClick}
                className="px-8 py-3.5 rounded-2xl bg-[#f0aa93] hover:bg-white text-[#122832] font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-2xl hover:scale-[1.02] active:scale-95"
              >
                <span>{active.ctaText}</span>
                <ArrowUpRight size={16} />
              </button>

            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-6 border-t border-white/10 text-gray-300 text-[11px] sm:text-xs">
              <div className="flex items-center gap-2">
                <Truck size={15} style={{ color: active.accentColor }} />
                <span>Free Express Delivery Across India</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} style={{ color: active.accentColor }} />
                <span>Cash on Delivery Available</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={15} style={{ color: active.accentColor }} />
                <span>7-Day Easy Doorstep Exchange</span>
              </div>
            </div>

          </div>

          {/* Right Column: Graphic Discount Emblem (NO PHOTO) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm rounded-3xl p-8 border border-white/15 bg-black/40 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-4">

              <div
                className="w-20 h-20 rounded-2xl border flex items-center justify-center shadow-lg"
                style={{
                  borderColor: `${active.accentColor}55`,
                  backgroundColor: `${active.accentColor}15`
                }}
              >
                <Percent size={36} style={{ color: active.accentColor }} />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block">
                  LIMITED RUN PROMO
                </span>
                <span
                  className="text-4xl sm:text-5xl font-black font-mono tracking-tight block"
                  style={{ color: active.accentColor }}
                >
                  {active.discountBig}
                </span>
                <span className="text-xs font-serif text-gray-300 italic block">
                  Applicable at Checkout
                </span>
              </div>

              <div className="w-full pt-4 border-t border-white/10 text-left space-y-2 text-[11px] font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>DISCOUNT:</span>
                  <span className="text-white font-bold">{active.discountBig}</span>
                </div>
                <div className="flex justify-between">
                  <span>COUPON CODE:</span>
                  <span className="text-[#d4af37] font-bold">{active.couponCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING:</span>
                  <span className="text-emerald-400 font-bold">FREE EXPRESS</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Carousel Bottom Controls & Indicators */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">

          {/* Slide Indicator Progress Bars */}
          <div className="flex items-center gap-2">
            {OFFER_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide
                    ? 'w-10 bg-white'
                    : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Previous Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer active:scale-90"
              aria-label="Previous Slide"
              title="Previous Offer"
            >
              <ArrowRight size={16} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer active:scale-90"
              aria-label="Next Slide"
              title="Next Offer"
            >
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
