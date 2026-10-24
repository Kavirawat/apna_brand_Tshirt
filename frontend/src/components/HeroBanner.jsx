import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
  Film,
  Zap,
  Percent,
  Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const HERO_SLIDES = [
  // 1. 3D PRICE TAG DISCOUNT COMPOSITION 1 (60% OFF)
  {
    type: 'tag_composition',
    id: 'tag-comp-60',
    discountNum: '60%',
    discountUnit: 'OFF',
    tagSubtitle: 'SPECIAL DISCOUNT',
    tagCategory: 'PRICE TAG COMPOSITION',
    badge: '🔥 3D SALES DISCOUNT • 60% MEGA SAVINGS',
    badgeColor: 'border-[#f0aa93]/50 bg-[#f0aa93]/20 text-[#f0aa93]',
    headline: 'FLAT 60% OFF SITEWIDE',
    subheadline: 'SACRED VEDIC STREETWEAR • 3D PRICE DROP',
    description:
      'Limited festival composition drop. Heavyweight 280-340 GSM super combed cotton & French Terry engineered with high-density sacred puff iconography.',
    couponCode: 'DHARM60',
    ctaText: 'CLAIM 60% OFF NOW',
    accentColor: '#f0aa93',
    glyph: 'धर्मो रक्षति रक्षितः',
    secondaryGlyph: 'TAT TVAM ASI • BHARAT STREETWEAR',
    backgroundStyle: 'radial-gradient(ellipse at 50% 20%, #1e4b5d 0%, #13323e 55%, #0b1e25 100%)',
    tagBgGradient: 'linear-gradient(145deg, #f0aa93 0%, #d8836a 50%, #9e4630 100%)',
    ringColor: '#ffd700',
    glowColor: 'rgba(240, 170, 147, 0.25)',
    floatingPill: 'SAVE 60%'
  },

  // 2. BRAND FILM VIDEO 1 (THE PHILOSOPHY)
  {
    type: 'video',
    id: 'video-1',
    category: 'THE PHILOSOPHY',
    videoSrc: 'https://cdn.shopify.com/videos/c/o/v/2c22afc5b244465da8d5d90e73415798.mp4',
    title: 'THE LIVING RELIC',
    subtitle: 'WEARABLE PHILOSOPHY',
    description:
      'Ancient Indian thought expressed through contemporary luxury streetwear. Architectural boxy form built with reverence in Bharat.',
    badge: '🎬 APNA BRAND FILM • 01',
    ctaText: 'EXPLORE PHILOSOPHY',
    accentColor: '#f0aa93'
  },

  // 3. 3D PRICE TAG DISCOUNT COMPOSITION 2 (50% OFF)
  {
    type: 'tag_composition',
    id: 'tag-comp-50',
    discountNum: '50%',
    discountUnit: 'OFF',
    tagSubtitle: 'VAULT PRIVILEGE',
    tagCategory: 'FLASH SALE COMPOSITION',
    badge: '⚡ FLASH PRICE TAG • 50% OFF ALL ORDERS',
    badgeColor: 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300',
    headline: 'EXCLUSIVE 50% OFF DROP',
    subheadline: 'LIMITED RUN OF 50 PIECES PER DROP • BIO-WASHED',
    description:
      'Ribbed lycra collar retaining architectural form for 50+ washes. Pure non-dual Upanishadic art you can wear on the street.',
    couponCode: 'VEDA50',
    ctaText: 'EXPLORE VAULT DROPS',
    accentColor: '#38bdf8',
    glyph: 'अहं ब्रह्मास्मि',
    secondaryGlyph: 'INDRA & PARSHURAM • 280 GSM',
    backgroundStyle: 'radial-gradient(ellipse at 50% 20%, #25586b 0%, #163a48 55%, #0d222b 100%)',
    tagBgGradient: 'linear-gradient(145deg, #38bdf8 0%, #0284c7 50%, #034870 100%)',
    ringColor: '#a5f3fc',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    floatingPill: 'FLASH 50%'
  },

  // 4. BRAND FILM VIDEO 2 (THE SILHOUETTE)
  {
    type: 'video',
    id: 'video-2',
    category: 'THE SILHOUETTE',
    videoSrc: 'https://cdn.shopify.com/videos/c/o/v/461373431152412b8cceadbe914c70fa.mp4',
    title: 'ARCHITECTURAL FORM',
    subtitle: 'OVERSIZED EXPRESSION',
    description:
      'A statement in silhouette. Drop-shoulder cut engineered with precision for a timeless, powerful modern street drape.',
    badge: '🎬 APNA BRAND FILM • 02',
    ctaText: 'SHOP SILHOUETTES',
    accentColor: '#f0aa93'
  },

  // 5. 3D PRICE TAG DISCOUNT COMPOSITION 3 (BUY 2 GET 40% OFF)
  {
    type: 'tag_composition',
    id: 'tag-comp-40',
    discountNum: '40%',
    discountUnit: 'OFF',
    tagSubtitle: 'BUNDLE SPECIAL',
    tagCategory: 'DOUBLE PRIVILEGE',
    badge: '👑 APNA BRAND BUNDLE • 40% DISCOUNT',
    badgeColor: 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300',
    headline: 'BUY ANY 2 — GET 40% OFF',
    subheadline: 'MIX & MATCH TEES, DROP HOODIES & SWEATSHIRTS',
    description:
      'Curate your sacred rotation. Automatic discount applied at checkout with zero delivery charges across all 26,000+ PIN codes.',
    couponCode: 'APNA40',
    ctaText: 'BUILD YOUR BUNDLE',
    accentColor: '#34d399',
    glyph: 'सत्यमेव जयते',
    secondaryGlyph: 'SOVEREIGN DRAPE • BIO-PRESHRUNK',
    backgroundStyle: 'radial-gradient(ellipse at 50% 20%, #1e4f3d 0%, #123327 55%, #0a1e17 100%)',
    tagBgGradient: 'linear-gradient(145deg, #34d399 0%, #059669 50%, #064e3b 100%)',
    ringColor: '#6ee7b7',
    glowColor: 'rgba(52, 211, 153, 0.25)',
    floatingPill: 'BUY 2 SAVE 40%'
  },

  // 6. BRAND FILM VIDEO 3 (THE CRAFT & ORIGIN)
  {
    type: 'video',
    id: 'video-3',
    category: 'THE CRAFT & ORIGIN',
    videoSrc: 'https://cdn.shopify.com/videos/c/o/v/18aee6f54d344f8ba3f668dd064e71f4.mp4',
    title: 'SUBSTANTIAL FLEECE',
    subtitle: 'ROOTED IN BHARAT',
    description:
      'Heavyweight 340-400 GSM brushed loopback French Terry. Built for cold resilience and non-dual meditative stillness.',
    badge: '🎬 APNA BRAND FILM • 03',
    ctaText: 'EXPLORE FLEECE',
    accentColor: '#f0aa93'
  }
];

