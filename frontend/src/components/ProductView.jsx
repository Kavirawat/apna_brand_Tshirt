import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, ShieldCheck, Truck, RotateCcw,
  Star, Layers, Sparkles, Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useThemeColor } from '../context/ThemeColorContext';
import DropCountdown, { useCountdown } from './DropCountdown';

export default function ProductView({ product, onBack, onOpenSizeGuide }) {
  if (!product) return null;

  const { addToCart, setIsCartOpen } = useCart();
  const theme = useThemeColor?.() || {};
  const setThemeByColorName = theme.setThemeByColorName || (() => {});

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [selectedBundle, setSelectedBundle] = useState('single');
  const [activeTab, setActiveTab] = useState('piece');

  const initialColor = product.colors && product.colors[0]?.name
    ? product.colors[0].name
    : (product.primaryColor?.name || 'Maroon');
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const activeColorObj = (product.colors && product.colors.find(c => c.name === selectedColor))
    || product.primaryColor
    || { name: selectedColor, hex: '#6b1724' };

  const hasDropExpiry = Boolean(product.dropExpiresAt);
  const { isExpired } = useCountdown(product.dropExpiresAt);
  const isVaultClosed = hasDropExpiry ? isExpired : (product.remainingUnits !== undefined && product.remainingUnits <= 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
  }, [product]);

  const handleSelectColor = (colorName) => {
    setSelectedColor(colorName);
    if (setThemeByColorName) {
      setThemeByColorName(colorName);
    }
  };

  const handleAddToCart = () => {
    if (isVaultClosed) {
      alert('This limited drop has expired and is locked in the archive.');
      return;
    }
    const finalPrice = selectedBundle === 'bundle3' ? 3650 : (product.price || 5450);
    const finalTitle = selectedBundle === 'bundle3'
      ? `${product.title} (Bundle of 3 Pack)`
      : product.title;

    addToCart(
      {
        ...product,
        price: finalPrice,
        title: finalTitle
      },
      selectedSize,
      selectedColor,
      quantity
    );

    setIsCartOpen(true);
  };

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Tat_pro_exp_3.png?v=1788420950',
    'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_ubg.png?v=1791201501',
    'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_pro_exp_1.png?v=1788423293'
  ];

  const singlePrice = product.price || 5450;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 bg-[#122731] text-white font-sans selection:bg-[#f0aa93] selection:text-[#122731]">
      <div className="max-w-[1360px] mx-auto">

        {/* Back Link & Brand Ticker */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#224b5c]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-gray-400 hover:text-[#f0aa93] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>

          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#f0aa93]">
            APNA BRAND • SACRED APPAREL
          </span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* Left Column: Full-Width Fitted Showcase Image (No Fake Padding, 4:5 Aspect) */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            <div
              className="relative aspect-[4/5] w-full rounded-3xl border border-[#224b5c] overflow-hidden shadow-2xl group transition-all"
              style={{
                backgroundColor: product.cardBg || '#163643'
              }}
            >
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
              />

              {product.remainingUnits && (
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-white border border-white/20 z-10 shadow-lg">
                  {isVaultClosed ? 'VAULT CLOSED' : `LIMITED • ${product.remainingUnits} LEFT`}
                </div>
              )}

              {product.discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white font-mono font-black text-xs px-3.5 py-1 rounded-full shadow-lg z-10">
                  {product.discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Seamless Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all p-0 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#f0aa93] ring-2 ring-[#f0aa93]/40 shadow-xl scale-105'
                        : 'border-[#224b5c] bg-[#163643] opacity-60 hover:opacity-100 hover:border-white/50'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Dark Dashboard Theme Specs & Actions */}
          <div className="lg:col-span-5 flex flex-col space-y-5 lg:sticky lg:top-24">

            {/* Title & Price */}
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase block mb-1 text-[#f0aa93]">
                APNA BRAND
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                {product.title}
              </h1>

              <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                  Rs. {singlePrice.toLocaleString('en-IN')}.00
                </span>
                {product.compareAtPrice && product.compareAtPrice > singlePrice && (
                  <span className="text-sm line-through text-gray-400 font-mono">
                    Rs. {product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-gray-400">
                  <a href="#shipping-tab" onClick={() => setActiveTab('shipping')} className="underline hover:text-[#f0aa93]">
                    Shipping
                  </a> calculated at checkout.
                </span>
              </div>
            </div>

            {/* Stock Pulse Indicator */}
            <div className="flex items-center gap-2 py-0.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-xs font-semibold text-gray-200">
                Low stock - {product.remainingUnits || 20} items left
              </span>
            </div>

            {/* Reviews Rating */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex text-amber-400 text-sm tracking-wider">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <span className="font-bold text-xs text-white font-mono">4.41</span>
              <span className="text-gray-500">·</span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                {product.reviewsCount || 85} REVIEWS
              </span>
            </div>

            {/* Drop Countdown */}
            <div className="pt-1">
              <DropCountdown
                expiresAt={product.dropExpiresAt}
                totalUnits={product.totalUnits || 75}
                remainingUnits={product.remainingUnits || 20}
                isLight={false}
              />
            </div>

            {/* Color Selector */}
            <div className="pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2 text-gray-300">
                COLOR: <span className="font-bold text-[#f0aa93]">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {product.colors && product.colors.length > 0 ? (
                  product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleSelectColor(c.name)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-[#f0aa93] bg-[#f0aa93] text-[#122731] shadow-lg'
                          : 'border-[#224b5c] bg-[#163643] text-gray-200 hover:border-white/50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))
                ) : (
                  <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#f0aa93] bg-[#f0aa93] text-[#122731] text-xs font-bold shadow-lg">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/40"
                      style={{ backgroundColor: activeColorObj.hex || '#6b1724' }}
                    />
                    <span>{selectedColor}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                  SIZE: <span className="font-bold text-[#f0aa93]">{selectedSize}</span>
                </span>

                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider uppercase border border-[#224b5c] bg-[#163643] rounded-lg hover:border-[#f0aa93] hover:text-[#f0aa93] transition-colors text-gray-300 cursor-pointer"
                >
                  SIZE GUIDE
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={isVaultClosed}
                    className={`py-2 rounded-xl text-xs font-bold tracking-wide transition-all border cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#f0aa93] text-[#122731] border-[#f0aa93] shadow-lg font-black'
                        : 'border-[#224b5c] bg-[#163643] text-gray-200 hover:border-white/50'
                    } ${isVaultClosed ? 'opacity-35 cursor-not-allowed' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Bundles Options */}
            <div className="space-y-3 pt-2">

              {/* Single Unit Option */}
              <div
                onClick={() => setSelectedBundle('single')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedBundle === 'single'
                    ? 'border-[#f0aa93] bg-[#163643] ring-1 ring-[#f0aa93]/60 shadow-xl'
                    : 'border-[#224b5c] bg-[#163643]/60 hover:border-[#224b5c]/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedBundle === 'single' ? 'border-[#f0aa93]' : 'border-gray-500'}`}>
                    {selectedBundle === 'single' && <div className="w-2 h-2 rounded-full bg-[#f0aa93]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white uppercase block line-clamp-1">
                      {product.sanskritTitle || product.title}
                    </span>
                    <span className="text-xs text-[#f0aa93] font-mono font-bold">
                      Rs. {singlePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {!isVaultClosed && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center border border-[#224b5c] rounded-xl bg-[#122731] px-2 py-0.5 shadow-inner"
                  >
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-bold font-mono text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Bundle 3 Special Option */}
              <div
                onClick={() => setSelectedBundle('bundle3')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                  selectedBundle === 'bundle3'
                    ? 'border-[#f0aa93] bg-[#163643] ring-1 ring-[#f0aa93]/60 shadow-xl'
                    : 'border-[#224b5c] bg-[#163643]/60 hover:border-[#224b5c]/80'
                }`}
              >
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded bg-[#f0aa93] text-[#122731] text-[9px] font-black tracking-wider uppercase shadow-md">
                  BEST VALUE
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedBundle === 'bundle3' ? 'border-[#f0aa93]' : 'border-gray-500'}`}>
                      {selectedBundle === 'bundle3' && <div className="w-2 h-2 rounded-full bg-[#f0aa93]" />}
                    </div>
                    <span className="text-xs font-bold text-white">
                      Pick Any 3 of Your Favourite
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white font-mono block">
                      Rs. 3,650
                    </span>
                    <span className="text-[10px] text-gray-400 line-through font-mono">
                      Rs. 5,450
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-[#224b5c]">
                  <div className="p-2 rounded-xl bg-[#122731] border border-[#224b5c] flex flex-col items-center text-center">
                    <div className="w-12 h-14 rounded-lg bg-[#163643] border border-[#224b5c] flex items-center justify-center overflow-hidden mb-1">
                      <img
                        src={images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-gray-200 line-clamp-1 uppercase">
                      {product.sanskritTitle || product.title.split('—')[0]}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#122731] border border-dashed border-[#224b5c] flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-lg bg-[#163643] border border-[#224b5c] flex items-center justify-center mb-1 text-[#f0aa93] shadow-xs">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-[9px] font-medium text-gray-400 leading-tight">
                      Choose product
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#122731] border border-dashed border-[#224b5c] flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-lg bg-[#163643] border border-[#224b5c] flex items-center justify-center mb-1 text-[#f0aa93] shadow-xs">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-[9px] font-medium text-gray-400 leading-tight">
                      Choose product
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-3">
              {isVaultClosed ? (
                <button
                  disabled
                  className="w-full py-4 rounded-2xl bg-gray-800 text-gray-500 font-bold text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock size={15} />
                  <span>VAULT CLOSED • DROP EXPIRED</span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-2xl bg-[#f0aa93] hover:bg-white text-[#122731] font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-2xl active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_30px_rgba(240,170,147,0.4)]"
                >
                  <span>Add to cart</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Tabbed Info Section (Dashboard Dark Container) */}
        <div id="shipping-tab" className="mt-14 rounded-3xl border border-[#224b5c] bg-[#163643] overflow-hidden shadow-2xl">

          <div className="flex items-center border-b border-[#224b5c] bg-[#122731] overflow-x-auto scrollbar-none">
            {[
              { id: 'piece', label: 'THE PIECE' },
              { id: 'fabric', label: 'FABRIC / FIT' },
              { id: 'shipping', label: 'SHIPPING' },
              { id: 'exchange', label: 'EXCHANGE' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-4 px-4 text-center text-xs tracking-wider transition-all relative cursor-pointer ${
                  activeTab === tab.id
                    ? 'font-bold text-[#f0aa93] border-b-2 border-[#f0aa93] bg-[#163643]/50'
                    : 'font-semibold text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10">

            {activeTab === 'piece' && (
              <div className="animate-fadeIn">
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#f0aa93] uppercase block mb-1">
                  FASHION × PHILOSOPHY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
                  MORE THAN <span className="text-[#f0aa93]">CLOTHING.</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed mb-8">
                  Indian philosophy, expressed through distinctive artwork and heavyweight streetwear.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6 border-t border-[#224b5c]">
                  <div className="flex items-baseline gap-3 pb-4 border-b border-[#224b5c]">
                    <span className="font-mono text-xs text-[#f0aa93]">01</span>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                      PHILOSOPHY YOU CAN WEAR
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 pb-4 border-b border-[#224b5c]">
                    <span className="font-mono text-xs text-[#f0aa93]">02</span>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                      RARE BY DESIGN
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 pb-4 border-b border-[#224b5c]">
                    <span className="font-mono text-xs text-[#f0aa93]">03</span>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                      HEAVYWEIGHT COTTON
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 pb-4 border-b border-[#224b5c]">
                    <span className="font-mono text-xs text-[#f0aa93]">04</span>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                      STRUCTURED OVERSIZED FIT
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-gray-400 pt-8 mt-2">
                  <span>ROOTED IN BHARAT.</span>
                  <span className="hover:text-[#f0aa93] cursor-pointer transition-colors">WORN EVERYWHERE. ↗</span>
                </div>
              </div>
            )}

            {activeTab === 'fabric' && (
              <div className="animate-fadeIn">
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#f0aa93] uppercase block mb-1">
                  FABRIC / CONSTRUCTION
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-6">
                  HEAVYWEIGHT. <span className="text-[#f0aa93]">BY DESIGN.</span>
                </h2>

                <div className="space-y-4 divide-y divide-[#224b5c]">
                  <div className="pt-3 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white uppercase">OVERSIZED T-SHIRT / SHIRT</div>
                      <div className="text-xs text-gray-400">Heavyweight cotton</div>
                    </div>
                    <span className="text-xs font-black font-mono text-[#f0aa93]">260 GSM</span>
                  </div>

                  <div className="pt-4 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white uppercase">HOODIE / SWEATSHIRT</div>
                      <div className="text-xs text-gray-400">Heavyweight loopback cotton</div>
                    </div>
                    <span className="text-xs font-black font-mono text-[#f0aa93]">400 GSM</span>
                  </div>

                  <div className="pt-4 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white uppercase">FIT</div>
                      <div className="text-xs text-gray-400">Unisex / relaxed silhouette</div>
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">OVERSIZED</span>
                  </div>

                  <div className="pt-5">
                    <span className="text-[11px] font-bold text-[#f0aa93] uppercase block mb-1">SIZE NOTE</span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      For a less oversized fit, we recommend choosing one size down. Compare measurements with the Size Guide before ordering.
                    </p>
                  </div>

                  <div className="pt-5">
                    <span className="text-[11px] font-bold text-[#f0aa93] uppercase block mb-1">GARMENT CARE</span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Reverse hand wash only. Iron inside out.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="animate-fadeIn">
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#f0aa93] uppercase block mb-1">
                  GLOBAL DELIVERY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
                  MADE IN BHARAT. <span className="text-[#f0aa93]">WORN EVERYWHERE.</span>
                </h2>

                <div className="flex items-center gap-2 text-xs font-bold text-[#f0aa93] uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#f0aa93]"></span>
                  <span>FREE WORLDWIDE SHIPPING</span>
                </div>

                <div className="space-y-4 divide-y divide-[#224b5c]">
                  <div className="pt-3 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white uppercase">DISPATCH</div>
                      <div className="text-xs text-gray-400">Order preparation</div>
                    </div>
                    <span className="text-xs font-black text-[#f0aa93] uppercase">WITHIN 3 DAYS</span>
                  </div>

                  <div className="pt-4 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white uppercase">INDIA</div>
                      <div className="text-xs text-gray-400">Estimated delivery</div>
                    </div>
                    <span className="text-xs font-black text-[#f0aa93] uppercase">6–8 DAYS</span>
                  </div>

                  <div className="pt-4 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white uppercase">INTERNATIONAL</div>
                      <div className="text-xs text-gray-400">Estimated delivery</div>
                    </div>
                    <span className="text-xs font-black text-[#f0aa93] uppercase">12–18 DAYS</span>
                  </div>

                  <div className="pt-5">
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Delivery estimates are in business days and may vary by destination, customs processing, or carrier conditions. Shipping protection is provided according to our shipping policy.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exchange' && (
              <div className="animate-fadeIn">
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#f0aa93] uppercase block mb-1">
                  POST-PURCHASE SUPPORT
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-6">
                  THE RIGHT <span className="text-[#f0aa93]">FIT MATTERS.</span>
                </h2>

                <div className="space-y-5 divide-y divide-[#224b5c]">
                  <div className="pt-3">
                    <div className="text-xs font-bold text-white uppercase mb-1">INDIAN ORDERS</div>
                    <p className="text-xs text-gray-300">
                      One-time size exchange available, subject to our exchange policy.
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="text-xs font-bold text-white uppercase mb-1">INTERNATIONAL ORDERS</div>
                    <p className="text-xs text-gray-300">
                      One-time size exchange available. Applicable shipping and processing charges apply.
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="text-xs font-bold text-white uppercase">NEED ASSISTANCE?</div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      For an order issue or exchange request, contact our support team promptly. Eligibility and reporting deadlines are governed by our policy.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.querySelector('[aria-label="Open Support Team Desk"]');
                        if (el) el.click();
                        else alert('Our support team is available 24/7 on Live Chat.');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#f0aa93] hover:bg-[#f0aa93] hover:text-[#122731] transition-colors text-xs font-bold uppercase tracking-wider text-[#f0aa93] mt-2 cursor-pointer"
                    >
                      <span>CONTACT CUSTOMER SUPPORT</span>
                      <span>↗</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom 3 Trust Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-[#163643] rounded-3xl border border-[#224b5c] p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full border border-[#224b5c] bg-[#122731] flex items-center justify-center flex-shrink-0 text-[#f0aa93]">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide uppercase">
                MADE IN INDIA
              </div>
              <div className="text-xs text-gray-400">
                Rooted in Bharat • Pure Craft
              </div>
            </div>
          </div>

          <div className="bg-[#163643] rounded-3xl border border-[#224b5c] p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full border border-[#224b5c] bg-[#122731] flex items-center justify-center flex-shrink-0 text-[#f0aa93]">
              <Star size={20} strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide uppercase">
                5,000+ CUSTOMERS
              </div>
              <div className="text-xs text-gray-400">
                Trusted Worldwide
              </div>
            </div>
          </div>

          <div className="bg-[#163643] rounded-3xl border border-[#224b5c] p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full border border-[#224b5c] bg-[#122731] flex items-center justify-center flex-shrink-0 text-[#f0aa93]">
              <Layers size={20} strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide uppercase">
                260–400 GSM
              </div>
              <div className="text-xs text-gray-400">
                Heavyweight Cotton
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
