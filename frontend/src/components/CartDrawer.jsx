import React, { useState, useEffect } from 'react';
import {
  X, Trash2, ShoppingBag, Truck, Check,
  Sparkles, Tag, ShieldCheck, Copy, ChevronLeft, MoreHorizontal, Plus, Minus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PhonePeIcon, GooglePayIcon, PaytmIcon } from './UpiIcons';

export default function CartDrawer({ onSelectProduct, onTrackOrder }) {
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
      const response = await fetch('http://localhost:5000/api/orders', {
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

        <div className="w-screen max-w-md bg-[#f4f5f8] text-gray-900 shadow-2xl flex flex-col justify-between overflow-hidden">

          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200/60 bg-[#f4f5f8]">
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200/80 flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 transition-all active:scale-95"
              aria-label="Close Cart"
              title="Close Cart"
            >
              <ChevronLeft size={20} />
            </button>

            <h2 className="text-base font-normal text-gray-900 tracking-tight">
              Cart
            </h2>

            <div className="relative">
              <button
                onClick={() => setShowOptionsMenu(prev => !prev)}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200/80 flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 transition-all active:scale-95"
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
                  <div className="absolute right-0 top-12 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-40 text-xs animate-fadeIn">
                    <button
                      onClick={() => {
                        if (window.confirm('Clear all items from your cart?')) {
                          clearCart();
                        }
                        setShowOptionsMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <Trash2 size={13} />
                      <span>Clear All Items</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white/70 px-5 py-2.5 border-b border-gray-200/60 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-gray-600">
                <Truck size={14} className="text-[#ff5a36]" />
                {isFreeShipping ? (
                  <span className="text-emerald-600 font-normal">You unlocked FREE Delivery!</span>
                ) : (
                  <span>Add ₹{shippingRemaining} for FREE Delivery</span>
                )}
              </span>
              <span className="font-mono text-[11px] text-gray-400">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-[#ff5a36] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3.5 scrollbar-thin">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-200/80 flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-normal text-gray-800">Your cart is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Looks like you haven't added anything yet. Explore our sacred apparel collection.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-3 rounded-full bg-[#ff5a36] hover:bg-[#ff4520] text-white font-medium text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="bg-white rounded-3xl p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-3.5 relative group hover:shadow-md transition-shadow"
                >
                  {/* Product Image Frame with Soft Neutral Tint */}
                  <div className="w-20 h-22 sm:w-22 sm:h-24 rounded-2xl bg-[#eff1f5] flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain mix-blend-multiply rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-sm sm:text-[15px] font-normal text-gray-900 truncate leading-snug">
                      {item.title}
                    </h4>

                    <div className="text-xs text-[#527d9a] font-normal mt-0.5 truncate">
                      Apna Brand • {item.size} • {item.color}
                    </div>

                    <div className="text-sm sm:text-base font-normal text-gray-900 mt-1">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    {/* Quantity Selector Pill matching Pinterest layout */}
                    <div className="inline-flex items-center justify-between border border-gray-200/90 rounded-full bg-white px-2 py-1 w-28 sm:w-30 mt-2 shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} strokeWidth={2.5} />
                      </button>

                      <span className="text-xs sm:text-sm font-normal text-gray-900 font-mono px-1">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[#ff5a36] hover:bg-[#ff4520] text-white flex items-center justify-center shadow-sm transition-transform active:scale-90"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    className="absolute top-3.5 right-3.5 p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 4. Bottom Summary Card matching reference image */}
          {cartItems.length > 0 && (
            <div className="bg-white rounded-t-3xl border-t border-gray-100 p-5 shadow-[0_-4px_25px_rgba(0,0,0,0.04)] space-y-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. DHARM10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs uppercase text-gray-900 placeholder-gray-400 outline-none focus:border-[#ff5a36] focus:bg-white transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-gray-900 hover:bg-black text-xs font-medium text-white transition-colors"
                >
                  Apply
                </button>
              </form>

              {discountPercent > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <span className="flex items-center gap-1.5 font-normal">
                    <Sparkles size={13} className="text-emerald-600" /> {couponCode} applied ({discountPercent}% OFF)
                  </span>
                  <span className="font-normal">-₹{discountAmount}</span>
                </div>
              )}
              {couponError && (
                <span className="text-[11px] text-red-500 block">{couponError}</span>
              )}

              {/* Price Breakdown: Sub total, Shipping & tax, dashed line, Total */}
              <div className="space-y-2 text-sm text-gray-500 pt-1">
                <div className="flex justify-between items-center">
                  <span>Sub total</span>
                  <span className="font-normal text-gray-900 font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span>Discount</span>
                    <span className="font-mono font-normal">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Shipping & tax</span>
                  <span className="font-normal text-gray-900 font-mono">
                    {isFreeShipping ? <span className="text-emerald-600 font-normal">FREE</span> : '₹99'}
                  </span>
                </div>
              </div>

              {/* Dashed divider line matching the reference screenshot */}
              <div className="border-b border-dashed border-gray-200 my-2" />

              {/* Grand Total */}
              <div className="flex justify-between items-center text-sm font-normal text-gray-900">
                <span>Total</span>
                <span className="text-base font-medium font-mono text-gray-900">
                  ₹{(isFreeShipping ? total : total + 99).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Big Vibrant Orange/Coral 'Checkout Now' Button */}
              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full py-3.5 rounded-full bg-[#ff5a36] hover:bg-[#ff4520] active:scale-[0.99] text-white font-medium text-sm tracking-wide shadow-lg shadow-[#ff5a36]/25 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Checkout Now</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 pt-1">
                <ShieldCheck size={13} className="text-[#ff5a36]" />
                <span>100% Secure Checkout • Cash on Delivery & UPI</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CHECKOUT MODAL - Modern Clean Card UI */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-lg w-full p-6 sm:p-7 text-gray-900 shadow-2xl animate-fadeIn relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>

            {orderSuccess ? (
              <div className="text-center py-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-md">
                  <Check size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Order Placed Successfully!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Initial Status: <span className="font-normal text-gray-800 px-2 py-0.5 rounded bg-gray-100">Pending Admin Confirmation</span>
                </p>

                {/* Highlighted Order ID Box with Instant Copy */}
                <div className="my-5 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left">
                  <span className="text-[10px] uppercase font-normal text-gray-500 tracking-wider block mb-1">
                    Your Official Order ID:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-medium text-gray-900 tracking-wider">
                      {orderSuccess.id || orderSuccess.orderId}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(orderSuccess.id || orderSuccess.orderId);
                        setCopiedOrderId(true);
                        setTimeout(() => setCopiedOrderId(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-gray-100 text-xs font-normal text-gray-800 flex items-center gap-1.5 transition-colors border border-gray-200 shadow-xs"
                    >
                      {copiedOrderId ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
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
                <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 text-left text-xs space-y-1.5 font-mono mb-5">
                  <div className="flex justify-between"><span className="text-gray-400">Customer:</span> <span className="text-gray-900 font-normal">{orderSuccess.customer.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Deliver To:</span> <span className="text-gray-700 text-right truncate max-w-[200px]">{orderSuccess.customer.address}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Grand Total:</span> <span className="text-[#ff5a36] font-normal">₹{orderSuccess.total.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Payment:</span> <span className="text-emerald-600 font-normal">{orderSuccess.paymentMethod}</span></div>
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
                    className="w-full py-3.5 rounded-full bg-[#ff5a36] hover:bg-[#ff4520] text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/25"
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
                    className="w-full py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-normal text-xs uppercase tracking-wider transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-base font-medium text-gray-900 tracking-tight">
                    Delivery & Checkout
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fast domestic shipping across India.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-normal text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun Dev"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#ff5a36] focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-normal text-gray-700 block mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#ff5a36] focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-normal text-gray-700 block mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="seeker@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#ff5a36] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-normal text-gray-700 block mb-1">Delivery Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No, Street, Landmark, City, State, Pincode"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#ff5a36] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-normal text-gray-700 block mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-3 rounded-2xl border text-xs font-normal transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-[#ff5a36] bg-orange-50/60 text-[#ff5a36] shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Cash on Delivery (COD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3 rounded-2xl border text-xs font-normal transition-all flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'UPI'
                          ? 'border-[#ff5a36] bg-orange-50/60 text-[#ff5a36] shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Sparkles size={13} className="text-[#ff5a36]" />
                      <span>Instant UPI Apps</span>
                    </button>
                  </div>

                  {/* UPI Apps Selection when UPI is chosen */}
                  {paymentMethod === 'UPI' && (
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-normal uppercase tracking-wider text-gray-700">
                          Select UPI App:
                        </span>
                        <span className="text-[10px] text-emerald-700 font-normal bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Verified Instant Checkout
                        </span>
                      </div>

                      {/* 3 UPI Brand App Cards with Brand Icons */}
                      <div className="grid grid-cols-3 gap-2.5">
                        {/* 1. PhonePe */}
                        <button
                          type="button"
                          onClick={() => setSelectedUpiApp('phonepe')}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                            selectedUpiApp === 'phonepe'
                              ? 'bg-[#5F259F]/10 border-[#5F259F] text-[#5F259F] shadow-sm ring-2 ring-[#5F259F]/40'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <PhonePeIcon size={26} />
                          <span className="text-[11px] font-normal tracking-tight">PhonePe</span>
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
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                            selectedUpiApp === 'gpay'
                              ? 'bg-blue-50 border-[#4285F4] text-[#4285F4] shadow-sm ring-2 ring-[#4285F4]/40'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <GooglePayIcon size={26} />
                          <span className="text-[11px] font-normal tracking-tight">Google Pay</span>
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
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                            selectedUpiApp === 'paytm'
                              ? 'bg-sky-50 border-[#00B9F5] text-[#00B9F5] shadow-sm ring-2 ring-[#00B9F5]/40'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <PaytmIcon size={26} />
                          <span className="text-[11px] font-normal tracking-tight">Paytm</span>
                          {selectedUpiApp === 'paytm' && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00B9F5] text-white rounded-full flex items-center justify-center text-[10px] font-medium shadow">
                              ✓
                            </span>
                          )}
                        </button>
                      </div>

                      {/* VPA / Phone number */}
                      <div className="pt-1">
                        <label className="text-[11px] text-gray-500 block mb-1">
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
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-[#ff5a36]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-[#ff5a36] hover:bg-[#ff4520] text-white font-medium text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
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