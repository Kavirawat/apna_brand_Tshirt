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

export default function TrackOrderView({ initialOrderId = '' }) {
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
    <div className="min-h-screen bg-[#f4f5f7] py-12 px-4 sm:px-6 animate-fadeIn text-[#121212]">

      <div className="max-w-xl mx-auto mb-8 text-center">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#d4af37] font-bold block mb-1">
          Express Dispatch & Live Tracking
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-black uppercase text-[#121212] tracking-wide">
          Track Your Order
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="mt-5 flex gap-2"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. ORD-18193)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-[#121212] placeholder-gray-400 outline-none focus:border-black transition-colors shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>Track</span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center gap-2">
            <AlertCircle size={15} className="text-red-500" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {order && (
        <div className="max-w-xl mx-auto bg-white rounded-[28px] border border-gray-200/80 shadow-2xl p-6 sm:p-8 space-y-7 animate-fadeIn">

          <div className="flex items-center justify-between gap-3 pb-2">

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-center text-gray-600 flex-shrink-0 shadow-sm">
                <Package size={20} className="stroke-[1.75]" />
              </div>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h3 className="font-sans text-base sm:text-lg font-bold text-gray-900 tracking-tight whitespace-nowrap">
                  Order {order.orderId || order.id}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">

              <button
                type="button"
                onClick={() => handleCopyOrderId(order.orderId || order.id)}
                title="Copy Order ID"
                className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-700 font-bold text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-gray-600" />
                    <span className="font-mono text-[11px]">Copy ID</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsTrackingOpen(prev => !prev)}
                title={isTrackingOpen ? "Close tracking page" : "Open tracking page"}
                className="w-8 h-8 rounded-xl bg-[#135d54] hover:bg-[#0e4841] text-white transition-all flex items-center justify-center shadow-sm"
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

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 tracking-tight text-left">
                  Order Tracking
                </h4>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-800">
                      {order.status === 'Delivered' ? 'Product Delivered' : order.status === 'In Transit' ? 'Product in Transit' : `Product ${order.status}`}
                    </span>
                    {order.currentLocation && (
                      <span className="text-[11px] text-gray-500 font-normal">
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
                          <div className="absolute top-[18px] left-6 right-6 h-[3px] bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 transition-all duration-700 ease-out"
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
                                          ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-500/25 scale-110'
                                          : 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20')
                                      : 'border-2 border-gray-300 bg-white'
                                  }`}>
                                    {isReached && <Check size={11} className="stroke-[3]" />}
                                  </div>

                                  <span className={`text-[10px] sm:text-xs font-bold mt-2 block leading-tight ${
                                    isCurrent ? 'text-emerald-700 font-extrabold' : isReached ? 'text-gray-900' : 'text-gray-400'
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-gray-100 text-left">
                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Order Date</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 mt-1 block">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Delivery Date</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 mt-1 block">
                      {order.courier?.expectedDelivery
                        ? new Date(order.courier.expectedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Courier</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-5 h-3.5 rounded bg-amber-400 text-[8px] font-black text-black flex items-center justify-center font-mono">
                        {order.courier?.name ? order.courier.name.slice(0, 2).toUpperCase() : 'BD'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {order.courier?.name || 'Bluedart Express'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Address</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 mt-1 block truncate" title={order.customer?.address}>
                      {order.customer?.address ? order.customer.address.slice(0, 16) + '...' : 'Destination Address'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 text-left">
                  Order Summary
                </h4>
                <div className="bg-[#f8f9fa] rounded-2xl p-4 sm:p-5 space-y-2.5 border border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                    <span>Sub total</span>
                    <span className="text-gray-900 font-semibold font-mono">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                    <span>Discount</span>
                    <span className="text-gray-900 font-semibold font-mono">₹0</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-semibold font-mono">FREE</span>
                  </div>
                  <div className="border-t border-gray-200/70 pt-2.5 flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Total Amount</span>
                    <span className="text-base sm:text-lg font-bold text-gray-900 font-mono">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 text-left">
                  Order Info
                </h4>

                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image || 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_ubg.png?v=1791201501'}
                          alt={item.title}
                          className="w-14 h-14 rounded-2xl object-cover bg-gray-50 border border-gray-100 shadow-sm flex-shrink-0"
                        />
                        <div className="min-w-0 text-left">
                          <h5 className="text-xs sm:text-sm font-bold text-gray-900 uppercase truncate">
                            {item.title}
                          </h5>
                          <span className="text-[11px] text-gray-400 block mt-0.5 font-mono">
                            Size: {item.size || 'L'} • Color: {item.color || 'Black'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 block font-mono">
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
                  className="w-full mt-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold tracking-tight transition-colors flex items-center justify-center gap-1.5 border border-gray-100"
                >
                  <span>{isFullDetailsOpen ? 'Hide order details' : 'View details'}</span>
                  <ChevronRight size={14} className={`transition-transform duration-300 ${isFullDetailsOpen ? '-rotate-90' : 'rotate-90'}`} />
                </button>

                {isFullDetailsOpen && (
                  <div className="mt-5 p-5 rounded-2xl bg-gray-50/90 border border-gray-200 text-left space-y-4 animate-fadeIn">

                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                      <div>
                        <h5 className="font-bold text-sm text-gray-900">Complete Order Details</h5>
                        <span className="text-[11px] text-gray-500 font-mono">ID: {order.orderId || order.id}</span>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-black text-white">
                        {order.paymentMethod || 'UPI'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-gray-150 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Customer</span>
                        <strong className="text-gray-900 block text-xs">{order.customer?.name}</strong>
                        <div className="flex items-center gap-1.5 text-gray-600 text-[11px] pt-0.5">
                          <Phone size={12} className="text-gray-400" />
                          <span>{order.customer?.phone}</span>
                        </div>
                        {order.customer?.email && (
                          <span className="text-[11px] text-gray-500 block truncate">{order.customer?.email}</span>
                        )}
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-gray-150 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Delivery Location</span>
                        <p className="text-gray-800 text-xs leading-relaxed">{order.customer?.address || 'Standard Delivery Address'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Ordered Items ({order.items?.length || 1})</span>
                      <div className="bg-white rounded-xl border border-gray-150 divide-y divide-gray-100 overflow-hidden">
                        {order.items?.map((item, i) => (
                          <div key={i} className="p-3 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.image || 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_ubg.png?v=1791201501'}
                                alt={item.title}
                                className="w-12 h-14 object-cover rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-gray-900 block uppercase truncate">{item.title}</span>
                                <span className="text-[11px] text-gray-400 font-mono block">
                                  Size: {item.size || 'L'} • Color: {item.color || 'Black'} • Qty: {item.quantity || 1}
                                </span>
                                <span className="text-[11px] text-[#135d54] font-semibold block">280 GSM Heavy Cotton</span>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-gray-900 text-sm flex-shrink-0">
                              ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#135d54]/5 rounded-xl border border-[#135d54]/20 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#135d54] tracking-wider flex items-center gap-1.5">
                          <Truck size={13} />
                          <span>Dispatch Logistics</span>
                        </span>
                        <span className="font-mono text-[11px] text-gray-700 font-bold">
                          AWB: {order.courier?.trackingNumber || 'BD-8472910'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 pt-1">
                        <MapPin size={14} className="text-[#135d54] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">
                            {order.currentLocation || 'Central Fulfillment Facility, New Delhi'}
                          </span>
                          <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
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

      {currentUser && myOrders.length > 0 && (
        <div id="my-orders-overview" className="max-w-xl mx-auto mt-12 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
            <div>
              <h3 className="text-base font-serif font-black uppercase text-[#121212] tracking-wide">
                My Orders ({myOrders.length})
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
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
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs shadow-sm">
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#135d54] ring-2 ring-[#135d54]/20 bg-white shadow-md'
                        : 'border-gray-200/80 bg-white hover:border-gray-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#121212]">
                          {o.orderId || o.id}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500 font-sans">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-700 font-medium truncate max-w-[120px]">
                          {o.customer?.name}
                        </span>
                      </div>

                      <div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide inline-flex items-center gap-1 ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-black text-white'
                        }`}>
                          {isDelivered && <Check size={11} className="stroke-[3]" />}
                          <span>{o.status || 'Pending'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="my-2.5 flex items-start justify-between gap-2 text-xs">
                      <div className="flex items-start gap-1.5">
                        <MapPin size={13} className={`mt-0.5 flex-shrink-0 ${isDelivered ? 'text-emerald-600' : 'text-[#135d54]'}`} />
                        <div>
                          <strong className="text-gray-800 text-xs block">{o.currentLocation || 'Central Warehouse, New Delhi'}</strong>
                          {o.transitNote && (
                            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{o.transitNote}</p>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm flex-shrink-0">
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

      {currentUser && myOrders.length === 0 && !order && (
        <div className="max-w-xl mx-auto mt-8 p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm text-xs space-y-2">
          <Package size={32} className="mx-auto text-gray-400 stroke-[1.5]" />
          <h4 className="font-bold text-sm text-gray-800">No Orders Placed Yet</h4>
          <p className="text-gray-500 max-w-sm mx-auto">
            You don't have any orders linked to @{currentUser.username} yet. Once you order from the store, you can track it live here.
          </p>
        </div>
      )}

      {/* When user is guest / not logged in and hasn't searched yet */}
      {!currentUser && !order && (
        <div className="max-w-xl mx-auto mt-8 p-8 text-center bg-white rounded-2xl border border-gray-200 shadow-sm text-xs space-y-2">
          <Package size={32} className="mx-auto text-gray-400 stroke-[1.5]" />
          <h4 className="font-bold text-sm text-gray-800">Live Order Tracking</h4>
          <p className="text-gray-500 max-w-sm mx-auto">
            Enter your Order ID (e.g. ORD-18193) or registered phone number above to view live dispatch status.
          </p>
        </div>
      )}

    </div>
  );
}
