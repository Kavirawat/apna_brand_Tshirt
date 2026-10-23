import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';

const BRAND_FILMS = [
  {
    id: 'philosophy',
    category: 'THE PHILOSOPHY',
    src: 'https://cdn.shopify.com/videos/c/o/v/2c22afc5b244465da8d5d90e73415798.mp4',
    desc: 'Ancient Indian thought expressed through contemporary luxury streetwear.'
  },
  {
    id: 'silhouette',
    category: 'THE SILHOUETTE',
    src: 'https://cdn.shopify.com/videos/c/o/v/461373431152412b8cceadbe914c70fa.mp4',
    desc: 'A statement in silhouette. Contemporary boxy form, uncompromising expression.'
  },
  {
    id: 'craft',
    category: 'THE CRAFT',
    src: 'https://cdn.shopify.com/videos/c/o/v/18aee6f54d344f8ba3f668dd064e71f4.mp4',
    desc: 'Substantial French terry cotton. Structured drop-shoulder fit built for eternity.'
  },
  {
    id: 'origin',
    category: 'THE ORIGIN',
    src: 'https://cdn.shopify.com/videos/c/o/v/2b0af9e9eca141938913edb5e5ff0c44.mp4',
    desc: 'Rooted in Vedic heritage. Created with an architectural vision that reaches beyond borders.'
  }
];

export default function HeroBanner({ onShopNowClick }) {
  const [activeFilmIndex, setActiveFilmIndex] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const videoRef = useRef(null);
  const ytPlayerRef = useRef(null);

  const activeFilm = BRAND_FILMS[activeFilmIndex];

  useEffect(() => {
    let player;

    const initYT = () => {
      if (window.YT && window.YT.Player) {
        player = new window.YT.Player('yt-brand-audio-player', {
          videoId: '_IwIMU2hbvU',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: '_IwIMU2hbvU',
            modestbranding: 1,
            rel: 0
          },
          events: {
            onReady: (e) => {
              ytPlayerRef.current = e.target;
              e.target.setVolume(85);
            }
          }
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = initYT;
      document.body.appendChild(tag);
    } else {
      initYT();
    }

    return () => {
      if (player && player.destroy) player.destroy();
    };
  }, []);

  const handleVideoEnded = () => {
    setActiveFilmIndex((prevIndex) => (prevIndex + 1) % BRAND_FILMS.length);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }, [activeFilmIndex]);

  const toggleSound = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const player = ytPlayerRef.current;

    if (isAudioActive) {
      if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
        player.mute();
      }
      setIsAudioActive(false);
    } else {
      if (player && typeof player.playVideo === 'function') {
        player.unMute();
        player.setVolume(85);
        player.playVideo();
      }
      setIsAudioActive(true);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-black text-white select-none">

      <div className="absolute -top-96 -left-96 w-1 h-1 opacity-0 pointer-events-none overflow-hidden">
        <div id="yt-brand-audio-player" />
      </div>

      <div className="relative min-h-[78vh] sm:min-h-[88vh] flex items-end justify-start p-6 sm:p-12 lg:p-16">

        <video
          key={activeFilm.src}
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000"
        >
          <source src={activeFilm.src} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />

        <div className="absolute top-6 right-6 sm:top-10 sm:right-12 z-20">
          <button
            onClick={toggleSound}
            type="button"
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 ${
              isAudioActive
                ? 'bg-black/85 border-[#d4af37] text-[#d4af37] ring-2 ring-[#d4af37]/30 shadow-[#d4af37]/25'
                : 'bg-black/60 border-white/30 text-gray-300 hover:text-white hover:border-white/60 hover:bg-black/80'
            }`}
            title={isAudioActive ? 'Mute' : 'Unmute'}
            aria-label={isAudioActive ? 'Mute audio' : 'Unmute audio'}
          >
            {isAudioActive ? (
              <Volume2 size={18} className="animate-pulse" />
            ) : (
              <VolumeX size={18} />
            )}
          </button>
        </div>

        <div className="relative z-10 max-w-2xl space-y-4 pt-16">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-mono tracking-widest text-[#d4af37] uppercase pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span>BHARAT CAMPAIGN • {activeFilm.category}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-2xl font-serif pointer-events-none">
            THE LIVING RELIC <br />
            <span className="text-gray-200 font-sans text-2xl sm:text-4xl lg:text-5xl font-light tracking-wide block mt-1">
              WEARABLE PHILOSOPHY
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-normal pointer-events-none">
            {activeFilm.desc} Heavyweight drop-shoulder silhouettes engineered for eternity with high-density sacred iconography.
          </p>

          <div className="pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShopNowClick();
              }}
              type="button"
              className="px-8 py-3.5 bg-white text-black hover:bg-black hover:text-white border border-white rounded-md text-xs font-bold tracking-widest uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-2xl active:scale-95"
            >
              <span>SHOP NOW</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

        </div>

        <div className="absolute bottom-4 right-6 sm:right-12 hidden md:flex items-center gap-3 text-[10px] font-mono tracking-widest text-gray-400 uppercase pointer-events-none">
          <span>APNA BRAND</span>
          <span>•</span>
          <span>AUTUMN/WINTER 2026</span>
        </div>
      </div>
    </div>
  );
}
