import React, { useState } from 'react';

export default function Bestsellers({ products, onSelectProduct, onShopNowClick }) {
  const [hoveredId, setHoveredId] = useState(null);

  const bestsellerItems = products.slice(0, 4);

  return (
    <section className="bg-white py-10 sm:py-16 px-4 sm:px-8 max-w-[1440px] mx-auto">

      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 uppercase block mb-1">
            SACRED SIGNATURE DROPS
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121212] uppercase">
            BESTSELLERS
          </h2>
        </div>
        <button
          onClick={onShopNowClick}
          className="text-xs font-bold uppercase tracking-wider text-[#121212] hover:text-[#d4af37] transition-colors inline-flex items-center gap-1.5"
        >
          <span>View All Drops</span>
          <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {bestsellerItems.map((product) => {
          const isHovered = hoveredId === product.id;
          const isWhiteCard = product.cardBg === '#ffffff' || product.cardBg === '#ece7dd';

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer group flex flex-col"
            >

              <div
                className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden transition-all duration-500 flex items-center justify-center p-4 sm:p-5 group-hover:-translate-y-1.5 ${
                  isWhiteCard
                    ? 'border border-gray-200/90 shadow-xl shadow-black/[0.06] group-hover:shadow-2xl group-hover:shadow-black/10'
                    : 'border border-white/10 shadow-xl shadow-black/30 group-hover:shadow-2xl group-hover:shadow-black/50'
                }`}
                style={{
                  backgroundColor: product.cardBg || '#18191f'
                }}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 ease-out transform group-hover:scale-[1.04] z-10"
                  loading="lazy"
                />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[72%] h-3.5 bg-black/45 blur-md rounded-full pointer-events-none z-0" />

                {product.remainingUnits && (
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider text-white border border-white/10 z-20">
                    {product.dropStatus === 'expired' ? 'VAULT CLOSED' : `LIMITED • ${product.remainingUnits} LEFT`}
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h3
                  className={`text-[13px] sm:text-sm font-semibold text-[#121212] uppercase tracking-normal line-clamp-1 transition-all ${
                    isHovered ? 'text-[#d4af37]' : ''
                  }`}
                >
                  {product.title}
                </h3>
                <p className="text-[13px] sm:text-sm font-medium text-gray-700">
                  Rs. {product.price?.toLocaleString('en-IN') || '5,450'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 flex justify-center">
        <button
          onClick={onShopNowClick}
          className="px-10 py-3 rounded-full border border-black bg-white hover:bg-black hover:text-white transition-all text-[#121212] text-sm font-bold tracking-wider uppercase cursor-pointer shadow-sm hover:shadow-lg"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}
