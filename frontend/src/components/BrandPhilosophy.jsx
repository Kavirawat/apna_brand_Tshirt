import React from 'react';
import { Sparkles, Flame, Shield, Compass, BookOpen } from 'lucide-react';

export default function BrandPhilosophy() {
  return (
    <section id="philosophy-section" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative overflow-hidden">

      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/[0.025] font-sanskrit text-[30vw] select-none pointer-events-none">
        ॐ
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-xs font-bold tracking-widest text-[#d4af37] uppercase mb-4">
            <BookOpen size={14} />
            <span>OUR MANIFESTO</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            WHERE ANCIENT DHARMA <br />
            <span className="text-gold-gradient">MEETS UNDERGROUND STREETWEAR</span>
          </h2>

          <p className="font-sanskrit text-xl text-gray-300 mt-4 tracking-wider">
            सर्वं खल्विदं ब्रह्म — ALL THIS IS BRAHMAN
          </p>

          <p className="text-sm text-gray-400 mt-5 leading-relaxed">
            APNA BRAND was born from an unyielding devotion to Vedic consciousness and contemporary fashion culture.
            We do not just design oversized garments; we craft wearable manifestations of timeless Indian philosophical truths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/40 transition-all hover:-translate-y-2 group">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-white uppercase mb-2">1. ADVAITA • NON-DUALITY</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Based on the core Upanishadic insight: the individual self (Atman) and the supreme cosmos (Brahman) are identical.
              Our designs embody unity through shadow and light.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/40 transition-all hover:-translate-y-2 group">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-110 transition-transform">
              <Flame size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-white uppercase mb-2">2. THE SACRED COLOR AURA</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every color in Vedic cosmology holds a spiritual frequency: Kaal Black (Infinity), Maya Pink (Illusion & Lotus Heart),
              Nirvana Off-White (Stillness), Agni Maroon (Sacred Flame), and Indra Navy (Celestial Order).
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/40 transition-all hover:-translate-y-2 group">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-white uppercase mb-2">3. UNCOMPROMISED BHARAT CRAFT</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Milled in Bharat from 100% compact super-combed cotton (280-340 GSM).
              Bio-washed with silicon treatment, paired with high-density puff printing engineered to survive lifetimes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
