import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { API_BASE } from '../config';
import { useThemeColor } from '../context/ThemeColorContext';

export default function TrackOrderView({ initialOrderId = '' }) {
  const { themeMode = 'dark' } = useThemeColor?.() || {};
  const isLight = themeMode === 'light';
  const [query, setQuery] = useState(initialOrderId || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [isTrackingOpen, setIsTrackingOpen] = useState(true);
  const [isFullDetailsOpen, setIsFullDetailsOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('brahmman_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [myOrders, setMyOrders] = useState([]);
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);
  const [orderFilterTab, setOrderFilterTab] = useState('all');

  const fetchMyOrders = async () => {
    if (!currentUser) {
      setMyOrders([]);
      return;
    }
    setMyOrdersLoading(true);
    try {
      const id = currentUser.email || currentUser.phone || currentUser.username || currentUser.name;
      const res = await fetch(`${API_BASE}/api/orders/user/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.success && data.orders && data.orders.length > 0) {
        setMyOrders(data.orders);

        if (!initialOrderId && !query) {
          handleTrack(data.orders[0].id || data.orders[0].orderId);
        }
      } else {
        setMyOrders([]);
      }
    } catch (err) {
      console.log('Error loading user orders:', err);
    } finally {
      setMyOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [currentUser]);

  useEffect(() => {
    if (initialOrderId) {
      setQuery(initialOrderId);
      handleTrack(initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrack = async (searchParam = null) => {
    const q = (searchParam || query).trim();
    if (!q) {
      setError('Please enter your Order ID (e.g. ORD-10821) or registered phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/orders/track/${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.message || `No order found for "${q}". Please check your Order ID.`);
      }

      setOrder(data.order);
    } catch (err) {
      setError(err.message || 'Unable to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMyOrders = myOrders.filter(o => {
    if (orderFilterTab === 'pending') return o.status === 'Pending';
    if (orderFilterTab === 'active') return o.status !== 'Delivered' && o.status !== 'Pending';
    if (orderFilterTab === 'delivered') return o.status === 'Delivered';
    return true;
  });

  return (
    <div className={`min-h-screen font-sans py-12 px-4 sm:px-6 animate-fadeIn selection:bg-[#f0aa93] selection:text-[#122731] transition-colors duration-300 ${
      isLight ? 'bg-white text-gray-900' : 'bg-[#122731] text-white'
    }`}>

      {/* Header & Search Bar */}
      <div className="max-w-xl mx-auto mb-8 text-center">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f0aa93] font-bold block mb-1">
          Express Dispatch & Live Tracking
        </span>
        <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-wide font-sans ${
          isLight ? 'text-gray-900' : 'text-white'
        }`}>
          Track Your Order
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="mt-6 flex gap-2.5"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. ORD-18193)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm outline-none transition-colors shadow-xl ${
                isLight
                  ? 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#122731]'
                  : 'bg-[#163643] border border-[#224b5c] text-white placeholder-gray-400 focus:border-[#f0aa93]'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 bg-[#f0aa93] hover:bg-white text-[#122731] text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#122731]/30 border-t-[#122731] rounded-full animate-spin"></span>
            ) : (
              <span>Track</span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs flex items-center justify-center gap-2 animate-fadeIn">
            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Order Details Card */}
      {order && (
        <div className={`max-w-xl mx-auto rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-7 animate-fadeIn transition-colors ${
          isLight ? 'bg-white border-gray-200' : 'bg-[#163643] border-[#224b5c]'
        }`}>

          <div className={`flex items-center justify-between gap-3 pb-2 border-b ${
            isLight ? 'border-gray-200' : 'border-[#224b5c]'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-inner ${
                isLight ? 'bg-gray-100 border-gray-200 text-[#122731]' : 'bg-[#122731] border-[#224b5c] text-[#f0aa93]'
              }`}>
                <Package size={20} className="stroke-[1.75]" />
              </div>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h3 className={`font-sans text-base sm:text-lg font-bold tracking-tight whitespace-nowrap ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  Order {order.orderId || order.id}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleCopyOrderId(order.orderId || order.id)}
                title="Copy Order ID"
                className={`px-3 py-1.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm ${
                  isLight
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                    : 'bg-[#122731] hover:bg-[#1a404f] text-gray-300 hover:text-white border-[#224b5c]'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-emerald-600 font-bold text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-gray-400" />
                    <span className="font-mono text-[11px]">Copy ID</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsTrackingOpen(prev => !prev)}
                title={isTrackingOpen ? "Close tracking page" : "Open tracking page"}
                className="w-8 h-8 rounded-xl bg-[#f0aa93] hover:bg-white text-[#122731] transition-all flex items-center justify-center shadow-md cursor-pointer"
              >
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${isTrackingOpen ? 'rotate-90' : 'rotate-0'}`}
                />
              </button>
            </div>
          </div>

          {isTrackingOpen && (
            <div className="space-y-7 animate-fadeIn">

              {/* Progress Tracking Timeline */}
              <div className="space-y-4">
                <h4 className={`text-sm font-bold tracking-tight text-left ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  Order Tracking
                </h4>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold ${isLight ? 'text-gray-800' : 'text-gray-200'}`}>
                      {order.status === 'Delivered' ? 'Product Delivered' : order.status === 'In Transit' ? 'Product in Transit' : `Product ${order.status}`}
                    </span>
                    {order.currentLocation && (
                      <span className={`text-[11px] font-normal ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`}>
                        • {order.currentLocation.split(',')[0]}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-gray-400">
                    {order.status === 'Delivered' ? 'Delivered' : 'EST: 3 days'}
                  </span>
                </div>

                <div className="relative pt-3 pb-2 px-1 overflow-x-auto scrollbar-none">
                  <div className="min-w-[540px] sm:min-w-0 relative">

                    {(() => {
                      const stages = [
                        { id: 'Pending', label: 'Pending', sublabel: 'Order Placed' },
                        { id: 'Confirmed', label: 'Confirmed', sublabel: 'Verified' },
                        { id: 'Processing', label: 'Processing', sublabel: 'Packed' },
                        { id: 'Dispatched', label: 'Dispatched', sublabel: 'Sent out' },
                        { id: 'In Transit', label: 'In Transit', sublabel: 'On the way' },
                        { id: 'Out for Delivery', label: 'Out for Delivery', sublabel: 'With Agent' },
                        { id: 'Delivered', label: 'Delivered', sublabel: 'Completed' }
                      ];

                      const stageOrder = stages.map(s => s.id);
                      let currentIndex = stageOrder.indexOf(order.status);
                      if (currentIndex === -1) {
                        currentIndex = order.status === 'Cancelled' ? -1 : 1;
                      }

                      const progressPercent = currentIndex <= 0 ? 0 : Math.round((currentIndex / (stages.length - 1)) * 100);

                      return (
                        <>
                          <div className={`absolute top-[18px] left-6 right-6 h-[3px] rounded-full overflow-hidden ${
                            isLight ? 'bg-gray-200' : 'bg-[#122731]'
                          }`}>
                            <div
                              className="h-full bg-[#f0aa93] transition-all duration-700 ease-out"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>

                          <div className="relative flex justify-between items-start z-10 text-center">
                            {stages.map((stage, idx) => {
                              const isReached = currentIndex >= idx;
                              const isCurrent = currentIndex === idx;

                              return (
                                <div key={stage.id} className="flex flex-col items-center flex-1 min-w-[60px] sm:min-w-0">
                                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all ${
                                    isReached
                                      ? (isCurrent
                                          ? 'bg-[#f0aa93] text-[#122731] shadow-lg ring-4 ring-[#f0aa93]/30 scale-110'
                                          : 'bg-[#f0aa93] text-[#122731] shadow-sm ring-2 ring-[#f0aa93]/20')
                                      : isLight
                                      ? 'border-2 border-gray-300 bg-gray-100'
                                      : 'border-2 border-[#224b5c] bg-[#122731]'
                                  }`}>
                                    {isReached && <Check size={11} className="stroke-[3]" />}
                                  </div>

                                  <span className={`text-[10px] sm:text-xs font-bold mt-2 block leading-tight ${
                                    isCurrent
                                      ? isLight ? 'text-[#122731] font-extrabold' : 'text-[#f0aa93] font-extrabold'
                                      : isReached
                                      ? isLight ? 'text-gray-900' : 'text-white'
                                      : 'text-gray-400'
                                  }`}>
                                    {stage.label}
                                  </span>

                                  <span className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 block font-sans truncate max-w-[70px]">
                                    {isReached
                                      ? (isCurrent && order.currentLocation
                                          ? order.currentLocation.split(',')[0].slice(0, 10)
                                          : stage.sublabel)
                                      : 'Waiting...'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t text-left ${
                  isLight ? 'border-gray-200' : 'border-[#224b5c]'
                }`}>
                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Order Date</span>
                    <span className={`text-xs sm:text-sm font-bold mt-1 block font-mono ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Delivery Date</span>
                    <span className={`text-xs sm:text-sm font-bold mt-1 block font-mono ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                      {order.courier?.expectedDelivery
                        ? new Date(order.courier.expectedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Courier</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-5 h-3.5 rounded bg-[#f0aa93] text-[8px] font-black text-[#122731] flex items-center justify-center font-mono">
                        {order.courier?.name ? order.courier.name.slice(0, 2).toUpperCase() : 'BD'}
                      </span>
                      <span className={`text-xs sm:text-sm font-bold truncate ${
                        isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                        {order.courier?.name || 'Bluedart Express'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Address</span>
                    <span className={`text-xs sm:text-sm font-bold mt-1 block truncate ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`} title={order.customer?.address}>
                      {order.customer?.address ? order.customer.address.slice(0, 16) + '...' : 'Destination Address'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div>
                <h4 className={`text-sm font-bold mb-3 text-left ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  Order Summary
                </h4>
                <div className={`rounded-2xl p-4 sm:p-5 space-y-2.5 border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#122731] border-[#224b5c]'
                }`}>
                  <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                    <span>Sub total</span>
                    <span className={`font-semibold font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      ₹{order.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                    <span>Discount</span>
                    <span className={`font-semibold font-mono ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`}>₹0</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                    <span>Shipping</span>
                    <span className="text-emerald-500 font-semibold font-mono">FREE</span>
                  </div>
                  <div className={`border-t pt-2.5 flex justify-between items-center ${
                    isLight ? 'border-gray-200' : 'border-[#224b5c]'
                  }`}>
                    <span className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-gray-800' : 'text-gray-300'}`}>Total Amount</span>
                    <span className={`text-base sm:text-lg font-bold font-mono ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`}>
                      ₹{order.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Info */}
              <div>
                <h4 className={`text-sm font-bold mb-3 text-left ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  Order Items
                </h4>

                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between gap-4 p-3 rounded-2xl border ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#122731] border-[#224b5c]'
                    }`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image || 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_ubg.png?v=1791201501'}
                          alt={item.title}
                          className={`w-14 h-14 rounded-2xl object-cover border shadow-sm flex-shrink-0 ${
                            isLight ? 'bg-white border-gray-200' : 'bg-[#163643] border-[#224b5c]'
                          }`}
                        />
                        <div className="min-w-0 text-left">
                          <h5 className={`text-xs sm:text-sm font-bold uppercase truncate ${
                            isLight ? 'text-gray-900' : 'text-white'
                          }`}>
                            {item.title}
                          </h5>
                          <span className="text-[11px] text-gray-400 block mt-0.5 font-mono">
                            Size: {item.size || 'L'} • Color: {item.color || 'Black'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={`text-xs sm:text-sm font-bold block font-mono ${
                          isLight ? 'text-[#122731]' : 'text-[#f0aa93]'
                        }`}>
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          Qty: {item.quantity || 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullDetailsOpen(prev => !prev)}
                  className={`w-full mt-4 py-3 rounded-2xl text-xs font-semibold tracking-tight transition-colors flex items-center justify-center gap-1.5 border cursor-pointer ${
                    isLight
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'
                      : 'bg-[#122731] hover:bg-[#1a404f] text-gray-200 border-[#224b5c]'
                  }`}
                >
                  <span>{isFullDetailsOpen ? 'Hide order details' : 'View full details'}</span>
                  <ChevronRight size={14} className={`transition-transform duration-300 ${isFullDetailsOpen ? '-rotate-90' : 'rotate-90'}`} />
                </button>

                {isFullDetailsOpen && (
                  <div className={`mt-5 p-5 rounded-2xl border text-left space-y-4 animate-fadeIn ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#122731] border-[#224b5c]'
                  }`}>

                    <div className={`flex items-center justify-between pb-3 border-b ${
                      isLight ? 'border-gray-200' : 'border-[#224b5c]'
                    }`}>
                      <div>
                        <h5 className={`font-bold text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>Complete Order Details</h5>
                        <span className="text-[11px] text-gray-400 font-mono">ID: {order.orderId || order.id}</span>
                      </div>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#f0aa93] text-[#122731]">
                        {order.paymentMethod || 'UPI'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className={`p-3 rounded-xl border space-y-1 ${
                        isLight ? 'bg-white border-gray-200' : 'bg-[#163643] border-[#224b5c]'
                      }`}>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Customer</span>
                        <strong className={`block text-xs ${isLight ? 'text-gray-900' : 'text-white'}`}>{order.customer?.name}</strong>
                        <div className={`flex items-center gap-1.5 text-[11px] pt-0.5 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                          <Phone size={12} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} />
                          <span>{order.customer?.phone}</span>
                        </div>
                        {order.customer?.email && (
                          <span className="text-[11px] text-gray-400 block truncate">{order.customer?.email}</span>
                        )}
                      </div>

                      <div className={`p-3 rounded-xl border space-y-1 ${
                        isLight ? 'bg-white border-gray-200' : 'bg-[#163643] border-[#224b5c]'
                      }`}>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Delivery Location</span>
                        <p className={`text-xs leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>{order.customer?.address || 'Standard Delivery Address'}</p>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                      isLight ? 'bg-white border-gray-200' : 'bg-[#163643] border-[#224b5c]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                          isLight ? 'text-[#122731]' : 'text-[#f0aa93]'
                        }`}>
                          <Truck size={13} />
                          <span>Dispatch Logistics</span>
                        </span>
                        <span className={`font-mono text-[11px] font-bold ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                          AWB: {order.courier?.trackingNumber || 'BD-8472910'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 pt-1">
                        <MapPin size={14} className={`mt-0.5 flex-shrink-0 ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`} />
                        <div>
                          <span className={`text-xs font-bold block ${isLight ? 'text-gray-900' : 'text-white'}`}>
                            {order.currentLocation || 'Central Fulfillment Facility, New Delhi'}
                          </span>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                            {order.transitNote || 'Order verified and progressing through courier logistics network.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* User Order History Section */}
      {currentUser && myOrders.length > 0 && (
        <div id="my-orders-overview" className="max-w-xl mx-auto mt-12 space-y-4 animate-fadeIn">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
            isLight ? 'border-gray-200' : 'border-[#224b5c]'
          }`}>
            <div>
              <h3 className={`text-base font-bold uppercase tracking-wide ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}>
                My Orders ({myOrders.length})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Your private order history. Click any order to track live progress.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
              {[
                { id: 'all', label: 'All Orders', count: myOrders.length },
                { id: 'pending', label: 'Pending', count: myOrders.filter(o => o.status === 'Pending').length },
                { id: 'active', label: 'In Transit / Active', count: myOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Pending').length },
                { id: 'delivered', label: 'Delivered', count: myOrders.filter(o => o.status === 'Delivered').length }
              ].map(tab => {
                const isActive = orderFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setOrderFilterTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#f0aa93] text-[#122731] shadow-md'
                        : isLight
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                        : 'bg-[#163643] hover:bg-[#1f4a5c] text-gray-300 border border-[#224b5c]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-[#122731]/20 text-[#122731] font-black'
                        : isLight
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-[#122731] text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {filteredMyOrders.length === 0 ? (
              <div className={`p-8 text-center rounded-3xl border text-gray-400 text-xs shadow-xl ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#163643] border-[#224b5c]'
              }`}>
                No orders found in this category.
              </div>
            ) : (
              filteredMyOrders.map(o => {
                const isDelivered = o.status === 'Delivered';
                const isSelected = order && (order.id === o.id || order.orderId === o.id || order.id === o.orderId);

                return (
                  <div
                    key={o.id || o.orderId}
                    onClick={() => {
                      const id = o.orderId || o.id;
                      setQuery(id);
                      handleTrack(id);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                      isSelected
                        ? isLight
                          ? 'border-[#122731] ring-2 ring-[#122731]/20 bg-gray-50 shadow-md'
                          : 'border-[#f0aa93] ring-2 ring-[#f0aa93]/30 bg-[#19404f] shadow-xl'
                        : isLight
                        ? 'border-gray-200 bg-white hover:border-[#122731]/40 hover:shadow-md'
                        : 'border-[#224b5c] bg-[#163643] hover:border-[#f0aa93]/60 hover:shadow-xl'
                    }`}
                  >
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b ${
                      isLight ? 'border-gray-200' : 'border-[#224b5c]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-black ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`}>
                          {o.orderId || o.id}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-gray-400 font-sans">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className={`text-xs font-medium truncate max-w-[120px] ${
                          isLight ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {o.customer?.name}
                        </span>
                      </div>

                      <div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide inline-flex items-center gap-1 ${
                          isDelivered
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                            : 'bg-[#f0aa93] text-[#122731] font-bold'
                        }`}>
                          {isDelivered && <Check size={11} className="stroke-[3]" />}
                          <span>{o.status || 'Pending'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="my-2.5 flex items-start justify-between gap-2 text-xs">
                      <div className="flex items-start gap-1.5">
                        <MapPin size={13} className={`mt-0.5 flex-shrink-0 ${isDelivered ? 'text-emerald-500' : (isLight ? 'text-[#122731]' : 'text-[#f0aa93]')}`} />
                        <div>
                          <strong className={`text-xs block ${isLight ? 'text-gray-900' : 'text-white'}`}>{o.currentLocation || 'Central Warehouse, New Delhi'}</strong>
                          {o.transitNote && (
                            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{o.transitNote}</p>
                          )}
                        </div>
                      </div>
                      <span className={`font-mono font-bold text-xs sm:text-sm flex-shrink-0 ${
                        isLight ? 'text-[#122731]' : 'text-[#f0aa93]'
                      }`}>
                        ₹{o.total?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Empty States */}
      {currentUser && myOrders.length === 0 && !order && (
        <div className={`max-w-xl mx-auto mt-8 p-8 text-center rounded-3xl border shadow-xl text-xs space-y-2 ${
          isLight ? 'bg-white border-gray-200' : 'bg-[#163643] border-[#224b5c]'
        }`}>
          <Package size={32} className={`mx-auto stroke-[1.5] ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`} />
          <h4 className={`font-bold text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>No Orders Placed Yet</h4>
          <p className="text-gray-400 max-w-sm mx-auto">
            You don't have any orders linked to @{currentUser.username} yet. Once you order from the store, you can track it live here.
          </p>
        </div>
      )}

      {!currentUser && !order && (
        <div className={`max-w-xl mx-auto mt-8 p-8 text-center rounded-3xl border shadow-xl text-xs space-y-2 ${
          isLight ? 'bg-white border-gray-200' : 'bg-[#163643] border-[#224b5c]'
        }`}>
          <Package size={32} className={`mx-auto stroke-[1.5] ${isLight ? 'text-[#122731]' : 'text-[#f0aa93]'}`} />
          <h4 className={`font-bold text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>Live Order Tracking</h4>
          <p className="text-gray-400 max-w-sm mx-auto">
            Enter your Order ID (e.g. ORD-18193) or registered phone number above to view live dispatch status.
          </p>
        </div>
      )}

    </div>
  );
}
