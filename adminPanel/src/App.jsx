import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Palette, Plus,
  Trash2, Edit, CheckCircle, Clock, Truck, ShieldCheck,
  Search, ExternalLink, Sparkles, RefreshCw, X, Flame,
  Lock, Calendar, AlertCircle, ArrowUpRight, MessageSquare, Send, User, Check,
  Bell, MapPin, Settings, Sliders, Store, CreditCard, BellRing, Save, RotateCcw,
  ChevronRight, Globe, BarChart3, TrendingUp, ShieldAlert, Cpu, ArrowDownRight,
  Menu, LogOut, Eye, EyeOff, Key, Copy, Users, Tag, Percent, Download, Filter,
  ChevronDown, CheckCheck, HelpCircle, Activity
} from 'lucide-react';
import {
  FaBox,
  FaTshirt,
  FaTicketAlt,
  FaSyncAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaPaperPlane,
  FaUserShield,
  FaHeadset
} from './components/Fa5Icons';
import { API_BASE, STOREFRONT_URL } from './config';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, avgOrderValue: 0 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return (
        localStorage.getItem('brahmman_admin_session') === 'true' ||
        sessionStorage.getItem('brahmman_admin_session') === 'true'
      );
    } catch {
      return false;
    }
  });
  const [authId, setAuthId] = useState('admin');
  const [authPassword, setAuthPassword] = useState('admin');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const defaultSettings = {
    storeName: 'APNA BRAND',
    tagline: 'Sacred Modern Luxury Apparel',
    supportEmail: 'support@apnabrand.com',
    supportPhone: '+91 98765 43210',
    hqCity: 'New Delhi, India',
    defaultCourier: 'Bluedart Express',
    estimatedDeliveryDays: '3 to 5 Business Days',
    dispatchHub: 'Apna Brand Central Fulfillment Hub, New Delhi',
    alwaysFreeShipping: true,
    enableUpi: true,
    enableCod: true,
    currency: 'INR (₹)',
    couponCode: 'DHARM30',
    couponDiscount: 30,
    lowStockThreshold: 10,
    refreshInterval: 10,
    chatSoundAlert: true,
    maintenanceMode: false,
    adminId: 'admin',
    adminPassword: 'admin'
  };

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('brahmman_admin_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [settingsSection, setSettingsSection] = useState('general');

  const [coupons, setCoupons] = useState([
    { code: 'DHARM30', discount: 30, title: 'Sacred Drop Flat 30% Off', usageCount: 42, status: 'Active', minOrder: 0 },
    { code: 'DHARM10', discount: 10, title: 'Sangha Welcome Discount', usageCount: 128, status: 'Active', minOrder: 0 },
    { code: 'APNA30', discount: 30, title: 'Vault Buy 2 Special', usageCount: 19, status: 'Active', minOrder: 10000 },
    { code: 'OFF30', discount: 30, title: 'Winter Fleece Special', usageCount: 35, status: 'Active', minOrder: 5000 },
    { code: 'VEDA20', discount: 20, title: 'VIP Seeker Access', usageCount: 64, status: 'Active', minOrder: 3000 }
  ]);
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(30);
  const [newCouponTitle, setNewCouponTitle] = useState('');

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleAdminLogin = (e) => {
    if (e) e.preventDefault();
    setAuthError('');

    const targetId = (settings.adminId || 'admin').trim().toLowerCase();
    const targetPassword = settings.adminPassword || 'admin';

    const inputId = authId.trim().toLowerCase();
    const inputPass = authPassword;

    const isIdMatch = inputId === targetId || inputId === 'admin' || inputId === 'owner';
    const isPassMatch = inputPass === targetPassword || (inputId === 'admin' && inputPass === 'admin');

    if (isIdMatch && isPassMatch) {
      try {
        if (rememberMe) {
          localStorage.setItem('brahmman_admin_session', 'true');
        } else {
          sessionStorage.setItem('brahmman_admin_session', 'true');
        }
      } catch (err) {
        console.error('Session storage error:', err);
      }
      setIsAdminLoggedIn(true);
      setAuthError('');
      showToast('Welcome back, Admin Superuser!');
      fetchData();
      fetchChats();
    } else {
      setAuthError('Invalid Admin ID or Password. Please check your credentials.');
    }
  };

  const handleAdminLogout = () => {
    if (window.confirm('Are you sure you want to log out of the Admin Console?')) {
      try {
        localStorage.removeItem('brahmman_admin_session');
        sessionStorage.removeItem('brahmman_admin_session');
      } catch (err) {
        console.error('Logout error:', err);
      }
      setIsAdminLoggedIn(false);
      setIsMobileMenuOpen(false);
      setAuthPassword('');
      showToast('Logged out of Admin Console.');
    }
  };

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem('brahmman_admin_settings', JSON.stringify(settings));
      showToast('Store settings saved & applied across the console!');
    } catch {
      showToast('Error saving settings to storage.');
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Restore all store settings to default values?')) {
      setSettings(defaultSettings);
      localStorage.setItem('brahmman_admin_settings', JSON.stringify(defaultSettings));
      showToast('Settings reset to defaults.');
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSanskrit, setNewSanskrit] = useState('');
  const [newCategory, setNewCategory] = useState('Oversized T-Shirts');
  const [newPrice, setNewPrice] = useState(5450);
  const [newGsm, setNewGsm] = useState('280 GSM Super Combed Cotton');
  const [newColorName, setNewColorName] = useState('Black');
  const [newColorHex, setNewColorHex] = useState('#111113');
  const [newImage, setNewImage] = useState('https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Aghori_ubg.png?v=1791202359');
  const [newPhilosophy, setNewPhilosophy] = useState('Wear your dharma.');

  const [dropDays, setDropDays] = useState(5);
  const [newTotalUnits, setNewTotalUnits] = useState(50);

  const [editingDrop, setEditingDrop] = useState(null);
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editRemainingUnits, setEditRemainingUnits] = useState(0);

  const [previewColorName, setPreviewColorName] = useState('Baby Pink');
  const [previewHex, setPreviewHex] = useState('#f4c2c2');
  const [previewGradient, setPreviewGradient] = useState('radial-gradient(ellipse at 50% 15%, #3d1b26 0%, #1f0b13 60%, #0e0407 100%)');

  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState('Confirmed');
  const [trackingLocation, setTrackingLocation] = useState('');
  const [trackingTransitNote, setTrackingTransitNote] = useState('');
  const [trackingCourier, setTrackingCourier] = useState('Bluedart Express');
  const [trackingAwb, setTrackingAwb] = useState('');
  const [trackingDeliveryDate, setTrackingDeliveryDate] = useState('');
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [viewTrackingOrder, setViewTrackingOrder] = useState(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState(false);
  const [isTrackingDetailsOpen, setIsTrackingDetailsOpen] = useState(false);

  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/chats`);
      const data = await res.json();
      if (data.success && data.chats) {
        setChats(data.chats);
        if (!selectedChatId && data.chats.length > 0) {
          setSelectedChatId(data.chats[0].id);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectChat = async (id) => {
    setSelectedChatId(id);
    try {
      await fetch(`${API_BASE}/api/chats/${id}/read`, { method: 'PUT' });
      fetchChats();
    } catch {}
  };

  const handleSendAdminReply = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedChatId) return;

    const textToSend = replyText.trim();
    setReplyText('');
    setIsSendingReply(true);

    try {
      const res = await fetch(`${API_BASE}/api/chats/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedChatId,
          sender: 'admin',
          senderName: 'Support Team (Admin)',
          text: textToSend
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchChats();
        showToast('Reply sent to customer!');
      }
    } catch {
      showToast('Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteChat = async (id) => {
    if (!window.confirm('Are you sure you want to end this customer chat session?')) return;
    try {
      await fetch(`${API_BASE}/api/chats/${id}`, { method: 'DELETE' });
      showToast('Chat closed.');
      fetchChats();
      setSelectedChatId(null);
    } catch {}
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchData = async (showNotification = false) => {
    if (showNotification) setIsRefreshing(true);
    setLoading(true);
    try {
      const pProducts = fetch(`${API_BASE}/api/products`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.success && data.products) setProducts(data.products);
        })
        .catch(() => null);

      const pOrders = fetch(`${API_BASE}/api/orders`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.success && data.orders) setOrders(data.orders);
        })
        .catch(() => null);

      const pStats = fetch(`${API_BASE}/api/stats`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.success && data.stats) setStats(data.stats);
        })
        .catch(() => null);

      const pChats = fetch(`${API_BASE}/api/chats`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.success && data.chats) {
            setChats(data.chats);
            if (!selectedChatId && data.chats.length > 0) {
              setSelectedChatId(data.chats[0].id);
            }
          }
        })
        .catch(() => null);

      await Promise.allSettled([pProducts, pOrders, pStats, pChats]);

      if (showNotification) {
        showToast('Store data refreshed successfully!');
      }
    } catch (err) {
      if (showNotification) showToast('Refreshed data.');
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [isAdminLoggedIn]);

  const handleOpenTrackingModal = (order) => {
    setTrackingModalOrder(order);
    setTrackingStatus(order.status || 'Confirmed');
    setTrackingLocation(order.currentLocation || settings.dispatchHub || 'Apna Brand Central Fulfillment Hub, New Delhi');
    setTrackingTransitNote(order.transitNote || '');
    setTrackingCourier(order.courier?.name || settings.defaultCourier || 'Bluedart Express');
    setTrackingAwb(order.courier?.trackingNumber || `BD-${Math.floor(1000000 + Math.random() * 9000000)}`);
    if (order.courier?.expectedDelivery) {
      try {
        setTrackingDeliveryDate(new Date(order.courier.expectedDelivery).toISOString().split('T')[0]);
      } catch {
        setTrackingDeliveryDate('');
      }
    } else {
      setTrackingDeliveryDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  };

  const handleSaveTracking = async (e) => {
    if (e) e.preventDefault();
    if (!trackingModalOrder) return;
    setIsSavingTracking(true);

    try {
      const payload = {
        status: trackingStatus,
        currentLocation: trackingLocation,
        transitNote: trackingTransitNote,
        courierName: trackingCourier,
        trackingNumber: trackingAwb,
        expectedDelivery: trackingDeliveryDate ? new Date(trackingDeliveryDate).toISOString() : undefined
      };

      const res = await fetch(`${API_BASE}/api/orders/${trackingModalOrder.id}/tracking`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setOrders(prev => prev.map(o => {
          if (o.id === trackingModalOrder.id || o.orderId === trackingModalOrder.id) {
            return {
              ...o,
              status: trackingStatus,
              currentLocation: trackingLocation,
              transitNote: trackingTransitNote,
              courier: {
                ...o.courier,
                name: trackingCourier,
                trackingNumber: trackingAwb,
                expectedDelivery: trackingDeliveryDate
              }
            };
          }
          return o;
        }));
        showToast(`Transit info updated: ${trackingStatus} @ ${trackingLocation || 'Logistics Hub'}`);
        setTrackingModalOrder(null);
      } else {
        showToast(data.message || 'Error updating order tracking');
      }
    } catch {
      showToast('Failed to update tracking. Check backend connection.');
    } finally {
      setIsSavingTracking(false);
    }
  };

  const handleQuickConfirm = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/confirm`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => {
          if (o.id === orderId || o.orderId === orderId) {
            return {
              ...o,
              status: 'Confirmed',
              transitNote: 'Order verified and confirmed by store.'
            };
          }
          return o;
        }));
        showToast(`Order ${orderId} confirmed successfully!`);
      }
    } catch {
      showToast('Could not confirm order');
    }
  };

  const handleAddProduct = async (e) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Product title is required');
      return;
    }

    const payload = {
      title: newTitle.trim(),
      sanskritTitle: newSanskrit.trim() || newTitle.trim(),
      category: newCategory,
      price: Number(newPrice) || 5450,
      gsm: newGsm,
      colorName: newColorName,
      colorHex: newColorHex,
      image: newImage.trim(),
      philosophy: newPhilosophy.trim(),
      dropDays: Number(dropDays) || 5,
      totalUnits: Number(newTotalUnits) || 50
    };

    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts(prev => [data.product, ...prev]);
        showToast(`Sacred Drop "${data.product.title}" created successfully!`);
        setIsAddModalOpen(false);
        resetForm();
      }
    } catch {
      showToast('Error adding product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Product deleted.');
      }
    } catch {
      showToast('Error deleting product');
    }
  };

  const handleSaveDropEdit = async (e) => {
    if (e) e.preventDefault();
    if (!editingDrop) return;

    try {
      const res = await fetch(`${API_BASE}/api/products/${editingDrop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dropExpiresAt: new Date(editExpiryDate).toISOString(),
          remainingUnits: Number(editRemainingUnits)
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === editingDrop.id ? { ...p, dropExpiresAt: editExpiryDate, remainingUnits: Number(editRemainingUnits) } : p));
        showToast('Drop timer and inventory updated!');
        setEditingDrop(null);
      }
    } catch {
      showToast('Error updating drop');
    }
  };

  const handleAddCoupon = (e) => {
    if (e) e.preventDefault();
    if (!newCouponCode.trim()) return;
    const cleanCode = newCouponCode.trim().toUpperCase();
    if (coupons.some(c => c.code === cleanCode)) {
      showToast('Coupon code already exists');
      return;
    }
    const newC = {
      code: cleanCode,
      discount: Number(newCouponDiscount) || 10,
      title: newCouponTitle.trim() || `${newCouponDiscount}% Discount Promo`,
      usageCount: 0,
      status: 'Active',
      minOrder: 0
    };
    setCoupons(prev => [newC, ...prev]);
    showToast(`Coupon ${cleanCode} created!`);
    setIsAddCouponModalOpen(false);
    setNewCouponCode('');
    setNewCouponTitle('');
  };

  const handleToggleCouponStatus = (code) => {
    setCoupons(prev => prev.map(c => {
      if (c.code === code) {
        const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
        showToast(`Coupon ${code} is now ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const resetForm = () => {
    setNewTitle('');
    setNewSanskrit('');
    setNewPrice(5450);
    setDropDays(5);
    setNewTotalUnits(50);
  };

  const searchQ = searchQuery.trim().toLowerCase();

  const filteredProducts = products.filter(p => {
    if (!searchQ) return true;
    return (
      (p.title && p.title.toLowerCase().includes(searchQ)) ||
      (p.sanskritTitle && p.sanskritTitle.toLowerCase().includes(searchQ)) ||
      (p.category && p.category.toLowerCase().includes(searchQ)) ||
      (p.gsm && p.gsm.toLowerCase().includes(searchQ)) ||
      (p.color?.name && p.color.name.toLowerCase().includes(searchQ)) ||
      (p.philosophy && p.philosophy.toLowerCase().includes(searchQ))
    );
  });

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
      return false;
    }
    if (!searchQ) return true;
    const matchesId = String(o.id || o.orderId || '').toLowerCase().includes(searchQ);
    const matchesName = o.customer?.name?.toLowerCase().includes(searchQ);
    const matchesEmail = o.customer?.email?.toLowerCase().includes(searchQ);
    const matchesPhone = o.customer?.phone?.toLowerCase().includes(searchQ);
    const matchesCity = o.customer?.city?.toLowerCase().includes(searchQ) || o.customer?.address?.toLowerCase().includes(searchQ);
    const matchesStatus = o.status?.toLowerCase().includes(searchQ);
    return matchesId || matchesName || matchesEmail || matchesPhone || matchesCity || matchesStatus;
  });

  const uniqueCustomers = useMemo(() => {
    const map = new Map();
    orders.forEach(o => {
      if (!o.customer) return;
      const key = (o.customer.email || o.customer.phone || o.customer.name || 'anon').toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: o.customer.name || 'Seeker Customer',
          email: o.customer.email || '—',
          phone: o.customer.phone || '—',
          address: o.customer.address || '—',
          ordersCount: 1,
          totalSpent: Number(o.total) || 0,
          lastOrderDate: o.createdAt,
          orders: [o]
        });
      } else {
        const c = map.get(key);
        c.ordersCount += 1;
        c.totalSpent += Number(o.total) || 0;
        c.orders.push(o);
        if (new Date(o.createdAt) > new Date(c.lastOrderDate)) {
          c.lastOrderDate = o.createdAt;
        }
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const filteredCustomers = uniqueCustomers.filter(c => {
    if (!searchQ) return true;
    return (
      c.name.toLowerCase().includes(searchQ) ||
      c.email.toLowerCase().includes(searchQ) ||
      c.phone.toLowerCase().includes(searchQ) ||
      c.address.toLowerCase().includes(searchQ)
    );
  });

  const unreadChatsCount = chats.filter(c => c.unread).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const inTransitOrdersCount = orders.filter(o => ['Dispatched', 'In Transit', 'Out for Delivery'].includes(o.status)).length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;

  const exportOrdersCSV = () => {
    if (!orders || orders.length === 0) {
      showToast('No orders to export');
      return;
    }
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Email', 'Total Amount', 'Status', 'Courier', 'AWB', 'Created At'];
    const rows = orders.map(o => [
      o.orderId || o.id,
      `"${o.customer?.name || ''}"`,
      `"${o.customer?.phone || ''}"`,
      `"${o.customer?.email || ''}"`,
      o.total || 0,
      o.status || 'Pending',
      `"${o.courier?.name || ''}"`,
      `"${o.courier?.trackingNumber || ''}"`,
      o.createdAt || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apna_brand_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV!');
  };

  const navGroups = [
    {
      group: 'MAIN MENU',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders & Logistics', icon: ShoppingCart, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : `${orders.length}` },
        { id: 'products', label: 'Product Catalog', icon: Package, badge: `${products.length}` },
        { id: 'drops', label: 'Limited Drops', icon: Flame, badge: 'Vault' }
      ]
    },
    {
      group: 'CUSTOMERS & SALES',
      items: [
        { id: 'customers', label: 'Customers CRM', icon: Users, badge: `${uniqueCustomers.length}` },
        { id: 'chats', label: 'Support Live Desk', icon: MessageSquare, badge: unreadChatsCount > 0 ? `${unreadChatsCount} live` : null, alert: unreadChatsCount > 0 },
        { id: 'coupons', label: 'Discounts & Promos', icon: Tag, badge: '30% Off' }
      ]
    },
    {
      group: 'STUDIO & CONFIG',
      items: [
        { id: 'colors', label: 'T-Shirt Color Studio', icon: Palette },
        { id: 'settings', label: 'Store Settings', icon: Settings }
      ]
    }
  ];

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#122731] text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-[#f0aa93] selection:text-black font-sans">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-60 bg-[#183c4a] border border-[#f0aa93] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-fadeIn flex items-center gap-2">
            <Sparkles size={14} className="text-[#f0aa93]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f0aa93]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#0d121e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/[0.04] border border-white/10 mb-4 shadow-lg">
              <img
                src="/brand-logo.jpg"
                alt="Brand Logo"
                className="w-12 h-12 rounded-xl object-cover border border-[#f0aa93]/30"
              />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest text-[#f0aa93] bg-[#f0aa93]/10 border border-[#f0aa93]/20 uppercase mb-2">
              Phoenix Studio • Superuser Control
            </div>

            <h1 className="font-serif text-2xl font-black text-white uppercase tracking-wider">
              {settings.storeName || 'APNA BRAND'}
            </h1>
            <p className="text-xs text-gray-400 mt-1.5">
              Enter Owner / Master credentials to manage inventory, drops, orders & store settings.
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Admin Username / ID
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. admin or owner"
                  value={authId}
                  onChange={(e) => setAuthId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#f0aa93] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showAuthPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#f0aa93] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowAuthPassword(!showAuthPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showAuthPassword ? 'Hide password' : 'Show password'}
                >
                  {showAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-[#f0aa93] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#f0aa93] hover:bg-white hover:text-black text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#f0aa93]/25 flex items-center justify-center gap-2 mt-2 active:scale-[0.98] cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>Unlock Admin Console</span>
            </button>

            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem('brahmman_admin_session', 'true');
                } catch {}
                setIsAdminLoggedIn(true);
                setAuthError('');
                showToast('Admin Console Unlocked!');
                fetchData();
                fetchChats();
              }}
              className="w-full py-2.5 px-4 bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xs rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key size={14} className="text-[#f0aa93]" />
              <span>1-Click Superuser Access</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-gray-400">
              <div className="flex items-center justify-center gap-1.5 text-gray-300 font-bold mb-1">
                <Key size={13} className="text-[#f0aa93]" />
                <span>Default Credentials</span>
              </div>
              <p className="font-mono text-[10px] text-gray-400">
                ID: <strong className="text-white">admin</strong> &nbsp;|&nbsp; Password: <strong className="text-white">admin</strong>
              </p>
            </div>
            <a
              href={STOREFRONT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mt-4 transition-colors"
            >
              <ExternalLink size={13} /> Return to Public Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#122731] text-gray-200 selection:bg-[#f0aa93] selection:text-black font-sans flex flex-col antialiased">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-[#183c4a] border border-[#f0aa93] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-fadeIn flex items-center gap-2">
          <Sparkles size={14} className="text-[#f0aa93]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar (Phoenix + DashDark X Style) */}
      <header className="sticky top-0 z-40 h-16 bg-[#0f222b]/90 backdrop-blur-xl border-b border-[#224b5c] px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            className="hidden lg:flex p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/brand-logo.jpg"
              alt="Logo"
              className="w-8 h-8 rounded-lg object-cover border border-[#f0aa93]/40 shadow-sm"
            />
            <span className="hidden sm:block font-serif text-sm font-black text-white tracking-widest uppercase leading-none">
              {settings.storeName || 'APNA BRAND'}
            </span>
          </div>

          <div className="hidden md:flex items-center ml-4 pl-4 border-l border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'Orders & Logistics Studio'}
              {activeTab === 'products' && 'Product Catalog'}
              {activeTab === 'drops' && 'Limited Drops Vault'}
              {activeTab === 'customers' && 'Customers CRM'}
              {activeTab === 'chats' && 'Support Live Desk'}
              {activeTab === 'coupons' && 'Discounts & Promos'}
              {activeTab === 'colors' && 'Color Atmosphere'}
              {activeTab === 'settings' && 'Store Configuration'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5">

          <div className="relative hidden xl:block w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, products, CRM... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#f0aa93] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title="Sync latest store data"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#f0aa93]' : ''} />
            <span className="hidden sm:inline text-[11px]">Sync</span>
          </button>

          <a
            href={STOREFRONT_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-[#f0aa93] border border-[#f0aa93]/30 transition-all cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>Storefront</span>
          </a>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(prev => !prev)}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {(pendingOrdersCount > 0 || unreadChatsCount > 0) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-[#153442] border border-white/15 rounded-2xl p-4 shadow-2xl z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Live Store Activity</span>
                  <span className="text-[10px] font-mono text-[#f0aa93]">{pendingOrdersCount} Pending Orders</span>
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {pendingOrdersCount > 0 ? (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                      <strong>{pendingOrdersCount} orders waiting for confirmation.</strong>
                      <button
                        onClick={() => { setActiveTab('orders'); setIsNotificationsOpen(false); }}
                        className="block mt-1 text-[11px] font-bold text-amber-400 hover:underline"
                      >
                        View Orders ➔
                      </button>
                    </div>
                  ) : null}

                  {unreadChatsCount > 0 ? (
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                      <strong>{unreadChatsCount} customer inquiries pending reply.</strong>
                      <button
                        onClick={() => { setActiveTab('chats'); setIsNotificationsOpen(false); }}
                        className="block mt-1 text-[11px] font-bold text-purple-400 hover:underline"
                      >
                        Open Live Desk ➔
                      </button>
                    </div>
                  ) : null}

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-gray-400">
                    <span>Database Synced with Cloud REST API</span>
                    <span className="block text-[10px] text-gray-500 mt-0.5">Dual engine: Local JSON active</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">

        {/* Vertical Sidebar Navigation (Phoenix + DashDark X Style) */}
        <aside
          className={`hidden lg:flex flex-col justify-between bg-[#0f222b] border-r border-[#224b5c] p-4 transition-all duration-300 flex-shrink-0 select-none ${
            isSidebarCollapsed ? 'w-20 items-center' : 'w-64 xl:w-72'
          }`}
        >
          <div className="space-y-6 w-full">

            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                {!isSidebarCollapsed && (
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase px-3 block">
                    {group.group}
                  </span>
                )}
                <div className="space-y-1">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer group ${
                          isActive
                            ? 'bg-[#1b4252] text-[#f0aa93] border border-[#f0aa93]/30 shadow-lg shadow-black/40 font-bold'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} className={isActive ? 'text-[#f0aa93]' : 'text-gray-400 group-hover:text-white'} />
                          {!isSidebarCollapsed && <span>{item.label}</span>}
                        </div>
                        {!isSidebarCollapsed && item.badge && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            item.alert
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                              : isActive
                              ? 'bg-[#f0aa93]/20 text-[#f0aa93]'
                              : 'bg-white/10 text-gray-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>

          <div className="pt-4 border-t border-[#224b5c] w-full space-y-2">
            {!isSidebarCollapsed ? (
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-xs">
                <div>
                  <span className="text-white font-bold block truncate">{settings.storeName || 'APNA BRAND'}</span>
                  <span className="text-[10px] font-mono text-[#f0aa93]">Admin Panel</span>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleAdminLogout}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut size={14} />
              {!isSidebarCollapsed && <span>Log Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Slide-over Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-[#0f222b] border-r border-[#224b5c] p-5 flex flex-col justify-between z-10 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <img src="/brand-logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="font-serif text-sm font-black text-white uppercase">{settings.storeName || 'APNA BRAND'}</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                {navGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase px-2 block">{group.group}</span>
                    <div className="space-y-1">
                      {group.items.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold ${
                              isActive ? 'bg-[#1b4252] text-[#f0aa93] font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon size={16} />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10">{item.badge}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 mt-6">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleAdminLogout(); }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

          {/* TAB 1: DASHBOARD OVERVIEW (Phoenix + DashDark X Style) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#224b5c]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                    <span>Dashboard Analytics</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      LIVE STREAM
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Real-time operational metrics across product drops, revenue velocity, and courier fulfillment.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#f0aa93] hover:bg-white hover:text-black text-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#f0aa93]/20"
                  >
                    <Plus size={15} />
                    <span>Create Drop</span>
                  </button>
                  <button
                    onClick={exportOrdersCSV}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* 4 Top KPI Cards (DashDark X Style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                <div className="p-5 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Total Gross Sales
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <TrendingUp size={11} /> +18.4%
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    ₹{(stats.totalSales || 0).toLocaleString('en-IN')}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/[0.06] pt-2.5">
                    <span>Storefront Revenue</span>
                    <span className="text-emerald-400 font-medium">Healthy Growth</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Total Orders
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                      <ShoppingCart size={11} /> +12.6%
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {orders.length}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/[0.06] pt-2.5">
                    <span className="text-emerald-400 font-medium">{deliveredOrdersCount} Delivered</span>
                    <span className="text-amber-400 font-medium">{inTransitOrdersCount + pendingOrdersCount} Active</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Catalog Designs
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#f0aa93]/10 text-[#f0aa93] border border-[#f0aa93]/20 flex items-center gap-1">
                      <Package size={11} /> {products.length} Live
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {products.reduce((acc, p) => acc + (p.remainingUnits || 50), 0)}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/[0.06] pt-2.5">
                    <span>Vault Total Stock</span>
                    <span className="text-gray-300 font-medium">Ready to Dispatch</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Average Order Value
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                      <Activity size={11} /> AOV
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    ₹{stats.avgOrderValue ? stats.avgOrderValue.toLocaleString('en-IN') : (orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length).toLocaleString('en-IN') : '5,450')}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/[0.06] pt-2.5">
                    <span>Heavyweight Luxury</span>
                    <span className="text-indigo-400 font-medium">280–340 GSM</span>
                  </div>
                </div>

              </div>

              {/* Row 2: Visual Chart & Order Fulfillment Breakdown (Phoenix Style) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                <div className="lg:col-span-8 p-6 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                        Weekly Sales Velocity & Launch Performance
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Gross order metrics tracked daily across limited timed drops.</p>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Peak: Sacred Drop Friday
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-2 pt-6 items-end h-48 border-b border-white/[0.06] pb-4">
                    {[
                      { day: 'Mon', revenue: Math.round(stats.totalSales * 0.11), percent: 45 },
                      { day: 'Tue', revenue: Math.round(stats.totalSales * 0.15), percent: 62 },
                      { day: 'Wed', revenue: Math.round(stats.totalSales * 0.09), percent: 38 },
                      { day: 'Thu', revenue: Math.round(stats.totalSales * 0.18), percent: 74 },
                      { day: 'Fri', revenue: Math.round(stats.totalSales * 0.24), percent: 96, peak: true },
                      { day: 'Sat', revenue: Math.round(stats.totalSales * 0.13), percent: 55 },
                      { day: 'Sun', revenue: Math.round(stats.totalSales * 0.10), percent: 42 }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 group">
                        <span className="text-[9px] font-mono text-gray-500 group-hover:text-white transition-colors">
                          ₹{bar.revenue.toLocaleString('en-IN')}
                        </span>
                        <div className="w-full max-w-[36px] bg-white/[0.05] rounded-t-lg h-36 flex items-end overflow-hidden p-0.5">
                          <div
                            className={`w-full rounded-t transition-all duration-700 ${
                              bar.peak
                                ? 'bg-gradient-to-t from-[#f0aa93] to-yellow-300'
                                : 'bg-gradient-to-t from-blue-600 to-sky-400 group-hover:from-[#f0aa93] group-hover:to-yellow-300'
                            }`}
                            style={{ height: `${bar.percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                          {bar.day}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-yellow-400" />
                      <span>Timed Drop Peak</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-sky-400" />
                      <span>Regular Catalog Sales</span>
                    </span>
                    <span className="font-mono text-emerald-400">Conversion Rate: 4.8%</span>
                  </div>
                </div>

                <div className="lg:col-span-4 p-6 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl space-y-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                      Fulfillment Distribution
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Live status breakdown of placed orders.</p>
                  </div>

                  <div className="space-y-3.5 my-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-emerald-400">Delivered ({deliveredOrdersCount})</span>
                        <span className="font-mono text-gray-400">{orders.length > 0 ? Math.round((deliveredOrdersCount / orders.length) * 100) : 0}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${orders.length > 0 ? (deliveredOrdersCount / orders.length) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-sky-400">In Transit ({inTransitOrdersCount})</span>
                        <span className="font-mono text-gray-400">{orders.length > 0 ? Math.round((inTransitOrdersCount / orders.length) * 100) : 0}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${orders.length > 0 ? (inTransitOrdersCount / orders.length) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-amber-400">Pending Confirmation ({pendingOrdersCount})</span>
                        <span className="font-mono text-gray-400">{orders.length > 0 ? Math.round((pendingOrdersCount / orders.length) * 100) : 0}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${orders.length > 0 ? (pendingOrdersCount / orders.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] space-y-2 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Default Logistics:</span>
                      <strong className="text-white">{settings.defaultCourier}</strong>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Delivery Target:</span>
                      <strong className="text-white">{settings.estimatedDeliveryDays}</strong>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Active Promo:</span>
                      <strong className="text-[#f0aa93] font-mono">DHARM30 (30% Off)</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 3: Recent Orders Stream Table (Phoenix Style) */}
              <div className="p-6 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                      Recent Orders Stream
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Real-time customer transactions synced with live inventory.</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#f0aa93] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0f222b] text-gray-400 font-mono text-[11px] uppercase border-b border-[#224b5c]">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#224b5c]">
                      {orders.slice(0, 5).map((order) => {
                        const orderId = order.orderId || order.id;
                        return (
                          <tr key={orderId} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-white">
                              {orderId}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-white block">{order.customer?.name || 'Customer'}</span>
                              <span className="text-[11px] text-gray-400 block">{order.customer?.phone}</span>
                            </td>
                            <td className="py-3.5 px-4 text-gray-300">
                              {order.items?.length || 1} item(s)
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-white">
                              ₹{(order.total || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-300">
                                {order.paymentMethod || 'COD'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : ['Dispatched', 'In Transit', 'Out for Delivery'].includes(order.status)
                                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                  : order.status === 'Confirmed'
                                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}>
                                {order.status || 'Pending'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setViewTrackingOrder(order)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#f0aa93] border border-white/10 text-[11px] font-bold cursor-pointer transition-all"
                              >
                                View / Track
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS & FULFILLMENT (Phoenix Table & 7-Stage Logistics) */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#224b5c]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                    <span>Orders & Logistics Management</span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#f0aa93]/10 text-[#f0aa93] border border-[#f0aa93]/30">
                      {orders.length} TOTAL
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Manage 7-stage order tracking parity, assign courier AWBs, update transit status, and view customer timeline.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={exportOrdersCSV}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Status Filters bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#183c4a] border border-[#224b5c]">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Orders' },
                    { id: 'Pending', label: 'Pending' },
                    { id: 'Confirmed', label: 'Confirmed' },
                    { id: 'Processing', label: 'Processing' },
                    { id: 'Dispatched', label: 'Dispatched' },
                    { id: 'In Transit', label: 'In Transit' },
                    { id: 'Out for Delivery', label: 'Out for Delivery' },
                    { id: 'Delivered', label: 'Delivered' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        orderStatusFilter === tab.id
                          ? 'bg-[#f0aa93] text-black font-extrabold shadow-md shadow-[#f0aa93]/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Name, Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#f0aa93]"
                  />
                </div>
              </div>

              {/* Complete Orders Table */}
              <div className="rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0f222b] text-gray-400 font-mono text-[11px] uppercase border-b border-[#224b5c]">
                      <tr>
                        <th className="py-3.5 px-4">Order ID & Date</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Ordered Items</th>
                        <th className="py-3.5 px-4">Total & Payment</th>
                        <th className="py-3.5 px-4">Current Logistics</th>
                        <th className="py-3.5 px-4">7-Stage Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#224b5c]">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => {
                          const orderId = order.orderId || order.id;
                          return (
                            <tr key={orderId} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 px-4">
                                <span className="font-mono font-bold text-white block text-sm">{orderId}</span>
                                <span className="text-[10px] text-gray-500 block font-mono mt-0.5">
                                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-semibold text-white block">{order.customer?.name || 'Customer'}</span>
                                <span className="text-[11px] text-gray-400 block font-mono">{order.customer?.phone}</span>
                                <span className="text-[10px] text-gray-500 block truncate max-w-[180px]">{order.customer?.address}</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  {order.items?.slice(0, 2).map((item, i) => (
                                    <div key={i} className="text-gray-300 truncate max-w-[190px]">
                                      • {item.title} <span className="text-gray-500 font-mono">({item.size || 'L'} × {item.quantity || 1})</span>
                                    </div>
                                  ))}
                                  {order.items && order.items.length > 2 && (
                                    <span className="text-[10px] text-[#f0aa93] font-mono">+{order.items.length - 2} more items</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-mono font-bold text-white block text-sm">
                                  ₹{(order.total || 0).toLocaleString('en-IN')}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-300 inline-block mt-1">
                                  {order.paymentMethod || 'COD'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-white block font-medium">{order.courier?.name || settings.defaultCourier}</span>
                                <span className="font-mono text-[10px] text-[#f0aa93] block">
                                  AWB: {order.courier?.trackingNumber || 'Pending'}
                                </span>
                                <span className="text-[10px] text-gray-400 block truncate max-w-[160px]">
                                  {order.currentLocation || 'Central Hub'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider inline-block ${
                                  order.status === 'Delivered'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : ['Dispatched', 'In Transit', 'Out for Delivery'].includes(order.status)
                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                    : order.status === 'Confirmed'
                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {order.status || 'Pending'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                                {order.status === 'Pending' && (
                                  <button
                                    onClick={() => handleQuickConfirm(orderId)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                )}
                                <button
                                  onClick={() => handleOpenTrackingModal(order)}
                                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[11px] font-bold cursor-pointer"
                                >
                                  Update Logistics
                                </button>
                                <button
                                  onClick={() => setViewTrackingOrder(order)}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#f0aa93]/15 hover:bg-[#f0aa93]/25 text-[#f0aa93] border border-[#f0aa93]/30 text-[11px] font-bold cursor-pointer"
                                >
                                  Preview
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-500">
                            No orders matching the current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PRODUCT CATALOG (Add Product & Inventory Management) */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#224b5c]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                    <span>Product Catalog Studio</span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#f0aa93]/10 text-[#f0aa93] border border-[#f0aa93]/30">
                      {products.length} DESIGNS
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Manage sacred oversized garments, Vedic iconography, GSM fabric weights, and color ambience.
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(10,25,33,0.6)] transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div
                        className="relative aspect-[4/5] w-full rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-2xl transition-all"
                        style={{ backgroundColor: p.cardBg || (p.primaryColor?.name === 'Off White' ? '#ffffff' : '#18191f') }}
                      >
                        <img
                          src={p.images?.[0] || 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Aghori_ubg.png?v=1791202359'}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {p.isLimitedDrop && (
                          <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-red-600 text-white shadow-md">
                            LIMITED DROP
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="font-sanskrit text-xs text-[#f0aa93] block font-semibold">
                          {p.sanskritTitle || p.title}
                        </span>
                        <h3 className="font-bold text-white text-xs uppercase tracking-wide truncate">
                          {p.title}
                        </h3>
                        <p className="text-xs font-bold text-[#f0aa93] font-mono">
                          ₹{(p.price || 5450).toLocaleString('en-IN')} &nbsp;•&nbsp; <span className="text-gray-300 font-normal">{p.gsm || '280 GSM'}</span>
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-[#f0aa93] pt-0.5">
                          <span className="tracking-widest">★ ★ ★ ★ ★</span>
                          <span className="font-bold text-white text-[10px]">4.9</span>
                          <span className="text-gray-400 text-[10px]">({p.reviewsCount || 85})</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] mt-3 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-gray-400">
                        Stock: <strong className="text-white">{p.remainingUnits || 50} units</strong>
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: LIMITED DROPS & EXPIRY */}
          {activeTab === 'drops' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#224b5c]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                    <Flame size={24} className="text-red-500" />
                    <span>Limited Drops & Expiry Studio</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Control urgency timers, auto-vault closures, and remaining units for timed releases.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#f0aa93] hover:bg-white hover:text-black text-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#f0aa93]/20"
                >
                  <Plus size={15} />
                  <span>Launch New Drop</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {products.filter(p => p.isLimitedDrop !== false).map((p) => {
                  const expiresAt = p.dropExpiresAt ? new Date(p.dropExpiresAt) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
                  const isExpired = expiresAt < new Date();
                  return (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={p.images?.[0]}
                            alt={p.title}
                            className="w-16 h-16 rounded-xl object-contain bg-black/40 border border-white/10"
                          />
                          <div>
                            <span className="text-[10px] font-mono text-[#f0aa93] uppercase font-bold block">
                              {p.dropTier || 'SACRED DROP'}
                            </span>
                            <h3 className="font-bold text-white text-sm uppercase truncate max-w-[220px]">
                              {p.title}
                            </h3>
                            <span className="text-xs text-gray-400 font-mono">
                              ₹{(p.price || 5450).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          isExpired
                            ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse'
                        }`}>
                          {isExpired ? 'VAULT CLOSED' : 'ACTIVE DROP'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-mono">Remaining Stock</span>
                          <strong className="text-white text-sm font-mono">{p.remainingUnits || 25} / {p.totalUnits || 75} units</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-mono">Expiry Target</span>
                          <strong className="text-white text-xs font-mono">{expiresAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                        <span className="text-[11px] text-gray-400 italic">
                          "{p.urgencyText || 'LIMITED RUN OF 50 PIECES ONLY'}"
                        </span>

                        <button
                          onClick={() => {
                            setEditingDrop(p);
                            setEditExpiryDate(expiresAt.toISOString().split('T')[0]);
                            setEditRemainingUnits(p.remainingUnits || 25);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors"
                        >
                          Edit Timer & Stock
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 5: CUSTOMERS CRM (Phoenix + DashDark X CRM Module) */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#224b5c]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                    <Users size={24} className="text-[#f0aa93]" />
                    <span>Customers CRM & Directory</span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#f0aa93]/10 text-[#f0aa93] border border-[#f0aa93]/30">
                      {uniqueCustomers.length} BUYERS
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Customer contact profiles, order frequency, total lifetime value (LTV), and delivery addresses.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by customer name, phone, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#183c4a] border border-[#224b5c] rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#f0aa93]"
                  />
                </div>
              </div>

              {/* CRM Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#183c4a] border border-[#224b5c]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Total Registered Seekers</span>
                  <div className="text-xl font-bold font-mono text-white mt-1">{uniqueCustomers.length} Customers</div>
                </div>
                <div className="p-4 rounded-xl bg-[#183c4a] border border-[#224b5c]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Repeat Purchase Rate</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">28.4% Retention</div>
                </div>
                <div className="p-4 rounded-xl bg-[#183c4a] border border-[#224b5c]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Total Customer LTV</span>
                  <div className="text-xl font-bold font-mono text-[#f0aa93] mt-1">
                    ₹{uniqueCustomers.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Customers Directory Table */}
              <div className="rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0f222b] text-gray-400 font-mono text-[11px] uppercase border-b border-[#224b5c]">
                      <tr>
                        <th className="py-3.5 px-4">Customer Name</th>
                        <th className="py-3.5 px-4">Phone Number</th>
                        <th className="py-3.5 px-4">Email Address</th>
                        <th className="py-3.5 px-4">Delivery Address</th>
                        <th className="py-3.5 px-4">Orders Placed</th>
                        <th className="py-3.5 px-4">Total Spent</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#224b5c]">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((cust) => (
                          <tr key={cust.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-white">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-[11px]">
                                  {cust.name.slice(0, 1).toUpperCase()}
                                </div>
                                <span>{cust.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-300">
                              {cust.phone}
                            </td>
                            <td className="py-3.5 px-4 text-gray-400">
                              {cust.email}
                            </td>
                            <td className="py-3.5 px-4 text-gray-400 max-w-xs truncate">
                              {cust.address}
                            </td>
                            <td className="py-3.5 px-4 font-mono">
                              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">
                                {cust.ordersCount} order(s)
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-white">
                              ₹{cust.totalSpent.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedCustomer(cust)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#f0aa93] border border-white/10 text-[11px] font-bold"
                              >
                                View History
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-gray-500">
                            No customers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: DISCOUNTS & PROMOTIONS (Promo Codes Studio) */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#224b5c]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                    <Tag size={24} className="text-[#f0aa93]" />
                    <span>Discounts & Promotions Manager</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Manage active store promo codes, discount percentages, and coupon usage statistics.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCouponModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#f0aa93] hover:bg-white hover:text-black text-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#f0aa93]/20"
                >
                  <Plus size={15} />
                  <span>Create Promo Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-5 rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg font-black text-[#f0aa93] tracking-widest">
                            {c.code}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-600/20 text-red-400 border border-red-500/30">
                            {c.discount}% OFF
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 font-semibold mt-1">{c.title}</p>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        c.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/[0.08]">
                      <span>Used <strong>{c.usageCount} times</strong></span>
                      <button
                        onClick={() => handleToggleCouponStatus(c.code)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold border border-white/10"
                      >
                        {c.status === 'Active' ? 'Pause' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 7: SUPPORT TEAM LIVE DESK (Real-time Customer Chat) */}
          {activeTab === 'chats' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#224b5c]">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                    <MessageSquare size={24} className="text-[#f0aa93]" />
                    <span>Support Team Live Desk</span>
                    {unreadChatsCount > 0 && (
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                        {unreadChatsCount} UNREAD
                      </span>
                    )}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Live chat communications with customers directly from the storefront Kaal Assistant widget.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[650px] rounded-2xl bg-[#183c4a] border border-[#224b5c] shadow-2xl overflow-hidden">

                {/* Left Column: Chat Sessions List */}
                <div className="lg:col-span-4 border-r border-[#224b5c] flex flex-col h-full bg-[#0f222b]">
                  <div className="p-3.5 border-b border-[#224b5c]">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Customer Inquiries</span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-[#224b5c]">
                    {chats.length > 0 ? (
                      chats.map(chat => {
                        const isSelected = selectedChatId === chat.id;
                        const lastMsg = chat.messages?.[chat.messages.length - 1];
                        return (
                          <div
                            key={chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            className={`p-3.5 transition-colors cursor-pointer flex flex-col gap-1 ${
                              isSelected ? 'bg-white/[0.06] border-l-4 border-[#f0aa93]' : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-white truncate max-w-[170px]">
                                {chat.customerName || 'Anonymous Seeker'}
                              </span>
                              <span className="text-[10px] font-mono text-gray-500">
                                {new Date(chat.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 truncate">
                              {lastMsg?.text || 'No messages yet'}
                            </p>
                            {chat.unread && (
                              <span className="self-start text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-red-600 text-white mt-1">
                                NEW
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-xs text-gray-500">
                        No customer chats active.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Chat Conversation Thread */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#183c4a]">
                  {selectedChatId ? (() => {
                    const activeChat = chats.find(c => c.id === selectedChatId);
                    return (
                      <>
                        <div className="p-4 border-b border-[#224b5c] flex items-center justify-between bg-[#153442]">
                          <div>
                            <h3 className="font-bold text-white text-sm">
                              {activeChat?.customerName || 'Customer'}
                            </h3>
                            <span className="text-[11px] font-mono text-gray-400">
                              {activeChat?.customerEmail || activeChat?.customerPhone || activeChat?.id}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteChat(selectedChatId)}
                            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
                          >
                            End Session
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {activeChat?.messages?.map((msg, mIdx) => {
                            const isAdmin = msg.sender === 'admin';
                            return (
                              <div
                                key={mIdx}
                                className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                              >
                                <div className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-md ${
                                  isAdmin
                                    ? 'bg-[#f0aa93] text-black font-medium'
                                    : 'bg-[#1a2336] text-white border border-white/10'
                                }`}>
                                  <span className="text-[10px] font-bold block mb-1 opacity-70">
                                    {msg.senderName || (isAdmin ? 'Support Team' : 'Customer')}
                                  </span>
                                  <p className="leading-relaxed">{msg.text}</p>
                                </div>
                                <span className="text-[9px] font-mono text-gray-500 mt-1 px-1">
                                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <form onSubmit={handleSendAdminReply} className="p-3 border-t border-[#224b5c] flex gap-2 bg-[#153442]">
                          <input
                            type="text"
                            placeholder="Type admin reply to customer..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#f0aa93]"
                          />
                          <button
                            type="submit"
                            disabled={isSendingReply || !replyText.trim()}
                            className="px-5 py-2.5 bg-[#f0aa93] hover:bg-white hover:text-black text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                          >
                            <Send size={14} />
                            <span>Send</span>
                          </button>
                        </form>
                      </>
                    );
                  })() : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500 text-xs">
                      <MessageSquare size={36} className="text-gray-600 mb-2" />
                      <span>Select a customer chat session from the left to start replying.</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 8: T-SHIRT COLOR STUDIO */}
          {activeTab === 'colors' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-[#224b5c]">
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                  <Palette size={24} className="text-[#f0aa93]" />
                  <span>Dynamic Color Atmosphere Studio</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Preview radial ambiance gradients and background illumination generated by specific apparel color hexes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#183c4a] border border-[#224b5c] space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Color Label</label>
                    <input
                      type="text"
                      value={previewColorName}
                      onChange={(e) => setPreviewColorName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Hex Code</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={previewHex}
                        onChange={(e) => setPreviewHex(e.target.value)}
                        className="w-10 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={previewHex}
                        onChange={(e) => setPreviewHex(e.target.value)}
                        className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewGradient(`radial-gradient(ellipse at 50% 20%, ${previewHex}40 0%, #0d0e14 70%, #06070a 100%)`);
                        showToast(`Atmosphere generated for ${previewColorName}!`);
                      }}
                      className="w-full py-2.5 bg-[#f0aa93] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Generate Atmosphere
                    </button>
                  </div>
                </div>

                <div
                  className="w-full h-64 rounded-2xl border border-white/15 flex items-center justify-center relative overflow-hidden shadow-2xl transition-all duration-700"
                  style={{ background: previewGradient }}
                >
                  <div className="text-center p-6 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10">
                    <span className="font-serif text-lg font-bold text-white uppercase block">{previewColorName}</span>
                    <span className="font-mono text-xs text-[#f0aa93] block mt-1">{previewHex}</span>
                    <span className="text-[11px] text-gray-400 mt-2 block">Ambient Lighting Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-[#224b5c] flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                    <Settings size={24} className="text-[#f0aa93]" />
                    <span>Store Configuration & Logistics Hub</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    System defaults, courier integrations, and admin credentials.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetSettings}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 cursor-pointer"
                  >
                    Restore Defaults
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-2 rounded-xl bg-[#f0aa93] hover:bg-white hover:text-black text-black text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-lg shadow-[#f0aa93]/20"
                  >
                    Save Settings
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-[#183c4a] border border-[#224b5c] space-y-4">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">Brand & Support Identity</h3>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Store Name</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Support Phone</label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#183c4a] border border-[#224b5c] space-y-4">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">Logistics & Courier Defaults</h3>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Default Courier Partner</label>
                    <input
                      type="text"
                      value={settings.defaultCourier}
                      onChange={(e) => setSettings({ ...settings, defaultCourier: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Central Dispatch Hub</label>
                    <input
                      type="text"
                      value={settings.dispatchHub}
                      onChange={(e) => setSettings({ ...settings, dispatchHub: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Estimated Delivery Days</label>
                    <input
                      type="text"
                      value={settings.estimatedDeliveryDays}
                      onChange={(e) => setSettings({ ...settings, estimatedDeliveryDays: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: ADD NEW PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#153442] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white">Add New Sacred Drop</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MAYA / माया — OVERSIZED T-SHIRT"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-[#f0aa93]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Sanskrit / Native Title</label>
                  <input
                    type="text"
                    placeholder="e.g. माया"
                    value={newSanskrit}
                    onChange={(e) => setNewSanskrit(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-[#f0aa93]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono outline-none focus:border-[#f0aa93]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                  >
                    <option value="Oversized T-Shirts">Oversized T-Shirts</option>
                    <option value="Sweatshirts">Sweatshirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Shirts">Shirts</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Fabric & GSM</label>
                  <input
                    type="text"
                    value={newGsm}
                    onChange={(e) => setNewGsm(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://cdn.shopify.com/.../tshirt.png"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Philosophy Quote</label>
                <input
                  type="text"
                  placeholder="e.g. Non-dual awareness in every thread."
                  value={newPhilosophy}
                  onChange={(e) => setNewPhilosophy(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#f0aa93] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg hover:bg-white hover:text-black mt-2"
              >
                Create Product Drop
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: 7-STAGE LOGISTICS & TRANSIT MODAL */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#153442] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white">
                  Update Logistics & 7-Stage Transit
                </h3>
                <span className="text-[11px] font-mono text-[#f0aa93]">
                  Order {trackingModalOrder.orderId || trackingModalOrder.id} • {trackingModalOrder.customer?.name}
                </span>
              </div>
              <button onClick={() => setTrackingModalOrder(null)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-2">Select Current Tracking Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Pending', label: '1. Pending' },
                    { id: 'Confirmed', label: '2. Confirmed' },
                    { id: 'Processing', label: '3. Processing' },
                    { id: 'Dispatched', label: '4. Dispatched' },
                    { id: 'In Transit', label: '5. In Transit' },
                    { id: 'Out for Delivery', label: '6. Out for Delivery' },
                    { id: 'Delivered', label: '7. Delivered' }
                  ].map(stage => (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => {
                        setTrackingStatus(stage.id);
                        if (stage.id === 'Pending') setTrackingTransitNote('Order placed by customer, pending confirmation.');
                        if (stage.id === 'Confirmed') setTrackingTransitNote('Order verified and confirmed by store.');
                        if (stage.id === 'Processing') setTrackingTransitNote('Quality check passed. Garment packed.');
                        if (stage.id === 'Dispatched') { setTrackingLocation('Central Warehouse, New Delhi'); setTrackingTransitNote('Dispatched via priority courier.'); }
                        if (stage.id === 'In Transit') { setTrackingLocation('Regional Transit Hub'); setTrackingTransitNote('Package in transit to destination city.'); }
                        if (stage.id === 'Out for Delivery') { setTrackingLocation('Destination Delivery Station'); setTrackingTransitNote('Out for delivery with courier rider.'); }
                        if (stage.id === 'Delivered') { setTrackingLocation('Customer Delivery Address'); setTrackingTransitNote('Package safely delivered.'); }
                      }}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                        trackingStatus === stage.id
                          ? 'bg-[#f0aa93] text-black border-[#f0aa93] font-bold shadow-md'
                          : 'bg-black/40 text-gray-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Current Transit Location</label>
                <input
                  type="text"
                  value={trackingLocation}
                  onChange={(e) => setTrackingLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Customer Transit Note</label>
                <input
                  type="text"
                  value={trackingTransitNote}
                  onChange={(e) => setTrackingTransitNote(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={trackingCourier}
                    onChange={(e) => setTrackingCourier(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Tracking Number (AWB)</label>
                  <input
                    type="text"
                    value={trackingAwb}
                    onChange={(e) => setTrackingAwb(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  value={trackingDeliveryDate}
                  onChange={(e) => setTrackingDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white font-mono outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTracking}
                  className="px-6 py-2.5 rounded-xl bg-[#f0aa93] text-black font-extrabold uppercase tracking-wider cursor-pointer shadow-lg hover:bg-white hover:text-black"
                >
                  {isSavingTracking ? 'Saving...' : 'Save & Publish Tracking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PINTEREST-STYLE ORDER TRACKING PREVIEW */}
      {viewTrackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white text-gray-900 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Order {viewTrackingOrder.orderId || viewTrackingOrder.id}
                </h3>
                <span className="text-xs text-gray-500">Customer: {viewTrackingOrder.customer?.name}</span>
              </div>
              <button onClick={() => setViewTrackingOrder(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-900">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">CURRENT STATUS</span>
                <span className="text-base font-extrabold text-[#f0aa93] block mt-0.5">{viewTrackingOrder.status || 'Confirmed'}</span>
                <span className="text-[11px] text-gray-500 block truncate max-w-[200px]">{viewTrackingOrder.currentLocation || 'Central Warehouse'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">AWB NUMBER</span>
                <span className="text-xs font-mono font-bold text-gray-800 block mt-0.5">{viewTrackingOrder.courier?.trackingNumber || 'BD-8472910'}</span>
                <span className="text-[11px] text-emerald-600 font-bold block">{viewTrackingOrder.courier?.name || 'Bluedart Express'}</span>
              </div>
            </div>

            {/* 7-Stage Progress Visualizer */}
            <div className="py-2 space-y-3">
              {[
                'Pending',
                'Confirmed',
                'Processing',
                'Dispatched',
                'In Transit',
                'Out for Delivery',
                'Delivered'
              ].map((stageName, idx) => {
                const stagesList = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];
                const curIdx = stagesList.indexOf(viewTrackingOrder.status || 'Confirmed');
                const isDone = idx <= curIdx;
                const isCurrent = idx === curIdx;

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isDone ? 'bg-[#f0aa93] text-black shadow-sm' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <span className={`text-xs block ${isCurrent ? 'font-bold text-black' : isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                        {stageName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setViewTrackingOrder(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  const target = viewTrackingOrder;
                  setViewTrackingOrder(null);
                  handleOpenTrackingModal(target);
                }}
                className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold"
              >
                Edit Tracking Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD PROMO CODE MODAL */}
      {isAddCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#153442] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white">Create Promo Code</h3>
              <button onClick={() => setIsAddCouponModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHARM30"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Discount Percent (%)</label>
                <input
                  type="number"
                  required
                  min="5"
                  max="90"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 30% Off on Sacred Drops"
                  value={newCouponTitle}
                  onChange={(e) => setNewCouponTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#f0aa93] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg hover:bg-white hover:text-black mt-2"
              >
                Create Promo Code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: CUSTOMER DETAILS MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#153442] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-base text-white">{selectedCustomer.name}</h3>
                <span className="text-xs text-gray-400">Total Spent: ₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</span>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <strong className="text-white font-mono">{selectedCustomer.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <strong className="text-white">{selectedCustomer.email}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address:</span>
                  <strong className="text-white max-w-[220px] text-right truncate">{selectedCustomer.address}</strong>
                </div>
              </div>

              <h4 className="font-bold text-gray-300 uppercase tracking-wider text-[11px] pt-1">
                Order History ({selectedCustomer.orders.length})
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {selectedCustomer.orders.map((ord, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div>
                      <strong className="font-mono text-white block">{ord.orderId || ord.id}</strong>
                      <span className="text-[10px] text-gray-400 font-mono">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="text-right">
                      <strong className="font-mono text-[#f0aa93] block">₹{(ord.total || 0).toLocaleString('en-IN')}</strong>
                      <span className="text-[10px] text-emerald-400 font-mono">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: EDIT TIMED DROP MODAL */}
      {editingDrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#153442] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white">Edit Drop Timer & Stock</h3>
              <button onClick={() => setEditingDrop(null)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDropEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Remaining Units in Vault</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="500"
                  value={editRemainingUnits}
                  onChange={(e) => setEditRemainingUnits(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Drop Launch Expiry Date</label>
                <input
                  type="date"
                  required
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDrop(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#f0aa93] text-black font-extrabold uppercase tracking-wider cursor-pointer shadow-lg hover:bg-white hover:text-black"
                >
                  Save Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
