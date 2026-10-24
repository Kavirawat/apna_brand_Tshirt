import React, { useState } from 'react';

const FEATURED_SHOP_PRODUCTS = [
  {
    id: 1540666703879401,
    title: 'NIYATI / नियति — ZIP HOODIE',
    price: 6200,
    cardBg: '#f2f3f7',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/transs_pro_exp.png?v=1788413165',
    category: 'Hoodies',
    colors: [{ name: 'Raw White', hex: '#f0ede6' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 15406667137098,
    title: 'PRAKRITI / प्रकृति — OVERSIZED T-SHIRT',
    price: 5450,
    cardBg: '#fdf0f3',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Prakriti_ubg2.png?v=1791201886',
    category: 'Oversized T-Shirts',
    colors: [{ name: 'Lotus Rose', hex: '#f4beca' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 15406666776650,
    title: 'TAT TVAM ASI — OVERSIZED T-SHIRT',
    price: 5450,
    cardBg: '#2a2426',
    image: 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Tat_pro_exp_3.png?v=1788420950',
    category: 'Oversized T-Shirts',
    colors: [{ name: 'Deep Onyx', hex: '#1c1b1f' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL']
  },
  {
    id: 15406666711114,
    title: 'INDRA / इन्द्र — OVERSIZED T-SHIRT',
    price: 5450,
    cardBg: '#152132',
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
    <section className="bg-white text-gray-900 py-16 sm:py-24 px-4 sm:px-8 lg:px-14 select-none">
      <div className="max-w-[1360px] mx-auto">

        <h2 className="text-sm font-semibold tracking-widest text-center uppercase text-gray-900 mb-10">
          SHOP NOW
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {displayProducts.map((prod) => {
            const isHovered = hoveredProductId === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => onSelectProduct && onSelectProduct(prod)}
                onMouseEnter={() => setHoveredProductId(prod.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                className="cursor-pointer group flex flex-col"
              >

                <div
                  className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100/60 transition-all duration-500 flex items-center justify-center p-4 sm:p-5 group-hover:-translate-y-1 group-hover:shadow-2xl"
                  style={{ backgroundColor: prod.cardBg || '#f2f3f7' }}
                >
                  <img
                    src={prod.image || prod.images?.[0]}
                    alt={prod.title}
                    className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-105 z-10"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[72%] h-3.5 bg-black/35 blur-md rounded-full pointer-events-none z-0" />
                </div>

                <div className="mt-3.5 space-y-1">
                  <h3
                    className={`text-[12px] sm:text-[13px] font-normal text-gray-900 uppercase tracking-tight line-clamp-1 transition-all ${
                      isHovered ? 'underline underline-offset-2' : ''
                    }`}
                  >
                    {prod.title}
                  </h3>
                  <p className="text-[12px] sm:text-[13px] font-normal text-gray-600 font-mono">
                    Rs. {prod.price?.toLocaleString('en-IN') || '5,450'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onViewAllClick}
            className="px-8 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-normal transition-all cursor-pointer shadow-sm tracking-wide active:scale-95"
          >
            View all
          </button>
        </div>

      </div>
    </section>
  );
}
