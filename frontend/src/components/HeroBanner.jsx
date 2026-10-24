import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Tag,
  Film
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

  // 3. 3D PRICE TAG DISCOUNT COMPOSITION 2 (30% OFF)
  {
    type: 'tag_composition',
    id: 'tag-comp-30',
    discountNum: '30%',
    discountUnit: 'OFF',
    tagSubtitle: 'SPECIAL 30% DROP',
    tagCategory: 'PRICE TAG COMPOSITION',
    headline: 'FLAT 30% OFF NEW DROPS',
    subheadline: 'LIMITED RUN OF 50 PIECES • BIO-WASHED',
    description:
      'Ribbed lycra collar retaining architectural form for 50+ washes. Pure non-dual Upanishadic art you can wear on the street with supreme comfort.',
    couponCode: 'VEDA30',
    ctaText: 'CLAIM 30% OFF NOW',
    accentColor: '#38bdf8',
    glyph: 'अहं ब्रह्मास्मि',
    secondaryGlyph: 'INDRA & PARSHURAM • 280 GSM',
    backgroundStyle: 'radial-gradient(ellipse at 50% 20%, #204e60 0%, #143542 55%, #0b1f28 100%)',
    tagBgGradient: 'linear-gradient(145deg, #38bdf8 0%, #0284c7 50%, #034870 100%)',
    ringColor: '#a5f3fc',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    floatingPill: 'SAVE 30%'
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
    accentColor: '#38bdf8'
  },

  // 5. 3D PRICE TAG DISCOUNT COMPOSITION 3 (40% OFF)
  {
    type: 'tag_composition',
    id: 'tag-comp-40',
    discountNum: '40%',
    discountUnit: 'OFF',
    tagSubtitle: 'FESTIVAL SPECIAL',
    tagCategory: 'PRICE TAG COMPOSITION',
    headline: 'FLAT 40% OFF CELEBRATION',
    subheadline: 'SACRED LUXURY ROTATION • ZERO DELIVERY',
    description:
      'Curate your sacred rotation with signature heavyweight hoodies and tees. Automatic privilege applied with zero delivery charges across India.',
    couponCode: 'APNA40',
    ctaText: 'CLAIM 40% OFF NOW',
    accentColor: '#34d399',
    glyph: 'सत्यमेव जयते',
    secondaryGlyph: 'SOVEREIGN DRAPE • BIO-PRESHRUNK',
    backgroundStyle: 'radial-gradient(ellipse at 50% 20%, #1e4f3d 0%, #123327 55%, #0a1e17 100%)',
    tagBgGradient: 'linear-gradient(145deg, #34d399 0%, #059669 50%, #064e3b 100%)',
    ringColor: '#6ee7b7',
    glowColor: 'rgba(52, 211, 153, 0.25)',
    floatingPill: 'SAVE 40%'
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
    accentColor: '#34d399'
  }
];

