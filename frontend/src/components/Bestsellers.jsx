import React, { useState } from 'react';

export default function Bestsellers({ products, onSelectProduct, onShopNowClick }) {
  const [hoveredId, setHoveredId] = useState(null);

  const bestsellerItems = products.slice(0, 4);

  return (
    <section className="bg-white py-10 sm:py-14 px-4 sm:px-8 max-w-[1440px] mx-auto">

      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121212] uppercase mb-8">
        BESTSELLERS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {bestsellerItems.map((product) => {
          const isHovered = hoveredId === product.id;
          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer group flex flex-col"
            >

              <div
                className="relative aspect-[1/1.18] w-full rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex items-center justify-center group-hover:shadow-md"
                style={{
                  backgroundColor: product.cardBg || '#18191f'
                }}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out transform group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {product.remainingUnits && (
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider text-white border border-white/10">
                    {product.dropStatus === 'expired' ? 'VAULT CLOSED' : `LIMITED • ${product.remainingUnits} LEFT`}
                  </div>
                )}
              </div>

              <div className="mt-3.5 space-y-1">
                <h3
                  className={`text-[13px] sm:text-sm font-normal text-[#121212] uppercase tracking-normal line-clamp-2 transition-all ${
                    isHovered ? 'underline underline-offset-[3px]' : ''
                  }`}
                >
                  {product.title}
                </h3>
                <p className="text-[13px] sm:text-sm font-normal text-[#121212]">
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
          className="px-10 py-3 rounded border border-black bg-white hover:bg-black hover:text-white transition-all text-[#121212] text-sm font-normal tracking-wide"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}
