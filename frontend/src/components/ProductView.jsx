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
    : (product.primaryColor?.name || 'Pink');
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const activeColorObj = (product.colors && product.colors.find(c => c.name === selectedColor))
    || product.primaryColor
    || { name: selectedColor, hex: '#f4beca' };

  const getButtonBgColor = () => {
    if (activeColorObj && activeColorObj.hex) {
      return activeColorObj.hex;
    }
    const lower = (selectedColor || '').toLowerCase();
    if (lower.includes('pink') || lower.includes('rose')) return '#f4beca';
    if (lower.includes('black') || lower.includes('onyx')) return '#111113';
    if (lower.includes('maroon') || lower.includes('red') || lower.includes('agni')) return '#6b1724';
    if (lower.includes('blue') || lower.includes('navy')) return '#1e293b';
    if (lower.includes('lavender') || lower.includes('purple')) return '#c8b6e2';
    if (lower.includes('white') || lower.includes('cream')) return '#e8e4dc';
    if (lower.includes('sage') || lower.includes('green')) return '#78866b';
    return '#f4beca';
  };

  const buttonBgColor = getButtonBgColor();

  const getContrastColor = (hex) => {
    if (!hex) return '#1c1917';
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return '#1c1917';
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 150) ? '#1c1917' : '#ffffff';
  };

  const buttonTextColor = getContrastColor(buttonBgColor);

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
    const finalPrice = selectedBundle === 'bundle3' ? 3650 : (product.price || 1800);
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
    'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_ubg.png?v=1791201501',
    'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_pro_exp_1.png?v=1788423293',
    'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Tat_pro_exp_3.png?v=1788420950'
  ];

  const singlePrice = product.price || 1800;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 bg-[#fafafa] text-gray-900 font-sans transition-colors duration-500">
      <div className="max-w-[1360px] mx-auto">

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>

          <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">
            APNA BRAND • SACRED APPAREL
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <div className="lg:col-span-7 flex flex-col gap-4">

            <div className="relative aspect-square w-full rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 shadow-xs flex items-center justify-center overflow-hidden group">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 select-none"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all bg-white p-1.5 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-black ring-2 ring-black/20 shadow-xs'
                        : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain pointer-events-none" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col space-y-4 lg:sticky lg:top-24">

            <div>
              <span className="text-[11px] font-semibold tracking-widest uppercase block mb-1 text-gray-400">
                APNA BRAND
              </span>

              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-gray-900 leading-snug">
                {product.title}
              </h1>

              <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-mono">
                  Rs. {singlePrice.toLocaleString('en-IN')}.00
                </span>
                {product.compareAtPrice && product.compareAtPrice > singlePrice && (
                  <span className="text-sm line-through text-gray-400 font-mono">
                    Rs. {product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-gray-500">
                  <a href="#shipping-tab" onClick={() => setActiveTab('shipping')} className="underline hover:text-black">
                    Shipping
                  </a> calculated at checkout.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 py-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e53935]"></span>
              </span>
              <span className="text-xs font-medium text-gray-800">
                Low stock - {product.remainingUnits || 14} items left
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#f2bd24] text-base leading-none drop-shadow-sm">
                ★★★★★
              </span>
              <span className="font-semibold text-xs text-gray-800">4.41</span>
              <span className="text-gray-300">·</span>
              <span className="text-[11px] uppercase tracking-wider text-gray-500">
                {product.reviewsCount || 98} REVIEWS
              </span>
            </div>

            <div className="pt-1">
              <DropCountdown
                expiresAt={product.dropExpiresAt}
                totalUnits={product.totalUnits || 75}
                remainingUnits={product.remainingUnits || 17}
                isLight={true}
              />
            </div>

            <div className="pt-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-2 text-gray-600">
                COLOR: <span className="font-bold text-gray-900">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {product.colors && product.colors.length > 0 ? (
                  product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleSelectColor(c.name)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        selectedColor === c.name
                          ? 'border-black bg-black text-white shadow-sm'
                          : 'border-gray-300 bg-white text-gray-800 hover:border-black'
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
                  <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black bg-black text-white text-xs font-medium">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/40"
                      style={{ backgroundColor: activeColorObj.hex || '#f4beca' }}
                    />
                    <span>{selectedColor}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  SIZE: <span className="font-bold text-gray-900">{selectedSize}</span>
                </span>

                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase border border-gray-300 rounded-lg hover:border-black transition-colors text-gray-700"
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
                    className={`py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border ${
                      selectedSize === size
                        ? 'bg-black text-white border-black shadow-sm font-bold'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                    } ${isVaultClosed ? 'opacity-35 cursor-not-allowed' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">

              <div
                onClick={() => setSelectedBundle('single')}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedBundle === 'single'
                    ? 'border-gray-900 bg-white shadow-xs ring-1 ring-gray-900'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedBundle === 'single' ? 'border-black' : 'border-gray-300'}`}>
                    {selectedBundle === 'single' && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 uppercase block line-clamp-1">
                      {product.sanskritTitle || product.title}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono font-bold">
                      Rs. {singlePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {!isVaultClosed && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-50 px-1.5 py-0.5 shadow-xs"
                  >
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-600 hover:text-black transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-bold font-mono text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-600 hover:text-black transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <div
                onClick={() => setSelectedBundle('bundle3')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                  selectedBundle === 'bundle3'
                    ? 'shadow-xs ring-2'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{
                  borderColor: selectedBundle === 'bundle3' ? buttonBgColor : undefined,
                  boxShadow: selectedBundle === 'bundle3' ? `0 0 0 1px ${buttonBgColor}` : undefined
                }}
              >

                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded bg-[#2e3037] text-white text-[9px] font-extrabold tracking-wider uppercase">
                  BEST VALUE
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedBundle === 'bundle3' ? 'border-black' : 'border-gray-300'}`}>
                      {selectedBundle === 'bundle3' && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      Pick Any 3 of Your Favourite
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-900 font-mono block">
                      Rs. 3,650
                    </span>
                    <span className="text-[10px] text-gray-400 line-through font-mono">
                      Rs. 5,450
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-gray-100">

                  <div className="p-2 rounded-xl bg-gray-50/80 border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-12 h-14 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden mb-1">
                      <img
                        src={images[0]}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-gray-800 line-clamp-1 uppercase">
                      {product.sanskritTitle || product.title.split('—')[0]}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-gray-50/80 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-1 text-gray-500 shadow-xs">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-[9px] font-medium text-gray-600 leading-tight">
                      Choose product
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-gray-50/80 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-1 text-gray-500 shadow-xs">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-[9px] font-medium text-gray-600 leading-tight">
                      Choose product
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              {isVaultClosed ? (
                <button
                  disabled
                  className="w-full py-4 rounded-xl bg-gray-200 text-gray-500 font-bold text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock size={15} />
                  <span>VAULT CLOSED • DROP EXPIRED</span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
                  style={{
                    backgroundColor: buttonBgColor,
                    color: buttonTextColor
                  }}
                >
                  <span>Add to cart</span>
                </button>
              )}
            </div>

          </div>

        </div>

        <div id="shipping-tab" className="mt-14 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">

          <div className="flex items-center border-b border-gray-200 bg-white overflow-x-auto scrollbar-none">
            {[
              { id: 'piece', label: 'THE PIECE' },
              { id: 'fabric', label: 'FABRIC / FIT' },
              { id: 'shipping', label: 'SHIPPING' },
              { id: 'exchange', label: 'EXCHANGE' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-4 px-4 text-center text-xs tracking-wider transition-all relative ${
                  activeTab === tab.id
                    ? 'font-bold text-black border-b-2 border-black'
                    : 'font-semibold text-gray-400 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10">

            {activeTab === 'piece' && (
              <div className="animate-fadeIn">
                <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase block mb-1">
                  FASHION × PHILOSOPHY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-3">
                  MORE THAN <span className="text-gray-400">CLOTHING.</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed mb-8">
                  Indian philosophy, expressed through distinctive artwork and heavyweight streetwear.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6 border-t border-gray-100">
                  <div className="flex items-baseline gap-3 pb-4 border-b border-gray-100">
                    <span className="font-mono text-xs text-gray-400">01</span>
                    <span className="text-xs sm:text-sm font-bold text-black tracking-wide uppercase">
                      PHILOSOPHY YOU CAN WEAR
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 pb-4 border-b border-gray-100">
                    <span className="font-mono text-xs text-gray-400">02</span>
                    <span className="text-xs sm:text-sm font-bold text-black tracking-wide uppercase">
                      RARE BY DESIGN
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 pb-4 border-b border-gray-100">
                    <span className="font-mono text-xs text-gray-400">03</span>
                    <span className="text-xs sm:text-sm font-bold text-black tracking-wide uppercase">
                      HEAVYWEIGHT COTTON
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 pb-4 border-b border-gray-100">
                    <span className="font-mono text-xs text-gray-400">04</span>
                    <span className="text-xs sm:text-sm font-bold text-black tracking-wide uppercase">
                      STRUCTURED OVERSIZED FIT
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-gray-400 pt-8 mt-2">
                  <span>ROOTED IN BHARAT.</span>
                  <span className="hover:text-black cursor-pointer transition-colors">WORN EVERYWHERE. ↗</span>
                </div>
              </div>
            )}

            {activeTab === 'fabric' && (
              <div className="animate-fadeIn">
                <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase block mb-1">
                  FABRIC / CONSTRUCTION
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-6">
                  HEAVYWEIGHT. <span className="text-gray-400">BY DESIGN.</span>
                </h2>

                <div className="space-y-4 divide-y divide-gray-100">
                  <div className="pt-3 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-black uppercase">OVERSIZED T-SHIRT / SHIRT</div>
                      <div className="text-xs text-gray-500">Heavyweight cotton</div>
                    </div>
                    <span className="text-xs font-black font-mono text-black">260 GSM</span>
                  </div>

                  <div className="pt-4 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-black uppercase">HOODIE / SWEATSHIRT</div>
                      <div className="text-xs text-gray-500">Heavyweight cotton</div>
                    </div>
                    <span className="text-xs font-black font-mono text-black">400 GSM</span>
                  </div>

                  <div className="pt-4 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-black uppercase">FIT</div>
                      <div className="text-xs text-gray-500">Unisex / relaxed silhouette</div>
                    </div>
                    <span className="text-xs font-black text-black uppercase tracking-wider">OVERSIZED</span>
                  </div>

                  <div className="pt-5">
                    <span className="text-[11px] font-bold text-gray-900 uppercase block mb-1">SIZE NOTE</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      For a less oversized fit, we recommend choosing one size down. Compare measurements with the Size Guide before ordering.
                    </p>
                  </div>

                  <div className="pt-5">
                    <span className="text-[11px] font-bold text-gray-900 uppercase block mb-1">GARMENT CARE</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Reverse hand wash only. Iron inside out.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="animate-fadeIn">
                <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase block mb-1">
                  GLOBAL DELIVERY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-3">
                  MADE IN BHARAT. <span className="text-gray-400">WORN EVERYWHERE.</span>
                </h2>

                <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  <span>FREE WORLDWIDE SHIPPING</span>
                </div>

                <div className="space-y-4 divide-y divide-gray-100">
                  <div className="pt-3 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-black uppercase">DISPATCH</div>
                      <div className="text-xs text-gray-500">Order preparation</div>
                    </div>
                    <span className="text-xs font-black text-black uppercase">WITHIN 3 DAYS</span>
                  </div>

                  <div className="pt-4 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-black uppercase">INDIA</div>
                      <div className="text-xs text-gray-500">Estimated delivery</div>
                    </div>
                    <span className="text-xs font-black text-black uppercase">6–8 DAYS</span>
                  </div>

                  <div className="pt-4 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-black uppercase">INTERNATIONAL</div>
                      <div className="text-xs text-gray-500">Estimated delivery</div>
                    </div>
                    <span className="text-xs font-black text-black uppercase">12–18 DAYS</span>
                  </div>

                  <div className="pt-5">
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Delivery estimates are in business days and may vary by destination, customs processing, or carrier conditions. Shipping protection is provided according to our shipping policy.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exchange' && (
              <div className="animate-fadeIn">
                <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase block mb-1">
                  POST-PURCHASE SUPPORT
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-6">
                  THE RIGHT <span className="text-gray-400">FIT MATTERS.</span>
                </h2>

                <div className="space-y-5 divide-y divide-gray-100">
                  <div className="pt-3">
                    <div className="text-xs font-bold text-black uppercase mb-1">INDIAN ORDERS</div>
                    <p className="text-xs text-gray-600">
                      One-time size exchange available, subject to our exchange policy.
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="text-xs font-bold text-black uppercase mb-1">INTERNATIONAL ORDERS</div>
                    <p className="text-xs text-gray-600">
                      One-time size exchange available. Applicable shipping and processing charges apply.
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="text-xs font-bold text-black uppercase">NEED ASSISTANCE?</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      For an order issue or exchange request, contact our support team promptly. Eligibility and reporting deadlines are governed by our policy.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.querySelector('[aria-label="Open Support Team Desk"]');
                        if (el) el.click();
                        else alert('Our support team is available 24/7 on Live Chat.');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-black hover:bg-black hover:text-white transition-colors text-xs font-bold uppercase tracking-wider text-black mt-2"
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex items-center gap-4 shadow-xs">
            <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-900">
              <ShieldCheck size={18} strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                MADE IN INDIA
              </div>
              <div className="text-xs text-gray-500">
                Rooted in Bharat • Pure Craft
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex items-center gap-4 shadow-xs">
            <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-900">
              <Star size={18} strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                5,000+ CUSTOMERS
              </div>
              <div className="text-xs text-gray-500">
                Trusted Worldwide
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex items-center gap-4 shadow-xs">
            <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-900">
              <Layers size={18} strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                260–400 GSM
              </div>
              <div className="text-xs text-gray-500">
                Heavyweight Cotton
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}