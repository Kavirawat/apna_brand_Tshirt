import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useThemeColor } from '../context/ThemeColorContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { setThemeByColorName } = useThemeColor();
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors[0]?.name ? product.colors[0].name : (product.primaryColor?.name || 'Black')
  );
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.some(p => p.id === product.id);

  const displayImage = isHovered && product.images && product.images.length > 1
    ? product.images[1]
    : (product.images && product.images[0]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl overflow-hidden border border-[#234f60] border-t-white/20 bg-[#163643] flex flex-col justify-between transition-all duration-500 hover:-translate-y-3 hover:border-[#f0aa93]/60 hover:shadow-2xl hover:shadow-[0_25px_50px_rgba(10,25,33,0.85)]"
    >

      <div
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/5] w-full overflow-hidden flex items-center justify-center cursor-pointer bg-black/20"
        style={{
          backgroundColor: product.cardBg || (product.primaryColor?.name === 'Off White' ? '#ffffff' : '#183c4b')
        }}
      >
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-black/80 text-[#f0aa93] border border-[#f0aa93]/40 backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-[#f0aa93] text-[#122832] font-mono shadow-md backdrop-blur-md">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-all duration-300 z-10 hover:scale-110 cursor-pointer"
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-[#f0aa93] text-[#f0aa93]' : 'text-gray-300'}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 py-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-1.5 drop-shadow">
            <Eye size={14} className="text-[#f0aa93]" />
            VIEW PRODUCT
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>

          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-sanskrit text-sm text-[#f0aa93] tracking-wider font-semibold">
              {product.sanskritTitle || product.title}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-gray-300">
              <span className="text-[#f0aa93] tracking-wider">★ ★ ★ ★ ★</span>
              <span className="font-bold text-white">{product.rating || '4.9'}</span>
              <span className="text-gray-400">({product.reviewsCount || 85})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-white group-hover:text-[#f0aa93] transition-colors cursor-pointer line-clamp-1 uppercase tracking-wide"
          >
            {product.title}
          </h3>

          <p className="text-[11px] text-gray-300 italic line-clamp-1 mt-1 font-serif">
            {product.philosophyQuote}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Color:</span>
            <div className="flex items-center gap-1.5">
              {product.colors && product.colors.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(c.name);
                      setThemeByColorName(c.name);
                    }}
                    title={`Preview in ${c.name}`}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#f0aa93] scale-125 ring-2 ring-[#f0aa93]/40'
                        : 'border-white/30 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-gray-400 font-mono">({selectedColor})</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-[#f0aa93] font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-gray-400 line-through font-mono">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 'L', selectedColor, 1);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#f0aa93] hover:bg-white text-[#122832] font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
            title="Add to Bag"
          >
            <ShoppingBag size={14} />
            <span>ADD</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
