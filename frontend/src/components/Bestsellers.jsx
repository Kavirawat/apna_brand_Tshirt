import React, { useState } from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';

export default function Bestsellers({ products, onSelectProduct, onShopNowClick }) {
  const [hoveredId, setHoveredId] = useState(null);

  const bestsellerItems = products.slice(0, 4);

  return (
    <section className="bg-[#122832] text-white py-14 sm:py-20 px-4 sm:px-8 max-w-[1440px] mx-auto select-none border-b border-[#224b5c]">

      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#f0aa93] uppercase block mb-1">
            SACRED SIGNATURE DROPS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
            BESTSELLERS
          </h2>
        </div>
        <button
          onClick={onShopNowClick}
          className="text-xs font-bold uppercase tracking-wider text-[#f0aa93] hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>View All Drops</span>
          <span>→</span>
        </button>
      </div>

      {/* 3D Card Grid (Upper Image, Name & Price Below, Rating Stars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {bestsellerItems.map((product) => {
          const isHovered = hoveredId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer group flex flex-col rounded-3xl bg-[#163643] border border-[#234f60] border-t-white/20 shadow-2xl hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(10,25,33,0.85)] hover:border-[#f0aa93]/60 transition-all duration-500 overflow-hidden justify-between"
            >

              {/* Upper Image (Fitted seamlessly as 4:5 with zero padding) */}
              <div
                className="relative aspect-[4/5] w-full overflow-hidden transition-all duration-500 bg-black/20"
                style={{
                  backgroundColor: product.cardBg || '#183c4b'
                }}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {product.remainingUnits && (
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider text-white border border-white/10 z-20">
                    {product.dropStatus === 'expired' ? 'VAULT CLOSED' : `LIMITED • ${product.remainingUnits} LEFT`}
                  </div>
                )}

                {product.discountPercent > 0 && (
                  <div className="absolute top-3 right-3 bg-[#f0aa93] text-[#122832] font-mono font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-lg z-20">
                    {product.discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Lower Details: Name & Price, and Rating Stars Below */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3">

                <div className="space-y-1">
                  <span className="font-sanskrit text-xs text-[#f0aa93] block font-semibold tracking-wide">
                    {product.sanskritTitle || product.title}
                  </span>
                  <h3
                    className={`text-sm sm:text-base font-bold text-white uppercase tracking-tight line-clamp-1 transition-colors ${
                      isHovered ? 'text-[#f0aa93]' : ''
                    }`}
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base sm:text-lg font-black text-[#f0aa93] font-mono">
                      Rs. {product.price?.toLocaleString('en-IN') || '5,450'}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through font-mono">
                        Rs. {product.compareAtPrice?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating in Stars */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-[#f0aa93] text-xs tracking-wider">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <span className="text-xs font-bold text-white font-mono">
                      {product.rating || '4.9'}
                    </span>
                    <span className="text-[11px] text-[#a8c5cf]">
                      ({product.reviewsCount || 85})
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[#f0aa93] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    View ➔
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 flex justify-center">
        <button
          onClick={onShopNowClick}
          className="px-10 py-3.5 rounded-full bg-[#f0aa93] hover:bg-white text-[#122832] hover:text-[#122832] transition-all text-xs font-black tracking-widest uppercase cursor-pointer shadow-xl hover:scale-105 active:scale-95"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}
