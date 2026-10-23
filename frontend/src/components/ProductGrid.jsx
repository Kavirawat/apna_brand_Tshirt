import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  onSelectProduct,
  activeCategory,
  onSelectCategory,
  activeColorFilter,
  onSelectColorFilter
}) {
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    { name: 'ALL PIECES', value: 'All' },
    { name: 'OVERSIZED T-SHIRTS', value: 'Oversized T-Shirts' },
    { name: 'SWEATSHIRTS & HOODIES', value: 'Sweatshirts' },
    { name: 'SHIRTS', value: 'Shirts' }
  ];

  let filtered = [...products];

  if (activeCategory && activeCategory !== 'All') {
    filtered = filtered.filter(p =>
      p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      p.title.toLowerCase().includes(activeCategory.toLowerCase())
    );
  }

  if (activeColorFilter) {
    filtered = filtered.filter(p =>
      p.colors && p.colors.some(c => c.name.toLowerCase().includes(activeColorFilter.toLowerCase()))
    );
  }

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <section id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                activeCategory === cat.value
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4">
          <span className="text-xs text-gray-400 font-mono">
            Showing <strong className="text-white">{filtered.length}</strong> creations
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121318] text-xs font-semibold text-gray-200 border border-white/15 rounded-xl px-3 py-2 outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="featured">Featured Sacred Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {(activeCategory !== 'All' || activeColorFilter) && (
        <div className="flex items-center gap-2 mt-4 text-xs">
          <span className="text-gray-400">Active filters:</span>
          {activeCategory !== 'All' && (
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white flex items-center gap-1">
              Category: {activeCategory}
              <button onClick={() => onSelectCategory('All')} className="hover:text-red-400">×</button>
            </span>
          )}
          {activeColorFilter && (
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white flex items-center gap-1">
              Color: {activeColorFilter}
              <button onClick={() => onSelectColorFilter(null)} className="hover:text-red-400">×</button>
            </span>
          )}
          <button
            onClick={() => {
              onSelectCategory('All');
              onSelectColorFilter(null);
            }}
            className="text-xs text-[#d4af37] hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 rounded-2xl bg-white/5 border border-white/10 mt-8">
          <Sparkles size={32} className="mx-auto text-yellow-400 mb-3" />
          <h3 className="font-serif text-lg font-bold text-white uppercase">No Sacred Pieces Found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Try adjusting your category or color filter to explore other silhouettes.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              onSelectColorFilter(null);
            }}
            className="mt-4 px-5 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase"
          >
            Show All Products
          </button>
        </div>
      )}
    </section>
  );
}