export default function HeroBanner({ onShopNowClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const tagSlideRef = useRef(null);
  const [tagSlideHeight, setTagSlideHeight] = useState(null);
  const { applyCoupon } = useCart?.() || {};

  const active = HERO_SLIDES[currentSlide];

  // Measure tag composition slide height so video slide height matches exactly pixel-for-pixel
  useEffect(() => {
    const measure = () => {
      if (tagSlideRef.current) {
        const h = tagSlideRef.current.offsetHeight;
        if (h && h > 200) {
          setTagSlideHeight(h);
        }
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [currentSlide]);

  // Auto slide interval alternating offer banners & brand film videos automatically
  useEffect(() => {
    if (isPaused) return;

    const slideDuration = active.type === 'video' ? 7500 : 5500;

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
        <div
          className="relative px-5 sm:px-10 lg:px-16 py-14 sm:py-20 lg:py-24 flex items-center justify-start bg-black overflow-hidden transition-all duration-700"
          style={tagSlideHeight ? { height: `${tagSlideHeight}px`, minHeight: `${tagSlideHeight}px`, maxHeight: `${tagSlideHeight}px` } : {}}
        >
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#122731] via-black/50 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#122731]/90 via-black/40 to-transparent pointer-events-none" />

          {/* Sound Toggle Button */}
          <div className="absolute top-6 right-6 sm:top-10 sm:right-12 z-20">
            <button
              onClick={toggleSound}
              type="button"
              className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 cursor-pointer ${
                !isMuted
                  ? 'bg-[#f0aa93] text-[#122731] border-[#f0aa93] ring-2 ring-[#f0aa93]/40'
                  : 'bg-black/60 border-white/30 text-gray-300 hover:text-white hover:border-white/60 hover:bg-black/80'
              }`}
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {!isMuted ? <Volume2 size={18} className="animate-pulse" /> : <VolumeX size={18} />}
            </button>
          </div>

          <div className="relative max-w-[1380px] mx-auto z-10 w-full">
            {/* Top Ticker Row - perfectly matches banner ticker */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono tracking-widest text-gray-400 uppercase pb-6 mb-8 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-bold">APNA BRAND • BHARAT CAMPAIGN • {active.category}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-[#f0aa93] font-semibold">धर्मो रक्षति रक्षितः</span>
                <span className="text-gray-600 hidden sm:inline">•</span>
                <span className="hidden sm:inline text-gray-400">SACRED APPAREL FILM</span>
              </div>
            </div>

            {/* Video Overlay Content */}
            <div className="max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#f0aa93]/40 text-[11px] font-mono tracking-widest text-[#f0aa93] uppercase">
                  <Film size={13} />
                  <span>BHARAT CAMPAIGN • {active.category}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-mono text-[10px] font-black tracking-widest uppercase shadow-lg border border-red-400/40">
                  <span>🔥 SPECIAL DROP • DHARM60</span>
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
                  className="px-8 py-3.5 bg-[#f0aa93] hover:bg-white text-[#122731] rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-2xl active:scale-95 cursor-pointer"
                >
                  <span>{active.ctaText}</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            2. 3D SALES DISCOUNT PRICE TAG COMPOSITION SLIDES
           ───────────────────────────────────────────────────────────── */
        <div
          ref={tagSlideRef}
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

            {/* Main Content: Left Details & Refined Coupon, Right 3D Price Tag */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

              {/* Left Column: Headlines, Sleek Refined Coupon & CTA */}
              <div className="lg:col-span-7 space-y-6">

                <div className="space-y-3">
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

                {/* Sleek, Luxury Refined Coupon Pill & CTA */}
                <div className="pt-3 flex flex-wrap items-center gap-4">
                  {/* Clean Coupon Pill Box */}
                  <div className="inline-flex items-center gap-3 bg-[#0d1e26]/90 hover:bg-[#0d1e26] border border-[#f0aa93]/40 rounded-full pl-5 pr-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all group backdrop-blur-xl">
                    <div className="flex items-center gap-2.5">
                      <Tag size={15} style={{ color: active.accentColor }} />
                      <span className="text-[10px] font-mono tracking-widest text-gray-300 font-bold uppercase">
                        COUPON
                      </span>
                      <span
                        className="font-mono text-sm sm:text-base font-black tracking-wider px-3 py-1 rounded-full bg-[#163643] border border-[#224b5c] shadow-inner"
                        style={{ color: active.accentColor }}
                      >
                        {active.couponCode}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(active.couponCode)}
                      className="px-5 py-2.5 rounded-full text-[#122731] font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                      style={{ backgroundColor: active.accentColor }}
                      title="Copy coupon code and apply to cart"
                    >
                      {copiedCode ? (
                        <>
                          <Check size={14} className="stroke-[3] text-emerald-800" />
                          <span className="text-emerald-950 font-black">APPLIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>COPY & APPLY</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Shop CTA Button */}
                  <button
                    type="button"
                    onClick={onShopNowClick}
                    className="px-8 py-3.5 rounded-full bg-white hover:bg-[#f0aa93] text-[#122731] font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                  >
                    <span>{active.ctaText}</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>

              {/* Right Column: HYPER-REALISTIC 3D SALES DISCOUNT PRICE TAG COMPOSITION */}
              <div className="lg:col-span-5 flex items-center justify-center relative">

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
                <div
                  className="absolute -top-4 right-2 z-30 px-3.5 py-1.5 rounded-full bg-white text-[#122731] font-black font-mono text-xs uppercase tracking-wider shadow-2xl border-2 flex items-center gap-1.5 transform rotate-6 hover:rotate-0 transition-transform"
                  style={{ borderColor: active.accentColor }}
                >
                  <Sparkles size={13} style={{ color: active.accentColor }} />
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
                        backgroundColor: '#122731',
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
    </div>
  );
}
