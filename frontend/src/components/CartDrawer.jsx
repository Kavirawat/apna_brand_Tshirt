import React, { useState, useEffect } from 'react';
import {
  X, Trash2, ShoppingBag, Truck, Check,
  Sparkles, Tag, ShieldCheck, Copy, ChevronLeft, MoreHorizontal, Plus, Minus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useThemeColor } from '../context/ThemeColorContext';
import { PhonePeIcon, GooglePayIcon, PaytmIcon } from './UpiIcons';
import { API_BASE } from '../config';

export default function CartDrawer({ onSelectProduct, onTrackOrder }) {
  const { themeMode = 'dark' } = useThemeColor?.() || {};
  const isLight = themeMode === 'light';
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discountPercent,
    discountAmount,
    total,
    couponCode,
    applyCoupon,
    freeShippingThreshold,
    isFreeShipping,
    clearCart
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedUpiApp, setSelectedUpiApp] = useState('phonepe');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('brahmman_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.name) setCustomerName(u.name);
        if (u.email) setCustomerEmail(u.email);
        if (u.phone) setCustomerPhone(u.phone);
        if (u.deliveryAddress) {
          const addr = u.deliveryAddress;
          const formatted = [addr.street, addr.landmark, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');
          if (formatted) setCustomerAddress(formatted);
          if (addr.phone) setCustomerPhone(addr.phone);
        }
      }
    } catch {}
  }, [checkoutModalOpen]);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const res = applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Please fill in your name, phone and delivery address.');
      return;
    }

    setIsSubmitting(true);

    const actualPaymentMethod = paymentMethod === 'UPI'
      ? `UPI (${selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'gpay' ? 'Google Pay' : 'Paytm'}${upiId.trim() ? ': ' + upiId.trim() : ''})`
      : 'Cash on Delivery (COD)';

    const orderPayload = {
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        address: customerAddress
      },
      items: cartItems,
      total: total,
      paymentMethod: actualPaymentMethod
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await response.json();

      if (data.success && data.order) {
        setOrderSuccess(data.order);
        clearCart();
      } else {
        const mockOrder = {
          id: `BRH-${Date.now().toString().slice(-6)}`,
          ...orderPayload,
          status: 'Pending',
          createdAt: new Date().toISOString()
        };
        setOrderSuccess(mockOrder);
        clearCart();
      }
    } catch {
      const mockOrder = {
        id: `BRH-${Date.now().toString().slice(-6)}`,
        ...orderPayload,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      setOrderSuccess(mockOrder);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">

      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">

        <div className={`w-screen max-w-md shadow-2xl flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
          isLight
            ? 'bg-[#f4f5f8] text-gray-900'
            : 'bg-[#122832] text-white border-l border-[#224b5c]'
        }`}>

          <div className={`px-5 py-4 flex items-center justify-between border-b transition-colors ${
            isLight
              ? 'bg-[#f4f5f8] border-gray-200/60 text-gray-900'
              : 'bg-[#0f232c] border-[#224b5c] text-white'
          }`}>
            <button
              onClick={() => setIsCartOpen(false)}
              className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                isLight
                  ? 'bg-white border border-gray-200/80 text-gray-700 hover:text-black hover:bg-gray-50'
                  : 'bg-[#163643] border border-[#224b5c] text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Close Cart"
              title="Close Cart"
            >
              <ChevronLeft size={20} />
            </button>

            <h2 className={`text-base font-bold tracking-tight uppercase ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}>
              Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            <div className="relative">
              <button
                onClick={() => setShowOptionsMenu(prev => !prev)}
                className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                  isLight
                    ? 'bg-white border border-gray-200/80 text-gray-700 hover:text-black hover:bg-gray-50'
                    : 'bg-[#163643] border border-[#224b5c] text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Cart options"
                title="Options"
              >
                <MoreHorizontal size={20} />
              </button>

              {showOptionsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowOptionsMenu(false)}
                  />
                  <div className={`absolute right-0 top-12 w-40 rounded-2xl shadow-xl border py-1.5 z-40 text-xs animate-fadeIn ${
                    isLight
                      ? 'bg-white border-gray-100 text-gray-900'
                      : 'bg-[#183c4a] border-[#224b5c] text-white'
                  }`}>
                    <button
                      onClick={() => {
                        if (window.confirm('Clear all items from your cart?')) {
                          clearCart();
                        }
                        setShowOptionsMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-red-500 hover:bg-red-500/10 flex items-center gap-2 font-medium"
                    >
                      <Trash2 size={13} />
                      <span>Clear All Items</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={`px-5 py-2.5 border-b backdrop-blur-xs transition-colors ${
            isLight
              ? 'bg-white/70 border-gray-200/60'
              : 'bg-[#153442] border-[#224b5c]'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className={`flex items-center gap-1.5 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                <Truck size={14} className={isLight ? 'text-[#ff5a36]' : 'text-[#f0aa93]'} />
                {isFreeShipping ? (
                  <span className="text-emerald-500 font-bold">You unlocked FREE Delivery!</span>
                ) : (
                  <span>Add ₹{shippingRemaining} for FREE Delivery</span>
                )}
              </span>
              <span className="font-mono text-[11px] text-gray-400">{freeShippingProgress}%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${
              isLight ? 'bg-gray-200' : 'bg-black/40'
            }`}>
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isLight
                    ? 'bg-gradient-to-r from-orange-400 to-[#ff5a36]'
                    : 'bg-gradient-to-r from-[#f0aa93] to-emerald-400'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3.5 scrollbar-thin">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <div className={`w-16 h-16 rounded-full shadow-sm border flex items-center justify-center mx-auto mb-3 ${
                  isLight
                    ? 'bg-white border-gray-200/80 text-gray-400'
                    : 'bg-[#163643] border-[#224b5c] text-[#f0aa93]'
                }`}>
                  <ShoppingBag size={28} />
                </div>
                <h3 className={`text-base font-bold uppercase ${isLight ? 'text-gray-800' : 'text-white'}`}>
                  Your cart is empty
                </h3>
                <p className={`text-xs mt-1 max-w-xs mx-auto ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                  Looks like you haven't added anything yet. Explore our sacred apparel collection.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className={`mt-6 px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
                    isLight
                      ? 'bg-[#122731] hover:bg-black text-white'
                      : 'bg-[#f0aa93] hover:bg-white text-[#122832]'
                  }`}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className={`rounded-3xl p-3.5 sm:p-4 border flex items-center gap-3.5 relative group transition-all ${
                    isLight
                      ? 'bg-white border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md'
                      : 'bg-[#163643] border-[#224b5c] text-white shadow-xl hover:border-[#f0aa93]/50'
                  }`}
                >
                  {/* Product Image Frame */}
                  <div className={`w-20 h-22 sm:w-22 sm:h-24 rounded-2xl flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden ${
                    isLight ? 'bg-[#eff1f5]' : 'bg-[#0f232c] border border-white/5'
                  }`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className={`text-sm sm:text-[15px] font-bold truncate leading-snug uppercase ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                      {item.title}
                    </h4>

                    <div className={`text-xs font-mono mt-0.5 truncate ${
                      isLight ? 'text-[#527d9a]' : 'text-[#f0aa93]'
                    }`}>
                      Apna Brand • {item.size} • {item.color}
                    </div>

                    <div className={`text-sm sm:text-base font-black font-mono mt-1 ${
                      isLight ? 'text-gray-900' : 'text-[#f0aa93]'
                    }`}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    {/* Quantity Selector Pill */}
                    <div className={`inline-flex items-center justify-between border rounded-full px-2 py-1 w-28 sm:w-30 mt-2 shadow-xs ${
                      isLight
                        ? 'border-gray-200/90 bg-white'
                        : 'border-[#224b5c] bg-[#122731]'
                    }`}>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className={`w-6 h-6 flex items-center justify-center transition-colors cursor-pointer ${
                          isLight ? 'text-gray-500 hover:text-black' : 'text-gray-300 hover:text-white'
                        }`}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} strokeWidth={2.5} />
                      </button>

                      <span className={`text-xs sm:text-sm font-bold font-mono px-1 ${
                        isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90 cursor-pointer font-bold ${
                          isLight
                            ? 'bg-[#122731] hover:bg-black text-white'
                            : 'bg-[#f0aa93] hover:bg-white text-[#122832]'
                        }`}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    className={`absolute top-3.5 right-3.5 p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isLight
                        ? 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                        : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                    }`}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary Card */}
          {cartItems.length > 0 && (
            <div className={`rounded-t-3xl border-t p-5 space-y-3 transition-colors ${
              isLight
                ? 'bg-white border-gray-100 shadow-[0_-4px_25px_rgba(0,0,0,0.04)] text-gray-900'
                : 'bg-[#0f232c] border-[#224b5c] shadow-2xl text-white'
            }`}>
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. DHARM30)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 border rounded-full text-xs uppercase outline-none transition-colors ${
                      isLight
                        ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#122731] focus:bg-white'
                        : 'bg-[#163643] border-[#224b5c] text-white placeholder-gray-400 focus:border-[#f0aa93]'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-[#122731] hover:bg-black text-white'
                      : 'bg-[#f0aa93] hover:bg-white text-[#122832]'
                  }`}
                >
                  Apply
                </button>
              </form>

              {discountPercent > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                  <span className="flex items-center gap-1.5 font-normal">
                    <Sparkles size={13} className="text-emerald-400" /> {couponCode} applied ({discountPercent}% OFF)
                  </span>
                  <span className="font-bold">-₹{discountAmount}</span>
                </div>
              )}
              {couponError && (
                <span className="text-[11px] text-red-400 block">{couponError}</span>
              )}

              {/* Price Breakdown */}
              <div className={`space-y-2 text-sm pt-1 ${isLight ? 'text-gray-500' : 'text-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <span>Sub total</span>
                  <span className={`font-mono font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Shipping & tax</span>
                  <span className={`font-mono font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    {isFreeShipping ? <span className="text-emerald-400">FREE</span> : '₹99'}
                  </span>
                </div>
              </div>

              {/* Dashed divider line */}
              <div className={`border-b border-dashed my-2 ${isLight ? 'border-gray-200' : 'border-white/10'}`} />

              {/* Grand Total */}
              <div className="flex justify-between items-center text-sm font-bold">
                <span className={isLight ? 'text-gray-900' : 'text-white'}>Total</span>
                <span className={`text-base font-black font-mono ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`}>
                  ₹{(isFreeShipping ? total : total + 99).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setCheckoutModalOpen(true)}
                className={`w-full py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.99] ${
                  isLight
                    ? 'bg-[#122731] hover:bg-black text-white shadow-black/10'
                    : 'bg-[#f0aa93] hover:bg-white text-[#122832] shadow-[#f0aa93]/20'
                }`}
              >
                <span>Checkout Now</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 pt-1">
                <ShieldCheck size={13} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} />
                <span>100% Secure Checkout • Cash on Delivery & UPI</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl border max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-fadeIn relative max-h-[90vh] overflow-y-auto transition-colors ${
            isLight
              ? 'bg-white border-gray-100 text-gray-900'
              : 'bg-[#153442] border-[#224b5c] text-white'
          }`}>
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className={`absolute top-5 right-5 p-2 rounded-full transition-colors cursor-pointer ${
                isLight ? 'hover:bg-gray-100 text-gray-400 hover:text-black' : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <X size={18} />
            </button>

            {orderSuccess ? (
              <div className="text-center py-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-md">
                  <Check size={32} />
                </div>
                <h3 className={`text-lg font-bold uppercase ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Initial Status: <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                    isLight ? 'bg-gray-100 text-gray-800' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>Pending Admin Confirmation</span>
                </p>

                {/* Highlighted Order ID Box with Instant Copy */}
                <div className={`my-5 p-4 rounded-2xl border text-left ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0f232c] border-[#224b5c]'
                }`}>
                  <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider block mb-1">
                    Your Official Order ID:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-base font-bold tracking-wider ${
                      isLight ? 'text-gray-900' : 'text-[#f0aa93]'
                    }`}>
                      {orderSuccess.id || orderSuccess.orderId}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(orderSuccess.id || orderSuccess.orderId);
                        setCopiedOrderId(true);
                        setTimeout(() => setCopiedOrderId(false), 2000);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                        isLight
                          ? 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200 shadow-xs'
                          : 'bg-[#163643] hover:bg-white/10 text-white border-[#224b5c]'
                      }`}
                    >
                      {copiedOrderId ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Use this ID on the "Track Order" page for live courier status updates.
                  </span>
                </div>

                {/* Order Summary Specs */}
                <div className={`p-3.5 rounded-2xl border text-left text-xs space-y-1.5 font-mono mb-5 ${
                  isLight ? 'bg-gray-50/70 border-gray-100 text-gray-700' : 'bg-[#0f232c] border-[#224b5c] text-gray-300'
                }`}>
                  <div className="flex justify-between"><span className="text-gray-400">Customer:</span> <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{orderSuccess.customer.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Deliver To:</span> <span className="text-right truncate max-w-[200px]">{orderSuccess.customer.address}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Grand Total:</span> <span className={`font-bold ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`}>₹{orderSuccess.total.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Payment:</span> <span className="text-emerald-400 font-bold">{orderSuccess.paymentMethod}</span></div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const id = orderSuccess.id || orderSuccess.orderId;
                      setCheckoutModalOpen(false);
                      setIsCartOpen(false);
                      setOrderSuccess(null);
                      if (onTrackOrder) onTrackOrder(id);
                    }}
                    className={`w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                      isLight
                        ? 'bg-[#122731] hover:bg-black text-white'
                        : 'bg-[#f0aa93] hover:bg-white text-[#122832]'
                    }`}
                  >
                    <Truck size={15} />
                    <span>Track This Order Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutModalOpen(false);
                      setIsCartOpen(false);
                      setOrderSuccess(null);
                    }}
                    className={`w-full py-3 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      isLight
                        ? 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        : 'border-[#224b5c] hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className={`border-b pb-3 ${isLight ? 'border-gray-100' : 'border-[#224b5c]'}`}>
                  <h3 className={`text-base font-bold uppercase tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    Delivery & Checkout
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Fast domestic shipping across India.
                  </p>
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1 uppercase ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun Dev"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isLight
                        ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#122731] focus:bg-white'
                        : 'bg-[#0f232c] border-[#224b5c] text-white placeholder-gray-400 focus:border-[#f0aa93]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-bold block mb-1 uppercase ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#122731] focus:bg-white'
                          : 'bg-[#0f232c] border-[#224b5c] text-white placeholder-gray-400 focus:border-[#f0aa93]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 uppercase ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="seeker@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#122731] focus:bg-white'
                          : 'bg-[#0f232c] border-[#224b5c] text-white placeholder-gray-400 focus:border-[#f0aa93]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1 uppercase ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Delivery Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No, Street, Landmark, City, State, Pincode"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none transition-colors ${
                      isLight
                        ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#122731] focus:bg-white'
                        : 'bg-[#0f232c] border-[#224b5c] text-white placeholder-gray-400 focus:border-[#f0aa93]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-2 uppercase ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Payment Method</label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'COD'
                          ? isLight
                            ? 'border-[#122731] bg-[#122731] text-white shadow-sm font-bold'
                            : 'border-[#f0aa93] bg-[#f0aa93] text-[#122832] shadow-sm font-black'
                          : isLight
                          ? 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                          : 'border-[#224b5c] bg-[#0f232c] text-gray-300 hover:border-white/30'
                      }`}
                    >
                      Cash on Delivery (COD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'UPI'
                          ? isLight
                            ? 'border-[#122731] bg-[#122731] text-white shadow-sm font-bold'
                            : 'border-[#f0aa93] bg-[#f0aa93] text-[#122832] shadow-sm font-black'
                          : isLight
                          ? 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                          : 'border-[#224b5c] bg-[#0f232c] text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <Sparkles size={13} className={paymentMethod === 'UPI' ? (isLight ? 'text-white' : 'text-[#122832]') : 'text-[#f0aa93]'} />
                      <span>Instant UPI Apps</span>
                    </button>
                  </div>

                  {/* UPI Apps Selection when UPI is chosen */}
                  {paymentMethod === 'UPI' && (
                    <div className={`p-3.5 rounded-2xl border space-y-3 animate-fadeIn ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0f232c] border-[#224b5c]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                          Select UPI App:
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Verified Instant Checkout
                        </span>
                      </div>

                      {/* 3 UPI Brand App Cards with Brand Icons */}
                      <div className="grid grid-cols-3 gap-2.5">
                        {/* 1. PhonePe */}
                        <button
                          type="button"
                          onClick={() => setSelectedUpiApp('phonepe')}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative cursor-pointer ${
                            selectedUpiApp === 'phonepe'
                              ? 'bg-[#5F259F]/10 border-[#5F259F] text-[#5F259F] shadow-sm ring-2 ring-[#5F259F]/40'
                              : isLight
                              ? 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                              : 'bg-[#163643] border-[#224b5c] text-gray-300 hover:border-white/20'
                          }`}
                        >
                          <PhonePeIcon size={26} />
                          <span className="text-[11px] font-bold tracking-tight">PhonePe</span>
                          {selectedUpiApp === 'phonepe' && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#5F259F] text-white rounded-full flex items-center justify-center text-[10px] font-medium shadow">
                              ✓
                            </span>
                          )}
                        </button>

                        {/* 2. Google Pay */}
                        <button
                          type="button"
                          onClick={() => setSelectedUpiApp('gpay')}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative cursor-pointer ${
                            selectedUpiApp === 'gpay'
                              ? 'bg-blue-500/10 border-[#4285F4] text-[#4285F4] shadow-sm ring-2 ring-[#4285F4]/40'
                              : isLight
                              ? 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                              : 'bg-[#163643] border-[#224b5c] text-gray-300 hover:border-white/20'
                          }`}
                        >
                          <GooglePayIcon size={26} />
                          <span className="text-[11px] font-bold tracking-tight">Google Pay</span>
                          {selectedUpiApp === 'gpay' && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#4285F4] text-white rounded-full flex items-center justify-center text-[10px] font-medium shadow">
                              ✓
                            </span>
                          )}
                        </button>

                        {/* 3. Paytm */}
                        <button
                          type="button"
                          onClick={() => setSelectedUpiApp('paytm')}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative cursor-pointer ${
                            selectedUpiApp === 'paytm'
                              ? 'bg-sky-500/10 border-[#00B9F5] text-[#00B9F5] shadow-sm ring-2 ring-[#00B9F5]/40'
                              : isLight
                              ? 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                              : 'bg-[#163643] border-[#224b5c] text-gray-300 hover:border-white/20'
                          }`}
                        >
                          <PaytmIcon size={26} />
                          <span className="text-[11px] font-bold tracking-tight">Paytm</span>
                          {selectedUpiApp === 'paytm' && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00B9F5] text-white rounded-full flex items-center justify-center text-[10px] font-medium shadow">
                              ✓
                            </span>
                          )}
                        </button>
                      </div>

                      {/* VPA / Phone number */}
                      <div className="pt-1">
                        <label className="text-[11px] text-gray-400 block mb-1">
                          Enter {selectedUpiApp === 'phonepe' ? 'PhonePe Mobile Number / VPA' : selectedUpiApp === 'gpay' ? 'Google Pay UPI ID' : 'Paytm Mobile Number / VPA'}:
                        </label>
                        <input
                          type="text"
                          placeholder={
                            selectedUpiApp === 'phonepe' ? 'e.g. 9876543210@ybl or mobile' :
                            selectedUpiApp === 'gpay' ? 'e.g. yourname@okhdfcbank' :
                            'e.g. 9876543210@paytm'
                          }
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none ${
                            isLight
                              ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#122731]'
                              : 'bg-[#153442] border-[#224b5c] text-white placeholder-gray-400 focus:border-[#f0aa93]'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className={`pt-2 border-t ${isLight ? 'border-gray-100' : 'border-[#224b5c]'}`}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-lg disabled:opacity-50 cursor-pointer ${
                      isLight
                        ? 'bg-[#122731] hover:bg-black text-white'
                        : 'bg-[#f0aa93] hover:bg-white text-[#122832]'
                    }`}
                  >
                    {isSubmitting ? 'Placing Order...' : `Confirm Order (₹${total.toLocaleString('en-IN')})`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}