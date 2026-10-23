import React, { useState } from 'react';
import { Send, ShieldCheck, Truck, RefreshCw, Globe, MessageCircle, Share2 } from 'lucide-react';

export default function Footer({ onSelectCategory, onViewPhilosophy }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#08090b] border-t border-white/10 text-gray-400 text-xs">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-white/10">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-[#d4af37] font-sanskrit text-2xl block mb-2">ॐ</span>
          <h3 className="font-serif text-2xl font-black text-white uppercase tracking-wider">
            JOIN THE SACRED SANGHA
          </h3>
          <p className="mt-2 text-gray-400 text-xs leading-relaxed">
            Subscribe for secret limited drop alerts, Upanishadic writings, and receive 10% off your first creation with code <strong className="text-white">DHARM10</strong>.
          </p>

          {subscribed ? (
            <div className="mt-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-semibold">
              Blessed! Welcome to Apna Brand family. Use coupon code <strong className="text-white">DHARM10</strong> at checkout.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 outline-none focus:border-[#d4af37] text-xs"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#d4af37] text-black font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-1.5"
              >
                <span>JOIN</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#d4af37] text-xl font-sanskrit">ॐ</span>
            <span className="font-serif text-lg font-bold uppercase text-white tracking-widest">
              APNA BRAND
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Indian philosophy streetwear brand rooted in Vedic wisdom, Advaita Vedanta, and oversized street aesthetics. Made with reverence in Bharat.
          </p>
          <div className="flex items-center gap-4 text-gray-400 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"><Share2 size={15} /> Instagram</a>
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"><MessageCircle size={15} /> WhatsApp</a>
            <a href="https://thebrahmmanstore.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"><Globe size={15} /> Global</a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold tracking-widest uppercase mb-4 text-[11px]">
            SACRED COLLECTIONS
          </h4>
          <ul className="space-y-2.5">
            <li>
              <button onClick={() => onSelectCategory('Oversized T-Shirts')} className="hover:text-white transition-colors">
                Oversized T-Shirts (280 GSM)
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('Sweatshirts')} className="hover:text-white transition-colors">
                Hoodies & Sweatshirts (340 GSM)
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('Shirts')} className="hover:text-white transition-colors">
                Oversized Drop-Shoulder Shirts
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('All')} className="hover:text-white transition-colors">
                All Sacred Drops
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold tracking-widest uppercase mb-4 text-[11px]">
            SEEKER ASSISTANCE
          </h4>
          <ul className="space-y-2.5 text-gray-400">
            <li className="hover:text-white cursor-pointer">Track Your Sacred Order</li>
            <li className="hover:text-white cursor-pointer">7-Day Hassle-Free Exchange</li>
            <li className="hover:text-white cursor-pointer">Shipping & Delivery Policy</li>
            <li className="hover:text-white cursor-pointer">Oversized Size Guide</li>
            <li className="hover:text-white cursor-pointer">Contact Our Seeker Desk</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold tracking-widest uppercase mb-4 text-[11px]">
            THE DHARMA GUARANTEE
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <ShieldCheck size={16} className="text-[#d4af37]" />
              <span>100% Super-Combed Bio Cotton</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Truck size={16} className="text-[#d4af37]" />
              <span>Pan-India Fast Dispatch (24-48h)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <RefreshCw size={16} className="text-[#d4af37]" />
              <span>Cash on Delivery & Easy UPI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 px-4 text-center text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <p>© 2026 APNA BRAND. ALL RIGHTS RESERVED. BHARAT.</p>
        <p className="font-sanskrit text-gray-400 mt-2 sm:mt-0 text-xs">
          ॐ शान्तिः शान्तिः शान्तिः • PEACE IN THOUGHT, BODY & SOUL
        </p>
      </div>
    </footer>
  );
}