export default function HeroBanner({ onShopNowClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const { applyCoupon } = useCart?.() || {};

  const active = HERO_SLIDES[currentSlide];

  // Auto slide interval
  useEffect(() => {
    if (isPaused) return;

    const slideDuration = active.type === 'video' ? 7000 : 5500;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, slideDuration);

    return () => clearInterval(timer);
  }, [currentSlide, isPaused, active.type]);

  // Video autoplay management
  useEffect(() => {
    if (active.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [currentSlide, active.type]);

  const handleVideoEnded = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

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
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden select-none border-b border-[#224b5c]"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. BRAND FILM VIDEO SLIDES
         ───────────────────────────────────────────────────────────── */}
      {active.type === 'video' ? (
        <div className="relative min-h-[70vh] sm:min-h-[82vh] flex items-end justify-start p-6 sm:p-12 lg:p-16 bg-black">
          {/* Background Video */}
          <video
            key={active.videoSrc}
            ref={videoRef}
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={handleVideoEnded}
            className="absolute inset-0 w-full h-full object-cover opacity-85 transition-opacity duration-1000 pointer-events-none"
          >
            <source src={active.videoSrc} type="video/mp4" />
          </video>

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#122832] via-black/50 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#122832]/85 via-black/40 to-transparent pointer-events-none" />

          {/* Sound Toggle Button */}
          <div className="absolute top-6 right-6 sm:top-10 sm:right-12 z-20">
            <button
              onClick={toggleSound}
              type="button"
              className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 cursor-pointer ${
                !isMuted
                  ? 'bg-[#f0aa93] text-[#122832] border-[#f0aa93] ring-2 ring-[#f0aa93]/40'
                  : 'bg-black/60 border-white/30 text-gray-300 hover:text-white hover:border-white/60 hover:bg-black/80'
              }`}
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {!isMuted ? <Volume2 size={18} className="animate-pulse" /> : <VolumeX size={18} />}
            </button>
          </div>

          {/* Video Overlay Content */}
          <div className="relative z-10 max-w-2xl space-y-4 pt-16">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#f0aa93]/40 text-[11px] font-mono tracking-widest text-[#f0aa93] uppercase">
                <Film size={13} />
                <span>BHARAT CAMPAIGN • {active.category}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-mono text-[10px] font-black tracking-widest uppercase shadow-lg border border-red-400/40">
                <span>🔥 60% OFF • USE CODE DHARM60</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-2xl font-serif">
              {active.title} <br />
              <span className="text-gray-200 font-sans text-2xl sm:text-4xl lg:text-5xl font-light tracking-wide block mt-1">
                {active.subtitle}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-normal">
              {active.description}
            </p>

            <div className="pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShopNowClick();
                }}
                type="button"
                className="px-8 py-3.5 bg-[#f0aa93] hover:bg-white text-[#122832] rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-2xl active:scale-95 cursor-pointer"
              >
                <span>{active.ctaText}</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            2. 3D SALES DISCOUNT PRICE TAG COMPOSITION SLIDES
           ───────────────────────────────────────────────────────────── */
        <div
          className="relative px-5 sm:px-10 lg:px-16 py-14 sm:py-20 lg:py-24 transition-all duration-700"
          style={{ background: active.backgroundStyle }}
        >
          {/* Ambient Glows */}
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{ background: active.glowColor }}
          />
          <div
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{ background: active.glowColor }}
          />

          <div className="relative max-w-[1380px] mx-auto z-10">

            {/* Top Ticker Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono tracking-widest text-gray-400 uppercase pb-6 mb-8 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-bold">APNA BRAND • SACRED FESTIVE CAMPAIGN</span>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-[#f0aa93] font-semibold">{active.glyph}</span>
                <span className="text-gray-600 hidden sm:inline">•</span>
                <span className="hidden sm:inline text-gray-400">{active.secondaryGlyph}</span>
              </div>
            </div>

            {/* Main Content: Left Details, Right 3D Price Tag Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

              {/* Left Column: Headlines, Coupon & CTA */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-mono font-bold tracking-widest uppercase backdrop-blur-md ${active.badgeColor}`}>
                    <Flame size={14} className="fill-current" />
                    <span>{active.badge}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-widest text-white uppercase font-bold">
                    <Tag size={12} className="text-[#f0aa93]" />
                    <span>3D COMPOSITION SPECIAL</span>
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

                <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed font-normal">
                  {active.description}
                </p>

                {/* Interactive Coupon Box & CTA */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
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
                      className="px-4 py-2.5 rounded-xl text-[#122832] font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
                      style={{ backgroundColor: active.accentColor }}
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

              {/* Right Column: HYPER-REALISTIC 3D SALES DISCOUNT PRICE TAG COMPOSITION */}
              <div className="lg:col-span-5 flex items-center justify-center relative">

                {/* Surrounding 3D Floating Geometric Elements */}
                {/* Floating Shiny Spheres */}
                <div
                  className="absolute -top-6 -left-4 w-10 h-10 rounded-full shadow-2xl pointer-events-none animate-bounce"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #ffd7a8 40%, #e07a5f 80%, #7d2a17 100%)',
                    boxShadow: '0 10px 25px rgba(224, 122, 95, 0.5)'
                  }}
                />
                <div
                  className="absolute bottom-6 -right-4 w-8 h-8 rounded-full shadow-2xl pointer-events-none animate-pulse"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #b8f2e6 40%, #34d399 80%, #064e3b 100%)',
                    boxShadow: '0 8px 20px rgba(52, 211, 153, 0.4)'
                  }}
                />

                {/* Floating Discount Capsule Pill */}
                <div className="absolute -top-4 right-2 z-30 px-3.5 py-1.5 rounded-full bg-white text-[#122832] font-black font-mono text-xs uppercase tracking-wider shadow-2xl border-2 border-[#f0aa93] flex items-center gap-1.5 transform rotate-6 hover:rotate-0 transition-transform">
                  <Sparkles size={13} className="text-[#e07a5f] fill-[#e07a5f]" />
                  <span>{active.floatingPill}</span>
                </div>

                {/* 3D Main Price Tag Container */}
                <div
                  className="relative w-full max-w-sm rounded-[36px] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.85)] border-2 border-white/30 backdrop-blur-xl flex flex-col items-center justify-between transition-transform duration-500 hover:rotate-0 hover:scale-105 group"
                  style={{
                    background: active.tagBgGradient,
                    transform: 'perspective(1000px) rotateY(-8deg) rotateX(4deg)'
                  }}
                >
                  {/* Realistic Metallic Hanging Eyelet Ring & Cord String */}
                  <div className="relative -mt-12 mb-4 flex flex-col items-center z-20">
                    {/* Hanging String */}
                    <div className="w-1 h-12 bg-gradient-to-b from-white/90 via-amber-200 to-amber-600 shadow-md rounded-full" />
                    {/* Metallic Golden Grommet / Eyelet Hole */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border-4 shadow-2xl"
                      style={{
                        backgroundColor: '#122832',
                        borderColor: active.ringColor,
                        boxShadow: `0 0 15px ${active.ringColor}aa, inset 0 2px 4px rgba(0,0,0,0.8)`
                      }}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-[#0a1820] shadow-inner" />
                    </div>
                  </div>

                  {/* Stamped Badge on Tag */}
                  <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-widest text-white uppercase font-bold mb-2">
                    {active.tagSubtitle}
                  </div>

                  {/* 3D EXTRUDED DISCOUNT PERCENTAGE NUMERALS */}
                  <div className="text-center my-3 relative select-none">
                    <span
                      className="text-7xl sm:text-8xl font-black font-mono tracking-tighter block leading-none text-white drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
                      style={{
                        textShadow:
                          '0 2px 0 #ffffff, 0 4px 0 #e2e8f0, 0 6px 0 #cbd5e1, 0 8px 0 #94a3b8, 0 10px 10px rgba(0,0,0,0.7), 0 20px 25px rgba(0,0,0,0.5)'
                      }}
                    >
                      {active.discountNum}
                    </span>
                    <span
                      className="text-3xl sm:text-4xl font-black uppercase tracking-widest block mt-2 text-white/95"
                      style={{
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {active.discountUnit}
                    </span>
                  </div>

                  {/* Tag Perforated Barcode & Coupon Strip */}
                  <div className="w-full mt-4 pt-4 border-t-2 border-dashed border-white/30 flex items-center justify-between text-[11px] font-mono text-white/90">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-white/70">PROMO CODE</span>
                      <span className="font-bold tracking-widest text-white text-xs">{active.couponCode}</span>
                    </div>

                    {/* Faux 3D Barcode lines */}
                    <div className="flex items-center gap-0.5 h-6 opacity-80">
                      <div className="w-0.5 h-full bg-white" />
                      <div className="w-1.5 h-full bg-white" />
                      <div className="w-0.5 h-full bg-white" />
                      <div className="w-1 h-full bg-white" />
                      <div className="w-2 h-full bg-white" />
                      <div className="w-0.5 h-full bg-white" />
                      <div className="w-1 h-full bg-white" />
                    </div>
                  </div>

                  {/* 3D Platform Ground Reflection Shadow */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-5 bg-black/60 blur-xl rounded-full pointer-events-none" />
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CAROUSEL BOTTOM CONTROLS & INDICATORS
         ───────────────────────────────────────────────────────────── */}
      <div className="relative px-5 sm:px-10 lg:px-16 py-3.5 bg-[#0e2129] border-t border-[#224b5c] flex items-center justify-between z-20">
        {/* Slide Indicator Progress Bars */}
        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((slide, idx) => {
            const isSlideActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1 px-1.5 ${
                  isSlideActive
                    ? 'w-16 bg-[#f0aa93] text-[#122832]'
                    : 'w-4 bg-white/30 hover:bg-white/50'
                }`}
                title={`Jump to ${slide.type === 'video' ? 'Video Film' : '3D Price Tag Banner'}`}
                aria-label={`Jump to slide ${idx + 1}`}
              >
                {isSlideActive && (
                  <span className="text-[9px] font-mono font-black uppercase">
                    {slide.type === 'video' ? 'FILM' : '3D TAG'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-[#f0aa93] hover:text-[#122832] flex items-center justify-center text-white transition-all cursor-pointer active:scale-90"
            aria-label="Previous Slide"
            title="Previous"
          >
            <ArrowRight size={14} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-[#f0aa93] hover:text-[#122832] flex items-center justify-center text-white transition-all cursor-pointer active:scale-90"
            aria-label="Next Slide"
            title="Next"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
