import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, products, onSelectProduct }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matches = query.trim() === '' ? [] : products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.sanskritTitle.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    (p.colors && p.colors.some(c => c.name.toLowerCase().includes(query.toLowerCase())))
  ).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-[#121318] border border-white/15 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl animate-fadeIn relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3 flex-1">
            <Search size={20} className="text-[#d4af37]" />
            <input
              type="text"
              autoFocus
              placeholder="Search by deity, concept or silhouette (e.g. Maya, Aghori, Nirvana, Pink, Maroon)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-gray-500 outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {query.trim() === '' ? (
          <div className="pt-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
              Popular Sacred Searches:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Aghori', 'Maya', 'Nirvana', 'Bhairav', 'Tat Tvam Asi', 'Kaal Hoodie', 'Pink Oversized'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : matches.length > 0 ? (
          <div className="pt-4 divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
            {matches.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="py-3 px-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <img src={p.images[0]} alt={p.title} className="w-12 h-14 object-cover rounded-lg bg-black/40" />
                  <div>
                    <span className="font-sanskrit text-xs text-[#d4af37] block">{p.sanskritTitle}</span>
                    <h4 className="text-xs font-bold text-white uppercase group-hover:text-yellow-300 transition-colors">{p.title}</h4>
                    <span className="text-[11px] text-gray-400 font-mono">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-xs">
            No pieces found matching "{query}".
          </div>
        )}
      </div>
    </div>
  );
}
