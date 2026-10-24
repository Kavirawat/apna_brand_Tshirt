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
      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#121318]/80 backdrop-blur-md flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-[#d4af37]/40 hover:shadow-2xl hover:shadow-black/70"
    >

      <div
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/5] w-full overflow-hidden flex items-center justify-center cursor-pointer"
        style={{
          backgroundColor: product.cardBg || (product.primaryColor?.name === 'Off White' ? '#ffffff' : (product.primaryColor?.cardBg || '#121318'))
        }}
      >
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-black/80 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-red-600/90 text-white backdrop-blur-md">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-all duration-300 z-10 hover:scale-110"
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-300'}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 py-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-1.5 drop-shadow">
            <Eye size={14} className="text-[#d4af37]" />
            VIEW PRODUCT & COLOR AMBIANCE
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>

          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-sanskrit text-sm text-[#d4af37] tracking-wider font-semibold">
              {product.sanskritTitle || product.title}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-gray-300">
              <Star size={12} className="fill-[#d4af37] text-[#d4af37]" />
              <span>{product.rating}</span>
              <span className="text-gray-500">({product.reviewsCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-white group-hover:text-yellow-300 transition-colors cursor-pointer line-clamp-1 uppercase tracking-wide"
          >
            {product.title}
          </h3>

          <p className="text-[11px] text-gray-400 italic line-clamp-1 mt-1 font-serif">
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
                    className={`w-4 h-4 rounded-full border transition-all ${
                      isSelected
                        ? 'border-yellow-400 scale-125 ring-2 ring-yellow-400/40'
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

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 tracking-wider">Inclusive of all taxes</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 'L', selectedColor, 1);
            }}
            className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-[#d4af37] text-white hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
            title="Add to Bag"
          >
            <ShoppingBag size={15} />
            <span className="hidden sm:inline">ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
}
