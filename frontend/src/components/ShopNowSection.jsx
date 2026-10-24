import React, { useState } from 'react';

const FEATURED_SHOP_PRODUCTS = [
  {
    id: 1540666703879401,
    title: 'NIYATI / नियति — ZIP HOODIE',
    price: 6200,
    cardBg: '#1f3d4a',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/transs_pro_exp.png?v=1788413165',
    category: 'Hoodies',
    colors: [{ name: 'Raw White', hex: '#f0ede6' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 15406667137098,
    title: 'PRAKRITI / प्रकृति — OVERSIZED T-SHIRT',
    price: 5450,
    cardBg: '#2a3b45',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Prakriti_ubg2.png?v=1791201886',
    category: 'Oversized T-Shirts',
    colors: [{ name: 'Lotus Rose', hex: '#f4beca' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 15406666776650,
    title: 'TAT TVAM ASI — OVERSIZED T-SHIRT',
    price: 5450,
    cardBg: '#233842',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Tat_pro_exp_3.png?v=1788420950',
    category: 'Oversized T-Shirts',
    colors: [{ name: 'Deep Onyx', hex: '#1c1b1f' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL']
  },
  {
    id: 15406666711114,
    title: 'INDRA / इन्द्र — OVERSIZED T-SHIRT',
    price: 5450,
    cardBg: '#15323e',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Indra_ubg2.png?v=1791201700',
    category: 'Oversized T-Shirts',
    colors: [{ name: 'Vedic Navy', hex: '#16233b' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }
];

export default function ShopNowSection({ products, onSelectProduct, onViewAllClick }) {
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const displayProducts = FEATURED_SHOP_PRODUCTS.map((feat) => {
    const match = products && products.find(p =>
      p.id === feat.id ||
      (p.title && p.title.toLowerCase().includes(feat.title.split('/')[0].trim().toLowerCase()))
    );
    return match ? { ...match, cardBg: feat.cardBg, image: match.images?.[0] || feat.image } : feat;
  });

  return (
    <section className="bg-[#122832] text-white py-16 sm:py-24 px-4 sm:px-8 lg:px-14 select-none border-b border-[#224b5c]">
      <div className="max-w-[1360px] mx-auto">

        <div className="text-center mb-12">
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#f0aa93] uppercase block mb-1">
            CURATED COLLECTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            SHOP NOW
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {displayProducts.map((prod) => {
            const isHovered = hoveredProductId === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => onSelectProduct && onSelectProduct(prod)}
                onMouseEnter={() => setHoveredProductId(prod.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                className="cursor-pointer group flex flex-col rounded-3xl bg-white border border-gray-200 shadow-2xl hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)] transition-all duration-500 overflow-hidden justify-between"
              >

                {/* Upper Image */}
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden transition-all duration-500 bg-gray-50"
                  style={{ backgroundColor: prod.cardBg || '#f8f8f8' }}
                >
                  <img
                    src={prod.image || prod.images?.[0]}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Lower Details: White Card + Black Font & Price */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3 bg-white text-black">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block font-semibold">
                      {prod.category || 'Oversized Tee'}
                    </span>
                    <h3
                      className={`text-sm sm:text-base font-bold text-black uppercase tracking-tight line-clamp-1 transition-colors ${
                        isHovered ? 'text-gray-600' : ''
                      }`}
                    >
                      {prod.title}
                    </h3>
                    <p className="text-base sm:text-lg font-black text-black font-mono pt-1">
                      Rs. {prod.price?.toLocaleString('en-IN') || '5,450'}
                    </p>
                  </div>

                  {/* Rating in Stars */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-500 text-xs tracking-wider">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                      </div>
                      <span className="text-xs font-bold text-black font-mono">4.9</span>
                      <span className="text-[11px] text-gray-500">(72)</span>
                    </div>

                    <span className="text-[11px] font-bold text-black uppercase tracking-wider group-hover:translate-x-1 transition-transform">
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
            onClick={onViewAllClick}
            className="px-10 py-3.5 rounded-full bg-[#f0aa93] hover:bg-white text-[#122832] transition-all text-xs font-black tracking-widest uppercase cursor-pointer shadow-xl hover:scale-105 active:scale-95"
          >
            View More
          </button>
        </div>

      </div>
    </section>
  );
}
