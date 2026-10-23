import React from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { useThemeColor } from '../context/ThemeColorContext';

export default function ColorBar({ onSelectColorFilter, activeColorFilter }) {
  const { currentColor, setThemeByColorName, palettes } = useThemeColor();

  const colorItems = [
    { name: 'Black', label: 'Black / काल', hex: '#111113' },
    { name: 'Off White', label: 'Off White / निर्वाण', hex: '#e8e4dc' },
    { name: 'Baby Pink', label: 'Baby Pink / माया', hex: '#f4c2c2' },
    { name: 'Lavender', label: 'Lavender / बोधि', hex: '#c8b6e2' },
    { name: 'Maroon', label: 'Maroon / अग्नि', hex: '#6b1724' },
    { name: 'Navy Blue', label: 'Navy Blue / इंद्र', hex: '#1e293b' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        className="rounded-2xl p-5 sm:p-6 border backdrop-blur-xl transition-all duration-700 shadow-xl"
        style={{
          backgroundColor: 'rgba(18, 19, 24, 0.7)',
          borderColor: currentColor.borderGlow
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#d4af37]">
              <Palette size={14} />
              <span>DYNAMIC COLOR ATMOSPHERE</span>
              <Sparkles size={12} />
            </div>
            <p className="text-sm text-gray-300 mt-1 font-medium">
              Click any T-shirt color to transform the store background & atmosphere to match:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {colorItems.map((item) => {
              const isCurrent = currentColor.name.toLowerCase().includes(item.name.toLowerCase());
              const isFiltered = activeColorFilter && activeColorFilter.toLowerCase().includes(item.name.toLowerCase());

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setThemeByColorName(item.name);
                    onSelectColorFilter(item.name);
                  }}
                  className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 border ${
                    isCurrent || isFiltered
                      ? 'border-[#d4af37] bg-white/15 text-white shadow-lg scale-105'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10'
                  }`}
                  style={{
                    boxShadow: isCurrent ? `0 0 15px ${item.hex}66` : 'none'
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm transition-transform group-hover:scale-125"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {activeColorFilter && (
              <button
                onClick={() => {
                  setThemeByColorName('Black');
                  onSelectColorFilter(null);
                }}
                className="text-[11px] font-semibold text-gray-400 hover:text-white px-2 py-1 underline"
              >
                Reset All Colors
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
