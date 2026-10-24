import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useThemeColor } from '../context/ThemeColorContext';

export default function SearchModal({ isOpen, onClose, products, onSelectProduct }) {
  const { themeMode = 'dark' } = useThemeColor?.() || {};
  const isLight = themeMode === 'light';
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
      <div className={`border rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-fadeIn relative transition-colors ${
        isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#122731] border-[#224b5c] text-white'
      }`}>
        <div className={`flex items-center justify-between pb-4 border-b ${
          isLight ? 'border-gray-200' : 'border-[#224b5c]'
        }`}>
          <div className="flex items-center gap-3 flex-1">
            <Search size={20} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} />
            <input
              type="text"
              autoFocus
              placeholder="Search by deity, concept or silhouette (e.g. Maya, Aghori, Nirvana, Pink, Maroon)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full bg-transparent text-sm sm:text-base outline-none ${
                isLight ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-400'
              }`}
            />
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-gray-500 hover:text-black hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {query.trim() === '' ? (
          <div className="pt-5">
            <span className={`text-[11px] font-bold uppercase tracking-wider block mb-2.5 ${
              isLight ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Popular Sacred Searches:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Aghori', 'Maya', 'Nirvana', 'Bhairav', 'Tat Tvam Asi', 'Kaal Hoodie', 'Pink Oversized'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : matches.length > 0 ? (
          <div className={`pt-4 divide-y max-h-[60vh] overflow-y-auto ${
            isLight ? 'divide-gray-100' : 'divide-white/5'
          }`}>
            {matches.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className={`py-3 px-2 rounded-xl cursor-pointer flex items-center justify-between gap-3 group transition-colors ${
                  isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img src={p.images[0]} alt={p.title} className="w-12 h-14 object-cover rounded-lg bg-black/10" />
                  <div>
                    <span className={`font-sanskrit text-xs block ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`}>{p.sanskritTitle}</span>
                    <h4 className={`text-xs font-bold uppercase transition-colors ${
                      isLight ? 'text-gray-900 group-hover:text-[#122731]' : 'text-white group-hover:text-[#f0aa93]'
                    }`}>{p.title}</h4>
                    <span className="text-[11px] text-gray-400 font-mono">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <ArrowRight size={16} className={`transition-transform group-hover:translate-x-1 ${
                  isLight ? 'text-gray-400 group-hover:text-black' : 'text-gray-500 group-hover:text-white'
                }`} />
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
