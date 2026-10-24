import React, { useState, useMemo } from 'react';
import { ChevronDown, SlidersHorizontal, Check } from 'lucide-react';

export default function CollectionsAll({ products, onSelectProduct }) {

  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('alpha-a-z');

  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (availabilityFilter === 'in-stock') {
      result = result.filter(p => p.inStock !== false);
    } else if (availabilityFilter === 'out-of-stock') {
      result = result.filter(p => p.inStock === false);
    }

    if (minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (sortBy === 'alpha-a-z') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'alpha-z-a') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'best-selling') {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortBy === 'date-new-old') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'date-old-new') {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [products, availabilityFilter, minPrice, maxPrice, sortBy]);

  const activeFiltersCount =
    (availabilityFilter !== 'all' ? 1 : 0) +
    (minPrice !== '' || maxPrice !== '' ? 1 : 0);

  const clearAllFilters = () => {
    setAvailabilityFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('alpha-a-z');
    setOpenDropdown(null);
  };

  return (
    <div className="bg-white min-h-screen py-6 px-4 sm:px-8 max-w-[1440px] mx-auto text-[#121212]">

      <div className="py-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <span className="text-gray-600 font-normal mr-1">
              Filter:
            </span>

            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'availability' ? null : 'availability')}
                className={`flex items-center gap-1.5 transition-colors ${
                  availabilityFilter !== 'all' ? 'text-black font-semibold' : 'text-gray-800 hover:text-black'
                }`}
              >
                <span>Availability</span>
                <ChevronDown size={14} className={`transition-transform text-gray-500 ${openDropdown === 'availability' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'availability' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-30 animate-fadeIn space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                    <input
                      type="radio"
                      name="avail"
                      checked={availabilityFilter === 'all'}
                      onChange={() => { setAvailabilityFilter('all'); setOpenDropdown(null); }}
                      className="accent-black"
                    />
                    <span>All Products</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                    <input
                      type="radio"
                      name="avail"
                      checked={availabilityFilter === 'in-stock'}
                      onChange={() => { setAvailabilityFilter('in-stock'); setOpenDropdown(null); }}
                      className="accent-black"
                    />
                    <span>In stock only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                    <input
                      type="radio"
                      name="avail"
                      checked={availabilityFilter === 'out-of-stock'}
                      onChange={() => { setAvailabilityFilter('out-of-stock'); setOpenDropdown(null); }}
                      className="accent-black"
                    />
                    <span>Out of stock</span>
                  </label>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                className={`flex items-center gap-1.5 transition-colors ${
                  minPrice !== '' || maxPrice !== '' ? 'text-black font-semibold' : 'text-gray-800 hover:text-black'
                }`}
              >
                <span>Price</span>
                <ChevronDown size={14} className={`transition-transform text-gray-500 ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'price' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-30 animate-fadeIn text-xs">
                  <div className="font-semibold text-gray-700 mb-2">The highest price is Rs. 5,450.00</div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block">Rs. Min</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block">Rs. Max</span>
                      <input
                        type="number"
                        placeholder="5450"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-black"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <button
                      onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                      className="text-[11px] text-gray-500 hover:underline"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setOpenDropdown(null)}
                      className="px-3 py-1 bg-black text-white rounded text-[11px] font-bold"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-black underline ml-2"
              >
                Clear all ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <span className="text-gray-600 font-normal">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs sm:text-sm text-[#121212] font-normal outline-none cursor-pointer pr-6 appearance-none"
              >
                <option value="alpha-a-z">Alphabetically, A-Z</option>
                <option value="alpha-z-a">Alphabetically, Z-A</option>
                <option value="featured">Featured</option>
                <option value="best-selling">Best selling</option>
                <option value="price-low-high">Price, low to high</option>
                <option value="price-high-low">Price, high to low</option>
                <option value="date-new-old">Date, new to old</option>
                <option value="date-old-new">Date, old to new</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>

            <span className="text-gray-500 text-xs sm:text-sm font-normal pl-2 hidden md:inline">
              {filteredProducts.length} products
            </span>
          </div>

        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((product) => {
            const isHovered = hoveredCardId === product.id;
            const primaryImg = product.images[0];
            const secondaryImg = product.images.length > 1 ? product.images[1] : primaryImg;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                onMouseEnter={() => setHoveredCardId(product.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="cursor-pointer group flex flex-col"
              >

                <div
                  className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl"
                  style={{
                    backgroundColor: product.cardBg || (product.primaryColor?.name === 'Off White' ? '#ffffff' : '#18191f')
                  }}
                >
                  <img
                    src={isHovered && product.images.length > 1 ? secondaryImg : primaryImg}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out transform group-hover:scale-105"
                    loading="lazy"
                  />

                  {product.remainingUnits !== undefined && (
                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider text-white border border-white/10">
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
      ) : (
        <div className="text-center py-24 text-gray-500 text-sm">
          <p>No products match your selected filters.</p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-6 py-2.5 rounded border border-black text-black hover:bg-black hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
          >
            Clear all filters
          </button>
        </div>
      )}

    </div>
  );
}
