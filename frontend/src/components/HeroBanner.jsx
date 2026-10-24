import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Percent,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
  Film
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const HERO_SLIDES = [
  // 1. OFFER BANNER 1
  {
    type: 'offer',
    id: 'offer-1',
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

  // 2. BRAND FILM VIDEO 1
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

  // 3. OFFER BANNER 2
  {
    type: 'offer',
    id: 'offer-2',
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

  // 4. BRAND FILM VIDEO 2
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

  // 5. OFFER BANNER 3
  {
    type: 'offer',
    id: 'offer-3',
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

  // 6. BRAND FILM VIDEO 3
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

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return;

    // Video slides stay longer or until ended, offers advance in 5.5s
    const slideDuration = active.type === 'video' ? 7000 : 5500;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, slideDuration);

    return () => clearInterval(timer);
  }, [currentSlide, isPaused, active.type]);

  // Video autoplay management when switching slides
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
          MODE A: BRAND FILM VIDEO SLIDE
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

          {/* Gradients for readability */}
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
                <span>🔥 30% OFF • USE CODE DHARM30</span>
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
            MODE B: PURE LUXURY OFFER BANNER SLIDE (NO PHOTO)
           ───────────────────────────────────────────────────────────── */
        <div
          className="relative px-5 sm:px-10 lg:px-16 py-14 sm:py-20 lg:py-24 transition-all duration-700"
          style={{ background: active.backgroundStyle }}
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

            {/* Main Offer Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-mono font-bold tracking-widest uppercase backdrop-blur-md ${active.badgeColor}`}>
                    <Flame size={14} className="fill-current" />
                    <span>{active.badge}</span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-widest text-white uppercase font-bold">
                    <Tag size={12} className="text-[#f0aa93]" />
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

                {/* Coupon Box & CTA */}
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

              {/* Graphic Discount Emblem */}
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
                      <span className="text-[#f0aa93] font-bold">{active.couponCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SHIPPING:</span>
                      <span className="text-emerald-400 font-bold">FREE EXPRESS</span>
                    </div>
                  </div>
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
                title={`Jump to ${slide.type === 'video' ? 'Video Film' : 'Offer'}`}
                aria-label={`Jump to slide ${idx + 1}`}
              >
                {isSlideActive && (
                  <span className="text-[9px] font-mono font-black uppercase">
                    {slide.type === 'video' ? 'FILM' : 'OFFER'}
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
