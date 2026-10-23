import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Palette, Plus,
  Trash2, Edit, CheckCircle, Clock, Truck, ShieldCheck,
  Search, ExternalLink, Sparkles, RefreshCw, X, Flame,
  Lock, Calendar, AlertCircle, ArrowUpRight, MessageSquare, Send, User, Check,
  Bell, MapPin, Settings, Sliders, Store, CreditCard, BellRing, Save, RotateCcw,
  ChevronRight, Globe, BarChart3, TrendingUp, ShieldAlert, Cpu, ArrowDownRight,
  Menu, LogOut, Eye, EyeOff, Key, Copy
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
    couponCode: 'DHARM10',
    couponDiscount: 10,
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

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
  const [chatSearch, setChatSearch] = useState('');
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
    const interval = setInterval(fetchChats, 2500);
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
    setTimeout(() => setToastMessage(null), 3000);
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
    } catch (err) {
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
      } else {
        showToast(data.message || 'Error confirming order');
      }
    } catch {
      showToast('Backend connection error');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const expiry = new Date(Date.now() + Number(dropDays) * 24 * 60 * 60 * 1000).toISOString();

    const productPayload = {
      title: newTitle,
      sanskritTitle: newSanskrit || newTitle,
      category: newCategory,
      price: Number(newPrice),
      gsm: newGsm,
      images: [newImage],
      philosophyQuote: `"${newPhilosophy}"`,
      dropLaunchDate: new Date().toISOString(),
      dropExpiresAt: expiry,
      totalUnits: Number(newTotalUnits),
      remainingUnits: Number(newTotalUnits),
      dropStatus: 'active',
      dropTier: 'EXCLUSIVE LIMITED DROP',
      primaryColor: {
        name: newColorName,
        hex: newColorHex,
        cardBg: newColorHex
      },
      cardBg: newColorHex,
      colors: [{ name: newColorName, hex: newColorHex }]
    };

    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      });
      const data = await res.json();
      if (data.success) {
        setProducts([data.product, ...products]);
        setIsAddModalOpen(false);
        showToast('Created new limited drop product!');
        resetForm();
      }
    } catch {

      setProducts([{ id: Date.now(), ...productPayload }, ...products]);
      setIsAddModalOpen(false);
      showToast('Created new limited drop product!');
      resetForm();
    }
  };

  const handleExtendDropDays = async (productId, daysToAdd) => {
    try {
      await fetch(`${API_BASE}/api/products/${productId}/drop`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extendDays: daysToAdd })
      });
    } catch (e) {
      console.error(e);
    }

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const current = new Date(p.dropExpiresAt || new Date());
        const updated = new Date(Math.max(Date.now(), current.getTime()) + daysToAdd * 24 * 60 * 60 * 1000);
        return {
          ...p,
          dropExpiresAt: updated.toISOString(),
          dropStatus: 'active'
        };
      }
      return p;
    }));
    showToast(`Drop extended by ${daysToAdd} days!`);
  };

  const handleRestockUnits = async (productId, unitsToAdd) => {
    const p = products.find(prod => prod.id === productId);
    const newRemaining = (p?.remainingUnits || 0) + unitsToAdd;
    const newTotal = (p?.totalUnits || 50) + unitsToAdd;

    try {
      await fetch(`${API_BASE}/api/products/${productId}/drop`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remainingUnits: newRemaining, totalUnits: newTotal, dropStatus: 'active' })
      });
    } catch (e) {
      console.error(e);
    }

    setProducts(prev => prev.map(prod => {
      if (prod.id === productId) {
        return {
          ...prod,
          remainingUnits: newRemaining,
          totalUnits: newTotal,
          dropStatus: 'active'
        };
      }
      return prod;
    }));
    showToast(`Restocked ${unitsToAdd} limited units!`);
  };

  const handleVaultDrop = async (productId) => {
    try {
      await fetch(`${API_BASE}/api/products/${productId}/drop`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dropExpiresAt: new Date(Date.now() - 1000).toISOString(), dropStatus: 'expired' })
      });
    } catch (e) {
      console.error(e);
    }

    setProducts(prev => prev.map(prod => {
      if (prod.id === productId) {
        return {
          ...prod,
          dropExpiresAt: new Date(Date.now() - 1000).toISOString(),
          dropStatus: 'expired'
        };
      }
      return prod;
    }));
    showToast(`Drop marked as EXPIRED & VAULTED.`);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this piece from the catalog?')) return;
    try {
      await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setProducts(products.filter(p => p.id !== id));
    showToast('Product deleted from catalog.');
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

  const searchOrders = searchQ ? orders.filter(o => {
    const matchesId = String(o.id || '').toLowerCase().includes(searchQ);
    const matchesName = o.customer?.name?.toLowerCase().includes(searchQ);
    const matchesEmail = o.customer?.email?.toLowerCase().includes(searchQ);
    const matchesPhone = o.customer?.phone?.toLowerCase().includes(searchQ);
    const matchesCity = o.customer?.city?.toLowerCase().includes(searchQ);
    const matchesStatus = o.status?.toLowerCase().includes(searchQ);
    const matchesLoc = o.currentLocation?.toLowerCase().includes(searchQ);
    const matchesCourier = o.courier?.name?.toLowerCase().includes(searchQ);
    const matchesAwb = o.courier?.trackingNumber?.toLowerCase().includes(searchQ);
    const matchesItems = o.items && o.items.some(item => item.title?.toLowerCase().includes(searchQ));
    return matchesId || matchesName || matchesEmail || matchesPhone || matchesCity || matchesStatus || matchesLoc || matchesCourier || matchesAwb || matchesItems;
  }) : [];

  const searchDrops = searchQ ? products.filter(p =>
    (p.title && p.title.toLowerCase().includes(searchQ)) ||
    (p.category && p.category.toLowerCase().includes(searchQ))
  ) : [];

  const searchChats = searchQ ? chats.filter(c =>
    (c.customerName && c.customerName.toLowerCase().includes(searchQ)) ||
    (c.customerEmail && c.customerEmail.toLowerCase().includes(searchQ)) ||
    (c.messages && c.messages.some(m => m.text?.toLowerCase().includes(searchQ)))
  ) : [];

  const settingsKeywords = [
    { id: 'general', title: 'Store Name & Brand Identity', query: ['name', 'brand', 'store', 'support', 'email', 'phone', 'delhi', 'city', 'profile', 'tagline'] },
    { id: 'security', title: 'Admin Password & ID Credentials', query: ['password', 'admin', 'login', 'id', 'user', 'security', 'key', 'auth'] },
    { id: 'logistics', title: 'Courier & Shipping Hub Controls', query: ['shipping', 'courier', 'bluedart', 'delhivery', 'hub', 'days', 'dispatch', 'delivery', 'free shipping'] },
    { id: 'payments', title: 'Payment Gateways & UPI Controls', query: ['upi', 'cod', 'cash', 'payment', 'coupon', 'discount', 'dharm10', 'currency', 'inr'] },
    { id: 'alerts', title: 'Stock Alert Thresholds & System Controls', query: ['stock', 'threshold', 'alert', 'sync', 'maintenance', 'audio', 'sound', 'chime'] }
  ];
  const searchSettings = searchQ ? settingsKeywords.filter(s =>
    s.title.toLowerCase().includes(searchQ) || s.query.some(q => q.includes(searchQ) || searchQ.includes(q))
  ) : [];

  const totalSearchResults = (searchQ ? filteredProducts.length : 0) + searchOrders.length + searchDrops.length + searchChats.length + searchSettings.length;

  const activeDrops = products.filter(p => {
    const isPast = new Date(p.dropExpiresAt).getTime() < Date.now();
    return !isPast && (p.remainingUnits || 0) > 0;
  });
  const expiredDrops = products.filter(p => {
    const isPast = new Date(p.dropExpiresAt).getTime() < Date.now();
    return isPast || (p.remainingUnits || 0) <= 0;
  });

  const issuesList = [

    ...orders.filter(o => o.status !== 'Delivered').map(o => ({
      id: `order-${o.id}`,
      type: o.status === 'Confirmed' ? 'warning' : 'info',
      icon: ShoppingCart,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      title: `Order #${o.id} (${o.status})`,
      desc: `${o.customer?.name || 'Customer'} ordered ₹${(o.total || 0).toLocaleString('en-IN')}. Needs shipping/fulfillment update.`,
      tab: 'orders',
      tabName: 'Orders & Fulfillment'
    })),

    ...chats.filter(c => (c.unreadAdmin || 0) > 0).map(c => ({
      id: `chat-${c.id}`,
      type: 'alert',
      icon: MessageSquare,
      color: 'text-red-400 bg-red-400/10 border-red-400/20',
      title: `Live Request: ${c.customerName || 'Customer'}`,
      desc: c.messages?.[c.messages.length - 1]?.text || 'New message waiting on Support Team Desk.',
      tab: 'chats',
      tabName: 'Support Team Desk'
    })),

    ...products.filter(p => p.remainingUnits !== undefined && p.remainingUnits <= (settings.lowStockThreshold || 10)).map(p => ({
      id: `stock-${p.id}`,
      type: p.remainingUnits === 0 ? 'critical' : 'warning',
      icon: Package,
      color: p.remainingUnits === 0 ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      title: p.remainingUnits === 0 ? `Out of Stock: ${p.title}` : `Low Stock: ${p.title}`,
      desc: p.remainingUnits === 0
        ? '0 units left. Drop cannot accept orders until restocked.'
        : `Only ${p.remainingUnits} units remaining (below threshold of ${settings.lowStockThreshold || 10} units).`,
      tab: 'drops',
      tabName: 'Limited Drops & Expiry'
    })),

    ...products.filter(p => {
      if (!p.dropExpiresAt) return false;
      return new Date(p.dropExpiresAt).getTime() < Date.now();
    }).map(p => ({
      id: `expired-${p.id}`,
      type: 'info',
      icon: Flame,
      color: 'text-gray-400 bg-white/5 border-white/10',
      title: `Drop Expired: ${p.title}`,
      desc: 'Drop launch window has closed. Restock or edit expiry date.',
      tab: 'drops',
      tabName: 'Limited Drops & Expiry'
    }))
  ];

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#080b12] text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-[#d4af37] selection:text-black font-sans">

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-60 bg-[#151926] border border-[#d4af37] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-fadeIn flex items-center gap-2">
            <Sparkles size={14} className="text-[#d4af37]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#0d121f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fadeIn">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/[0.04] border border-white/10 mb-4 shadow-lg">
              <img
                src="/brand-logo.jpg"
                alt="Brand Logo"
                className="w-12 h-12 rounded-xl object-cover border border-[#d4af37]/30"
              />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20 uppercase mb-2">
              Superuser Access Control
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
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#d4af37] transition-colors"
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
                  className="w-full pl-10 pr-10 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#d4af37] transition-colors font-mono"
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
                  className="rounded border-white/20 bg-white/10 text-[#d4af37] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#d4af37] hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#d4af37]/25 flex items-center justify-center gap-2 mt-2 active:scale-[0.98] cursor-pointer"
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
              <Key size={14} className="text-[#d4af37]" />
              <span>1-Click Superuser Access</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-gray-400">
              <div className="flex items-center justify-center gap-1.5 text-gray-300 font-bold mb-1">
                <Key size={13} className="text-[#d4af37]" />
                <span>Default Credentials</span>
              </div>
              <p className="font-mono text-[10px] text-gray-400">
                ID: <strong className="text-white">admin</strong> &nbsp;|&nbsp; Password: <strong className="text-white">admin</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setAuthId(settings.adminId || 'admin');
                  setAuthPassword(settings.adminPassword || 'admin');
                }}
                className="mt-2 text-[10px] font-bold text-[#d4af37] hover:underline"
              >
                Auto-fill Credentials
              </button>
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
    <div className="min-h-screen flex bg-[#080b12] text-gray-200 selection:bg-[#d4af37] selection:text-black font-sans relative">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-[#151926] border border-[#d4af37] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-fadeIn flex items-center gap-2">
          <Sparkles size={14} className="text-[#d4af37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">

          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <aside className="relative w-72 max-w-[85vw] bg-[#0d121f] border-r border-white/10 flex flex-col justify-between p-5 z-10 shadow-2xl overflow-y-auto animate-fadeIn">
            <div className="space-y-6">

              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <img
                    src="/brand-logo.jpg"
                    alt="Brand Logo"
                    className="w-9 h-9 rounded-xl object-cover border border-white/20 shadow-md"
                  />
                  <div>
                    <h1 className="font-serif text-sm font-black tracking-widest text-white uppercase truncate">
                      {settings.storeName || 'APNA BRAND'}
                    </h1>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase px-2 block mb-2">
                    Main Menu
                  </span>
                  <nav className="space-y-1">
                    {[
                      { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
                      { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingCart },
                      { id: 'products', label: 'Product Catalog', icon: Package },
                      { id: 'drops', label: 'Limited Drops & Expiry', icon: Flame },
                      { id: 'chats', label: 'Support Team Desk', icon: MessageSquare },
                      { id: 'colors', label: 'T-Shirt Color Studio', icon: Palette }
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon size={16} />
                            <span>{tab.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase px-2 block mb-2">
                    Preferences
                  </span>
                  <nav className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === 'settings'
                          ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings size={16} />
                        <span>Store Settings</span>
                      </div>
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2 mt-6">
              <a
                href={STOREFRONT_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#d4af37] font-bold border border-white/[0.06] transition-colors"
              >
                <ExternalLink size={14} />
                <span>Open Live Store</span>
              </a>

              <button
                type="button"
                onClick={handleAdminLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all"
              >
                <LogOut size={14} />
                <span>Log Out Superuser</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden lg:flex w-64 xl:w-72 bg-[#0d121f] border-r border-white/[0.08] flex-col justify-between p-4 sm:p-5 flex-shrink-0 h-screen sticky top-0">
        <div className="space-y-6">

          <div className="flex items-center gap-3 pb-5 border-b border-white/[0.08]">
            <img
              src="/brand-logo.jpg"
              alt="Brand Logo"
              className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-md flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-sm font-black tracking-widest text-white uppercase truncate">
                {settings.storeName || 'APNA BRAND'}
              </h1>
            </div>
          </div>

          <div className="space-y-5">

            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase px-3 block mb-2">
                Main Menu
              </span>
              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
                  { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingCart },
                  { id: 'products', label: 'Product Catalog', icon: Package },
                  { id: 'drops', label: 'Limited Drops & Expiry', icon: Flame },
                  { id: 'chats', label: 'Support Team Desk', icon: MessageSquare },
                  { id: 'colors', label: 'T-Shirt Color Studio', icon: Palette }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase px-3 block mb-2">
                Preferences
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'settings'
                      ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings size={16} />
                    <span>Store Settings</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08] space-y-3">

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4af37] to-amber-200 text-black font-extrabold flex items-center justify-center text-xs shadow-md">
                  A
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">Admin Superuser</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
              title="Log Out Superuser"
            >
              <LogOut size={14} />
            </button>
          </div>

          <a
            href={STOREFRONT_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#d4af37] font-bold transition-colors border border-white/[0.06]"
          >
            <ExternalLink size={14} />
            <span>Open Live Store</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">

        <div className="flex lg:hidden items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/brand-logo.jpg"
                alt="Brand Logo"
                className="w-8 h-8 rounded-lg object-cover border border-white/20 shadow-sm"
              />
              <div>
                <span className="font-serif text-sm font-black tracking-widest text-white uppercase block leading-tight">
                  {settings.storeName || 'APNA BRAND'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              title="Sync Store Data"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-[#d4af37]' : ''} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono uppercase tracking-wider mb-1">
              <span className="text-[#d4af37]">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'orders' && 'Orders & Fulfillment'}
                {activeTab === 'products' && 'Product Catalog'}
                {activeTab === 'drops' && 'Limited Drops & Expiry'}
                {activeTab === 'chats' && 'Support Live Desk'}
                {activeTab === 'colors' && 'Color Theme Studio'}
                {activeTab === 'settings' && 'Store Settings & Preferences'}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2.5">
              <span>
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'orders' && 'Orders & Fulfillment'}
                {activeTab === 'products' && 'Sacred Apparel Catalog'}
                {activeTab === 'drops' && 'Limited Drops & Launch Expiry'}
                {activeTab === 'chats' && 'Support Team Live Desk'}
                {activeTab === 'colors' && 'Dynamic Color Studio'}
                {activeTab === 'settings' && 'Store Settings & System Preferences'}
              </span>
              {settings.maintenanceMode && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-sans font-bold">
                  Maintenance Active
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 relative flex-wrap sm:flex-nowrap">

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, products, drops, chats, settings..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-48 sm:w-64 lg:w-80 pl-8 pr-8 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-white placeholder-gray-500 outline-none focus:border-[#d4af37] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-white rounded-md"
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}

              {searchQuery.trim().length > 0 && isSearchFocused && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSearchFocused(false)}
                  />
                  <div className="absolute left-0 sm:right-0 sm:left-auto top-12 w-[340px] sm:w-[480px] max-w-[95vw] bg-[#0f1422] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn backdrop-blur-xl">

                    <div className="p-3.5 bg-[#141b2d] border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-[#d4af37]" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Global Search Results
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                          {totalSearchResults} {totalSearchResults === 1 ? 'match' : 'matches'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsSearchFocused(false)}
                          className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 scrollbar-thin p-1">
                      {totalSearchResults === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                          <Search size={28} className="mx-auto mb-2 text-gray-600" />
                          <p className="text-xs font-semibold text-white">No items found for "{searchQuery}"</p>
                          <p className="text-[11px] text-gray-500 mt-1">Try searching with Order ID (e.g. ORD), Seeker Name, Product, or Status.</p>
                        </div>
                      ) : (
                        <>

                          {searchOrders.length > 0 && (
                            <div className="p-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 px-2 block mb-1">
                                🛒 Customer Orders ({searchOrders.length})
                              </span>
                              <div className="space-y-1">
                                {searchOrders.slice(0, 5).map(o => (
                                  <div
                                    key={o.id}
                                    onClick={() => {
                                      setActiveTab('orders');
                                      setOrderStatusFilter('all');
                                      handleOpenTrackingModal(o);
                                      setIsSearchFocused(false);
                                    }}
                                    className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-[#d4af37] group-hover:underline">
                                          {o.id}
                                        </span>
                                        <span className="text-xs text-white font-medium truncate">
                                          {o.customer?.name || 'Customer'}
                                        </span>
                                      </div>
                                      <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                                        <span>₹{o.total?.toLocaleString('en-IN') || o.totalAmount || 0}</span>
                                        <span>•</span>
                                        <span className="truncate">{o.customer?.city || 'India'}</span>
                                      </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                      o.status === 'Delivered'
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : o.status === 'Pending'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}>
                                      {o.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {filteredProducts.length > 0 && (
                            <div className="p-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 px-2 block mb-1">
                                📦 Product Catalog ({filteredProducts.length})
                              </span>
                              <div className="space-y-1">
                                {filteredProducts.slice(0, 5).map(p => (
                                  <div
                                    key={p.id}
                                    onClick={() => {
                                      setActiveTab('products');
                                      setIsSearchFocused(false);
                                    }}
                                    className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-3 group transition-colors"
                                  >
                                    <img
                                      src={p.images?.[0] || '/brand-logo.jpg'}
                                      alt=""
                                      className="w-9 h-11 object-cover rounded-lg bg-black flex-shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <span className="font-sanskrit text-[10px] text-[#d4af37] block leading-tight">{p.sanskritTitle}</span>
                                      <span className="text-xs font-bold text-white block truncate group-hover:text-[#d4af37] transition-colors">{p.title}</span>
                                      <span className="text-[11px] text-gray-400 font-mono">₹{p.price?.toLocaleString('en-IN')} • {p.category}</span>
                                    </div>
                                    <ArrowUpRight size={14} className="text-gray-500 group-hover:text-[#d4af37] transition-colors" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {searchDrops.length > 0 && (
                            <div className="p-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 px-2 block mb-1">
                                🔥 Limited Drops ({searchDrops.length})
                              </span>
                              <div className="space-y-1">
                                {searchDrops.slice(0, 4).map(d => (
                                  <div
                                    key={`drop-${d.id}`}
                                    onClick={() => {
                                      setActiveTab('drops');
                                      setEditingDrop(d);
                                      setIsSearchFocused(false);
                                    }}
                                    className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span className="text-xs font-bold text-white block truncate group-hover:text-[#d4af37]">{d.title}</span>
                                      <span className="text-[11px] text-gray-400 font-mono">Stock Left: {d.remainingUnits || 0} units</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-[#d4af37] border border-[#d4af37]/30 px-2 py-0.5 rounded-lg bg-[#d4af37]/10">
                                      Edit Drop →
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {searchChats.length > 0 && (
                            <div className="p-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 px-2 block mb-1">
                                💬 Live Support Inquiries ({searchChats.length})
                              </span>
                              <div className="space-y-1">
                                {searchChats.slice(0, 4).map(c => (
                                  <div
                                    key={c.id}
                                    onClick={() => {
                                      setActiveTab('chats');
                                      handleSelectChat(c.id);
                                      setIsSearchFocused(false);
                                    }}
                                    className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span className="text-xs font-bold text-white block truncate group-hover:text-[#d4af37]">
                                        {c.customerName || 'Customer Inquiry'}
                                      </span>
                                      <span className="text-[11px] text-gray-400 block truncate">
                                        {c.messages?.[c.messages.length - 1]?.text || c.customerEmail || 'No message'}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400 group-hover:text-white">
                                      Open Desk →
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {searchSettings.length > 0 && (
                            <div className="p-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 px-2 block mb-1">
                                ⚙️ Store Settings ({searchSettings.length})
                              </span>
                              <div className="space-y-1">
                                {searchSettings.map(s => (
                                  <div
                                    key={`setting-${s.id}`}
                                    onClick={() => {
                                      setActiveTab('settings');
                                      setSettingsSection(s.id);
                                      setIsSearchFocused(false);
                                    }}
                                    className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                                  >
                                    <span className="text-xs font-bold text-white group-hover:text-[#d4af37]">
                                      {s.title}
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-400 group-hover:text-white">
                                      Configure →
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationOpen(prev => !prev)}
                className={`relative p-2.5 rounded-xl border transition-all ${
                  isNotificationOpen
                    ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/20'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
                }`}
                title="Store Issues & Notifications"
                aria-label="Store Issues and Alerts"
              >
                <Bell size={16} />
                {issuesList.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse border-2 border-[#090a0f]">
                    {issuesList.length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#12141d] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">

                    <div className="p-3.5 bg-[#171926] border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell size={14} className="text-[#d4af37]" />
                        <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                          Store Alerts & Issues
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                        {issuesList.length} {issuesList.length === 1 ? 'Alert' : 'Alerts'}
                      </span>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
                      {issuesList.length > 0 ? (
                        issuesList.map((issue) => {
                          const IssueIcon = issue.icon;
                          return (
                            <div
                              key={issue.id}
                              onClick={() => {
                                setActiveTab(issue.tab);
                                setIsNotificationOpen(false);
                                showToast(`Navigated to ${issue.tabName}`);
                              }}
                              className="p-3.5 hover:bg-white/5 cursor-pointer transition-colors flex items-start gap-3 group"
                            >
                              <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${issue.color}`}>
                                <IssueIcon size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <h5 className="text-xs font-bold text-white group-hover:text-[#d4af37] transition-colors truncate">
                                    {issue.title}
                                  </h5>
                                  <ArrowUpRight size={13} className="text-gray-500 group-hover:text-[#d4af37] flex-shrink-0 transition-colors" />
                                </div>
                                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                                  {issue.desc}
                                </p>
                                <span className="inline-block mt-1 text-[10px] text-[#d4af37] font-semibold group-hover:underline">
                                  Go to {issue.tabName} →
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center">
                          <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
                          <p className="text-xs font-bold text-white">All Systems Smooth</p>
                          <p className="text-[11px] text-gray-400 mt-1">No pending issues or stock alerts detected.</p>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 bg-[#0e1017] border-t border-white/10 flex items-center justify-around text-[10px] font-semibold text-gray-400">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('drops'); setIsNotificationOpen(false); }}
                        className="hover:text-[#d4af37] transition-colors py-1 px-2 rounded hover:bg-white/5"
                      >
                        Drops
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('orders'); setIsNotificationOpen(false); }}
                        className="hover:text-[#d4af37] transition-colors py-1 px-2 rounded hover:bg-white/5"
                      >
                        Orders
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('chats'); setIsNotificationOpen(false); }}
                        className="hover:text-[#d4af37] transition-colors py-1 px-2 rounded hover:bg-white/5"
                      >
                        Support
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('products'); setIsNotificationOpen(false); }}
                        className="hover:text-[#d4af37] transition-colors py-1 px-2 rounded hover:bg-white/5"
                      >
                        Catalog
                      </button>
                    </div>

                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className={`p-2.5 rounded-xl border transition-all ${
                isRefreshing
                  ? 'bg-white/10 text-[#d4af37] border-[#d4af37]/40 shadow-md shadow-[#d4af37]/15 cursor-wait'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10 active:scale-95'
              }`}
              title="Refresh All Store Data & Live Chats"
              aria-label="Refresh All Store Data"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-[#d4af37]' : ''} />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#d4af37]/30"
            >
              <Plus size={16} /> New Timed Drop / T-Shirt
            </button>
          </div>
        </div>

        {activeTab === 'drops' && (
          <div className="space-y-8 animate-fadeIn">

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#12141c] border border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Live Active Drops</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">{activeDrops.length} Drops</span>
                <span className="text-[10px] text-gray-500 block mt-1">Accepting orders</span>
              </div>
              <div className="p-4 rounded-xl bg-[#12141c] border border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Default Drop Window</span>
                <span className="text-2xl font-black text-white font-mono">4–5 Days</span>
                <span className="text-[10px] text-yellow-500 block mt-1">Auto-expires into Vault</span>
              </div>
              <div className="p-4 rounded-xl bg-[#12141c] border border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Vaulted / Expired</span>
                <span className="text-2xl font-black text-red-400 font-mono">{expiredDrops.length} Items</span>
                <span className="text-[10px] text-gray-500 block mt-1">Archived in sacred vault</span>
              </div>
              <div className="p-4 rounded-xl bg-[#12141c] border border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Brand Integrity</span>
                <span className="text-2xl font-black text-[#d4af37] font-mono">100% Limited</span>
                <span className="text-[10px] text-gray-400 block mt-1">280–340 GSM Terry</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Flame size={16} className="text-red-400" />
                  Drop Expiration & Limited Stock Controls
                </h3>
                <span className="text-xs text-gray-400">
                  Click "+3 Days" or "+5 Days" to extend any drop, or "+25 Units" to restock!
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="bg-white/5 text-gray-400 text-[11px] uppercase font-bold">
                    <tr>
                      <th className="p-3.5">Drop Piece</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Drop Expiry Date</th>
                      <th className="p-3.5">Time Remaining</th>
                      <th className="p-3.5">Limited Stock Left</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.filter(p => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase().trim();
                      return (
                        (p.title && p.title.toLowerCase().includes(q)) ||
                        (p.sanskritTitle && p.sanskritTitle.toLowerCase().includes(q)) ||
                        (p.category && p.category.toLowerCase().includes(q))
                      );
                    }).map((p) => {
                      const isExpired = new Date(p.dropExpiresAt).getTime() < Date.now();
                      const daysLeft = Math.ceil((new Date(p.dropExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                      return (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img src={p.images[0]} alt="" className="w-10 h-12 object-cover rounded-lg bg-black" />
                              <div>
                                <span className="font-sanskrit text-xs text-[#d4af37] block">{p.sanskritTitle}</span>
                                <span className="font-bold text-white text-xs uppercase block">{p.title}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-gray-300">{p.category}</td>
                          <td className="p-3.5 font-mono text-gray-300">
                            {new Date(p.dropExpiresAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </td>
                          <td className="p-3.5 font-mono font-bold">
                            {isExpired ? (
                              <span className="text-red-400 flex items-center gap-1">
                                <Lock size={12} /> Expired
                              </span>
                            ) : (
                              <span className="text-emerald-400">
                                {daysLeft} Days left
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono">
                            <span className="text-white font-bold">{p.remainingUnits}</span> / {p.totalUnits || 50} units
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              isExpired
                                ? 'bg-red-950 text-red-400 border border-red-800'
                                : daysLeft <= 2
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            }`}>
                              {isExpired ? 'Vault Closed' : (daysLeft <= 2 ? 'Ending Soon' : 'Live Drop')}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">

                              <button
                                onClick={() => handleExtendDropDays(p.id, 5)}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase transition-colors"
                                title="Add 5 more days to drop expiry"
                              >
                                +5 Days
                              </button>

                              <button
                                onClick={() => handleRestockUnits(p.id, 25)}
                                className="px-2.5 py-1 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#d4af37] hover:text-black text-[10px] font-bold uppercase transition-colors"
                                title="Add 25 units to stock"
                              >
                                +25 Stock
                              </button>

                              {!isExpired && (
                                <button
                                  onClick={() => handleVaultDrop(p.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white text-[10px] font-bold uppercase transition-colors"
                                  title="Immediately close and vault drop"
                                >
                                  Close
                                </button>
                              )}
                            </div>
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

        {activeTab === 'dashboard' && (() => {
          const deliveredOrders = orders.filter(o => o.status === 'Delivered');
          const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Pending');
          const pendingOrders = orders.filter(o => o.status === 'Pending');
          const totalStockUnits = products.reduce((acc, p) => acc + (p.remainingUnits || 0), 0);

          const weeklyDays = [
            { day: 'Mon', revenue: Math.round(stats.totalSales * 0.11), percent: 45 },
            { day: 'Tue', revenue: Math.round(stats.totalSales * 0.15), percent: 62 },
            { day: 'Wed', revenue: Math.round(stats.totalSales * 0.09), percent: 38 },
            { day: 'Thu', revenue: Math.round(stats.totalSales * 0.18), percent: 74 },
            { day: 'Fri', revenue: Math.round(stats.totalSales * 0.24), percent: 96, peak: true },
            { day: 'Sat', revenue: Math.round(stats.totalSales * 0.13), percent: 55 },
            { day: 'Sun', revenue: Math.round(stats.totalSales * 0.10), percent: 42 }
          ];

          return (
            <div className="space-y-6 animate-fadeIn">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                <div className="p-5 rounded-2xl bg-[#0d121f] border border-white/[0.08] hover:border-white/15 transition-all shadow-xl group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Total Gross Sales
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <TrendingUp size={11} /> +18.4%
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    ₹{stats.totalSales.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/[0.06] pt-2.5">
                    <span>Storefront Revenue</span>
                    <span className="text-emerald-400 font-medium">Healthy Growth</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d121f] border border-white/[0.08] hover:border-white/15 transition-all shadow-xl group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Total Store Orders
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                      <ShoppingCart size={11} /> +12.6%
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {stats.totalOrders}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/[0.06] pt-2.5">
                    <span>{deliveredOrders.length} Delivered</span>
                    <span className="text-blue-400 font-medium">{orders.length - deliveredOrders.length} In Progress</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d121f] border border-white/[0.08] hover:border-white/15 transition-all shadow-xl group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Catalog Designs
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 flex items-center gap-1">
                      <Flame size={11} /> {activeDrops.length} Live
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {products.length} <span className="text-base font-normal text-gray-400">Pieces</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/[0.06] pt-2.5">
                    <span>Remaining Stock</span>
                    <span className="text-[#d4af37] font-mono font-bold">{totalStockUnits} units</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d121f] border border-white/[0.08] hover:border-white/15 transition-all shadow-xl group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Avg Order Value
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Luxury Terry
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    ₹{stats.avgOrderValue.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/[0.06] pt-2.5">
                    <span>Fabric Weight</span>
                    <span className="text-purple-300 font-medium">280–340 GSM</span>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-xl flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <BarChart3 size={16} className="text-[#d4af37]" />
                        Weekly Sales & Launch Performance
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Daily gross order volume across timed drops and direct store orders.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-300">
                        Peak: <strong className="text-[#d4af37]">Friday Drop</strong>
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 pb-2">
                    <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 px-2 border-b border-white/[0.08]">
                      {weeklyDays.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center h-full justify-end group">

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-2 py-1 rounded-lg bg-black text-[#d4af37] font-mono text-[10px] font-bold border border-white/20 whitespace-nowrap shadow-lg pointer-events-none">
                            ₹{item.revenue.toLocaleString('en-IN')}
                          </div>

                          <div
                            className={`w-full max-w-[42px] rounded-t-xl transition-all duration-700 ${
                              item.peak
                                ? 'bg-gradient-to-t from-[#d4af37] to-amber-200 shadow-lg shadow-[#d4af37]/30'
                                : 'bg-gradient-to-t from-white/10 to-white/30 group-hover:to-[#d4af37]'
                            }`}
                            style={{ height: `${item.percent}%` }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-3 text-center">
                      {weeklyDays.map((item, idx) => (
                        <span
                          key={idx}
                          className={`text-xs font-mono font-bold uppercase ${
                            item.peak ? 'text-[#d4af37]' : 'text-gray-400'
                          }`}
                        >
                          {item.day}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/[0.08] pt-3 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
                      <span>Timed Drop Spike</span>
                    </div>
                    <span className="font-mono text-white font-bold">
                      7-Day Revenue Velocity: Stable
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-1">
                      <Truck size={16} className="text-emerald-400" />
                      Fulfillment Distribution
                    </h3>
                    <p className="text-xs text-gray-400 mb-5">
                      Live status breakdown of all placed customer orders.
                    </p>

                    <div className="space-y-4">

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                          <span className="text-gray-300 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Delivered ({deliveredOrders.length})
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {orders.length > 0 ? Math.round((deliveredOrders.length / orders.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                            style={{ width: `${orders.length > 0 ? (deliveredOrders.length / orders.length) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                          <span className="text-gray-300 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            In Transit ({activeOrders.length})
                          </span>
                          <span className="text-blue-400 font-bold">
                            {orders.length > 0 ? Math.round((activeOrders.length / orders.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-700"
                            style={{ width: `${orders.length > 0 ? (activeOrders.length / orders.length) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                          <span className="text-gray-300 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            Pending ({pendingOrders.length})
                          </span>
                          <span className="text-amber-400 font-bold">
                            {orders.length > 0 ? Math.round((pendingOrders.length / orders.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-700"
                            style={{ width: `${orders.length > 0 ? (pendingOrders.length / orders.length) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Default Courier:</span>
                      <strong className="text-white font-mono">{settings.defaultCourier || 'Bluedart Express'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Delivery Estimate:</span>
                      <strong className="text-[#d4af37] font-mono">{settings.estimatedDeliveryDays || '3 to 5 Days'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Free Shipping:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {settings.alwaysFreeShipping ? 'Always Free' : 'Orders > ₹1999'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                      Recent Orders Stream
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Real-time customer transactions synced with live inventory.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#d4af37] hover:underline flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.04] text-gray-400 text-[11px] uppercase font-bold">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Items</th>
                        <th className="p-3.5">Total Amount</th>
                        <th className="p-3.5">Payment</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] font-mono">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-white/[0.04] transition-colors">
                          <td className="p-3.5 font-bold text-[#d4af37]">
                            {o.id || o.orderId}
                          </td>
                          <td className="p-3.5 font-sans">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-white/10 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {o.customer?.name ? o.customer.name.charAt(0) : 'S'}
                              </div>
                              <span className="font-medium text-white">{o.customer?.name}</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-gray-300 font-sans">
                            {o.items?.length || 1} {o.items?.length === 1 ? 'Piece' : 'Pieces'}
                          </td>
                          <td className="p-3.5 font-bold text-white">
                            ₹{o.total?.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5 text-gray-400">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] border border-white/10 text-gray-300">
                              {o.paymentMethod || 'UPI'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-block ${
                              o.status === 'Delivered'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                : o.status === 'Pending'
                                ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                                : 'bg-blue-950/80 text-blue-400 border border-blue-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-sans">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setViewTrackingOrder(o);
                                  setIsTrackingDetailsOpen(false);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-200 hover:text-white font-bold text-[11px] border border-white/10 transition-all flex items-center gap-1"
                                title="View Live Tracking Card"
                              >
                                <Eye size={12} />
                                <span>Track</span>
                              </button>
                              <button
                                onClick={() => handleOpenTrackingModal(o)}
                                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black font-bold text-[11px] border border-white/20 transition-all shadow"
                              >
                                Update
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          );
        })()}

        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#12141c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="rounded-2xl bg-[#12141c] border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-white/5 text-gray-400 text-[11px] uppercase font-bold">
                  <tr>
                    <th className="p-3.5">Piece</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">T-Shirt Color</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Fabric GSM</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-white/5">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} className="w-10 h-12 object-cover rounded-lg bg-black" />
                          <div>
                            <span className="font-sanskrit text-xs text-[#d4af37] block">{p.sanskritTitle}</span>
                            <span className="font-bold text-white text-xs uppercase block">{p.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-300">{p.category}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/30"
                            style={{ backgroundColor: p.primaryColor?.hex || '#111' }}
                          />
                          <span className="font-mono text-xs">{p.primaryColor?.name || 'Black'}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold font-mono text-white">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-gray-400">{p.gsm}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete piece"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141c] border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                    Live Order Fulfillment & Logistics
                  </h3>
                  <p className="text-xs text-gray-400">
                    Track all customer orders, update live transit locations, and confirm pending orders.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">Total Orders:</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-mono font-bold text-xs">
                  {orders.length}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Orders', count: orders.length },
                { id: 'pending', label: 'Pending Confirmation', count: orders.filter(o => o.status === 'Pending').length },
                { id: 'active', label: 'In Transit / Active', count: orders.filter(o => o.status !== 'Delivered').length },
                { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length }
              ].map(f => {
                const isActive = orderStatusFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setOrderStatusFilter(f.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isActive
                        ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-black text-white' : 'bg-white/10 text-gray-300'
                    }`}>
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-[#12141c] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[850px]">
                  <thead className="bg-white/5 text-gray-400 text-[11px] uppercase font-bold">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Seeker Info</th>
                      <th className="p-3.5">Items Ordered</th>
                      <th className="p-3.5">Total (₹)</th>
                      <th className="p-3.5">Current Location / Hub</th>
                      <th className="p-3.5">Courier & AWB</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {orders.filter(o => {
                      if (orderStatusFilter === 'pending' && o.status !== 'Pending') return false;
                      if (orderStatusFilter === 'active' && o.status === 'Delivered') return false;
                      if (orderStatusFilter === 'delivered' && o.status !== 'Delivered') return false;

                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase().trim();
                        const matchesId = String(o.id || '').toLowerCase().includes(q);
                        const matchesName = o.customer?.name?.toLowerCase().includes(q);
                        const matchesEmail = o.customer?.email?.toLowerCase().includes(q);
                        const matchesPhone = o.customer?.phone?.toLowerCase().includes(q);
                        const matchesCity = o.customer?.city?.toLowerCase().includes(q);
                        const matchesStatus = o.status?.toLowerCase().includes(q);
                        const matchesLoc = o.currentLocation?.toLowerCase().includes(q);
                        const matchesCourier = o.courier?.name?.toLowerCase().includes(q);
                        const matchesAwb = o.courier?.trackingNumber?.toLowerCase().includes(q);
                        const matchesItems = o.items && o.items.some(item => item.title?.toLowerCase().includes(q));
                        return matchesId || matchesName || matchesEmail || matchesPhone || matchesCity || matchesStatus || matchesLoc || matchesCourier || matchesAwb || matchesItems;
                      }

                      return true;
                    }).map(o => {
                      const isDelivered = o.status === 'Delivered';
                      const statusColor = isDelivered
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500 font-bold'
                        : 'bg-white/10 text-white border border-white/20 font-bold';

                      return (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5">
                            <span className="font-bold text-white block">{o.id}</span>
                            <span className="text-[10px] text-gray-500 font-sans block mt-0.5">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}
                            </span>
                          </td>
                          <td className="p-3.5 font-sans">
                            <strong className="text-white block">{o.customer?.name}</strong>
                            <span className="text-gray-400 text-[11px] block">{o.customer?.phone}</span>
                            <span className="text-gray-500 text-[10px] block line-clamp-1 max-w-[180px]">{o.customer?.address}</span>
                          </td>
                          <td className="p-3.5 font-sans">
                            {o.items && o.items.map((item, idx) => (
                              <div key={idx} className="text-[11px] text-gray-300 line-clamp-1">
                                • {item.title} ({item.size} / {item.color}) × {item.quantity}
                              </div>
                            ))}
                          </td>
                          <td className="p-3.5 font-bold text-white">₹{o.total?.toLocaleString('en-IN')}</td>
                          <td className="p-3.5 font-sans">
                            <div className="flex items-start gap-1.5 min-w-[160px]">
                              <MapPin size={13} className="text-gray-300 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold text-white block text-xs">
                                  {o.currentLocation || 'Central Warehouse'}
                                </span>
                                {o.transitNote && (
                                  <span className="text-gray-400 text-[10px] block line-clamp-1 mt-0.5">
                                    {o.transitNote}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 font-sans">
                            <span className="font-medium text-gray-200 block text-xs">
                              {o.courier?.name || 'Bluedart Express'}
                            </span>
                            <span className="font-mono text-gray-400 text-[10px] block mt-0.5">
                              {o.courier?.trackingNumber || 'BD-8472910'}
                            </span>
                          </td>
                          <td className="p-3.5 font-sans">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase inline-block whitespace-nowrap ${statusColor}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-sans">
                            <div className="flex items-center justify-end gap-2">
                              {o.status === 'Pending' && (
                                <button
                                  onClick={() => handleQuickConfirm(o.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition-all whitespace-nowrap"
                                  title="Confirm this pending order"
                                >
                                  <Check size={12} />
                                  <span>Confirm Order</span>
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setViewTrackingOrder(o);
                                  setIsTrackingDetailsOpen(false);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-200 hover:text-white font-bold text-[11px] border border-white/10 transition-all shadow whitespace-nowrap"
                                title="View Customer Live Order Tracking Card"
                              >
                                <Eye size={13} />
                                <span>Track Order</span>
                              </button>
                              <button
                                onClick={() => handleOpenTrackingModal(o)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-bold text-[11px] border border-white/20 transition-all shadow whitespace-nowrap"
                              >
                                <Truck size={13} />
                                <span>Update Location</span>
                              </button>
                            </div>
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

        {activeTab === 'chats' && (() => {
          const selectedChat = chats.find(c => c.id === selectedChatId) || chats[0];
          const filteredChats = chats.filter(c => {
            const activeSearch = searchQuery.trim() || chatSearch.trim();
            if (!activeSearch) return true;
            const q = activeSearch.toLowerCase();
            return (
              (c.customerName && c.customerName.toLowerCase().includes(q)) ||
              (c.customerEmail && c.customerEmail.toLowerCase().includes(q)) ||
              (c.messages && c.messages.some(m => m.text?.toLowerCase().includes(q)))
            );
          });

          return (
            <div className="bg-[#121318] border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[calc(100vh-210px)] flex flex-col md:flex-row animate-fadeIn">

              <div className="w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-[#0e1017]">

                <div className="p-4 border-b border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <MessageSquare size={15} className="text-[#d4af37]" />
                      <span>Live Inquiries ({chats.length})</span>
                    </h3>
                  </div>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search customer or email..."
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-none">
                  {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => {
                      const isSelected = selectedChat && chat.id === selectedChat.id;
                      const lastMsg = chat.messages?.[chat.messages.length - 1];
                      return (
                        <div
                          key={chat.id}
                          onClick={() => handleSelectChat(chat.id)}
                          className={`p-3.5 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-white/10 border-l-4 border-l-[#d4af37]'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#d4af37] text-black font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow">
                                {chat.customerName?.charAt(0) || 'R'}
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-white block truncate">
                                  {chat.customerName || 'Rahul Sharma'}
                                </span>
                              </div>
                            </div>
                            {chat.unreadAdmin > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold animate-pulse">
                                {chat.unreadAdmin} New
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 truncate pl-10">
                            {lastMsg?.text || 'No messages yet'}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-gray-500 text-xs">
                      No matching chats found.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-[#121318]">
                {selectedChat ? (
                  <>

                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#151720]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#d4af37] text-black font-extrabold flex items-center justify-center text-sm shadow">
                          {selectedChat.customerName?.charAt(0) || 'R'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{selectedChat.customerName || 'Rahul Sharma'}</h4>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active"></span>
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1.5">
                              <FaEnvelope size={11} className="text-gray-400" />
                              {selectedChat.customerEmail || 'customer@gmail.com'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                              <FaPhoneAlt size={10} className="text-gray-400" />
                              {selectedChat.customerPhone || '+91 98765 43210'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteChat(selectedChat.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs transition-colors"
                      >
                        End Chat
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                      {selectedChat.messages?.map((msg, i) => {
                        const isAdmin = msg.sender === 'admin';
                        const isBot = msg.sender === 'kaal' || msg.sender === 'support';
                        return (
                          <div
                            key={i}
                            className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] text-gray-400 mb-1 px-1 flex items-center gap-1">
                              {isAdmin ? (
                                <>
                                  <FaUserShield size={11} className="text-[#d4af37]" />
                                  <span>Support Team (Admin)</span>
                                </>
                              ) : isBot ? (
                                <>
                                  <FaHeadset size={11} className="text-[#d4af37]" />
                                  <span>Support Team</span>
                                </>
                              ) : (
                                <span>{selectedChat.customerName || 'Rahul Sharma'}</span>
                              )}
                            </span>
                            <div
                              className={`p-3 rounded-2xl max-w-[75%] text-xs leading-relaxed shadow-lg ${
                                isAdmin
                                  ? 'bg-[#d4af37] text-black font-medium rounded-br-sm'
                                  : isBot
                                  ? 'bg-white/5 border border-white/10 text-gray-300 rounded-bl-sm'
                                  : 'bg-[#1e2029] border border-white/15 text-white rounded-bl-sm'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[9px] text-gray-500 mt-1 px-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="px-4 py-2 border-t border-white/5 bg-[#0f1015] flex items-center gap-2 overflow-x-auto scrollbar-none">
                      <span className="text-[10px] uppercase font-bold text-gray-500 whitespace-nowrap">Quick Responses:</span>
                      {[
                        { label: 'Express Dispatch', Icon: FaBox, text: 'Namaste! We dispatch all orders within 24-48 hours via Bluedart Express with live tracking.' },
                        { label: 'Sizing Advice', Icon: FaTshirt, text: 'Our drop-shoulder T-shirts are an authentic boxy oversized cut. Order your normal size for relaxed drape.' },
                        { label: 'DHARM10 Coupon', Icon: FaTicketAlt, text: 'You can use secret coupon code DHARM10 at checkout to get an extra 10% discount on your order!' },
                        { label: '7-Day Exchange', Icon: FaSyncAlt, text: 'Yes, we provide a 7-day hassle-free exchange on all sizes if tags remain intact.' }
                      ].map((canned, idx) => {
                        const CannedIcon = canned.Icon;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setReplyText(canned.text)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-gray-300 whitespace-nowrap transition-colors flex items-center gap-1.5"
                          >
                            <CannedIcon size={11} className="text-[#d4af37]" />
                            <span>{canned.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-[#151720] border-t border-white/10">
                      <form onSubmit={handleSendAdminReply} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Type reply to customer... (Press Enter to send)"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-[#d4af37]"
                        />
                        <button
                          type="submit"
                          disabled={!replyText.trim() || isSendingReply}
                          className="px-5 py-3 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <span>Send</span>
                          <FaPaperPlane size={11} />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                    <MessageSquare size={48} className="text-gray-700 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">Select a conversation to start live chatting</p>
                    <p className="text-xs text-gray-600 mt-1">Customers browsing the storefront will appear here in real-time.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {activeTab === 'colors' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                <Palette size={18} className="text-[#d4af37]" />
                Dynamic T-Shirt Color Theme Previewer
              </h3>
              <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                When a user visits a T-shirt page or selects a color swatch, the frontend instantly adapts its background gradient,
                ambient aura, and borders to the T-shirt color palette.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { name: 'Baby Pink', hex: '#f4c2c2', gradient: 'radial-gradient(ellipse at 50% 15%, #3d1b26 0%, #1f0b13 60%, #0e0407 100%)' },
                  { name: 'Lavender', hex: '#c8b6e2', gradient: 'radial-gradient(ellipse at 50% 15%, #311c47 0%, #180b26 60%, #0a0312 100%)' },
                  { name: 'Maroon', hex: '#6b1724', gradient: 'radial-gradient(ellipse at 50% 15%, #460c18 0%, #24040a 60%, #100104 100%)' },
                  { name: 'Navy Blue', hex: '#1e293b', gradient: 'radial-gradient(ellipse at 50% 15%, #0f2742 0%, #081526 60%, #030812 100%)' },
                  { name: 'Off White', hex: '#e8e4dc', gradient: 'radial-gradient(ellipse at 50% 15%, #2d2b26 0%, #171512 60%, #0c0b09 100%)' },
                  { name: 'Black', hex: '#111113', gradient: 'radial-gradient(ellipse at 50% 15%, #222228 0%, #0d0d10 60%, #060607 100%)' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setPreviewColorName(item.name);
                      setPreviewHex(item.hex);
                      setPreviewGradient(item.gradient);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      previewColorName === item.name
                        ? 'border-[#d4af37] bg-white/15 text-white scale-105 shadow-lg'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: item.hex }} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>

              <div
                className="mt-8 rounded-2xl p-8 border transition-all duration-700 min-h-[260px] flex flex-col justify-between relative overflow-hidden"
                style={{
                  background: previewGradient,
                  borderColor: `${previewHex}66`
                }}
              >
                <div className="relative z-10">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white">
                    Simulated Storefront Atmosphere: {previewColorName} ({previewHex})
                  </span>
                  <h4 className="font-serif text-3xl font-black uppercase text-white mt-4">
                    {previewColorName} T-Shirt View Page
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: STORE SETTINGS & SYSTEM PREFERENCES (Nexino Modern UI/UX) */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-5xl">

            {/* Top Sub-Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-lg">
              {[
                { id: 'general', label: 'Store Profile & Branding', icon: Store },
                { id: 'security', label: 'Admin Security & Password', icon: ShieldCheck },
                { id: 'logistics', label: 'Logistics & Dispatch', icon: Truck },
                { id: 'payments', label: 'Payments & Gateways', icon: CreditCard },
                { id: 'alerts', label: 'Stock Alerts & System', icon: BellRing }
              ].map(sub => {
                const SubIcon = sub.icon;
                const isSelected = settingsSection === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSettingsSection(sub.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <SubIcon size={14} />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">

              {/* SECTION 1: GENERAL STORE PROFILE */}
              {settingsSection === 'general' && (
                <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-xl space-y-5 animate-fadeIn">
                  <div className="border-b border-white/[0.08] pb-4">
                    <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Store size={18} className="text-[#d4af37]" />
                      Brand Identity & Store Profile
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Configure how your store appears across navigation headers, receipts, and order tracking.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Store Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.storeName}
                        onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37] font-semibold"
                        placeholder="e.g. APNA BRAND"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Brand Tagline / Philosophy *
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.tagline}
                        onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37]"
                        placeholder="e.g. Sacred Modern Luxury Apparel"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Customer Support Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={settings.supportEmail}
                        onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37] font-mono"
                        placeholder="e.g. support@apnabrand.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Customer Helpline / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={settings.supportPhone}
                        onChange={(e) => setSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37] font-mono"
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Store Headquarters & Origin City *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.hqCity}
                      onChange={(e) => setSettings(prev => ({ ...prev, hqCity: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37]"
                      placeholder="e.g. New Delhi, India"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: ADMIN MASTER SECURITY & PASSWORD */}
              {settingsSection === 'security' && (
                <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-xl space-y-5 animate-fadeIn">
                  <div className="border-b border-white/[0.08] pb-4">
                    <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#d4af37]" />
                      Admin Authentication & Master Security
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Configure the Login ID and Password required to access this Admin Console. Keep these private so only you (the store owner) can access.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Admin Login ID / Username *
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={settings.adminId || 'admin'}
                          onChange={(e) => setSettings(prev => ({ ...prev, adminId: e.target.value }))}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37] font-semibold"
                          placeholder="e.g. admin or owner"
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        Used to log in to the admin dashboard (Default: admin).
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Master Password *
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={settings.adminPassword || 'admin'}
                          onChange={(e) => setSettings(prev => ({ ...prev, adminPassword: e.target.value }))}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37] font-mono font-bold"
                          placeholder="Enter secure password"
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        Secret password to unlock all master management controls (Default: admin).
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300/90 flex items-start gap-3">
                    <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-200">Owner Protection Notice</strong>
                      <span>
                        Save your changes below. If you ever forget your custom password, the fallback credential <code>admin / admin</code> will allow safe recovery on localhost.
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#d4af37]/20 active:scale-95"
                    >
                      <Save size={15} /> Save Credentials
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 2: LOGISTICS & FULFILLMENT */}
              {settingsSection === 'logistics' && (
                <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-xl space-y-5 animate-fadeIn">
                  <div className="border-b border-white/[0.08] pb-4">
                    <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Truck size={18} className="text-[#d4af37]" />
                      Fulfillment & Courier Logistics Controls
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Set default courier partner and dispatch hubs that automatically populate tracking modals.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Default Courier Partner *
                      </label>
                      <select
                        value={settings.defaultCourier}
                        onChange={(e) => setSettings(prev => ({ ...prev, defaultCourier: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-[#161d2e] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37] font-semibold"
                      >
                        <option value="Bluedart Express">Bluedart Express (Priority Direct)</option>
                        <option value="Delhivery Express">Delhivery Express</option>
                        <option value="DTDC Express">DTDC Express</option>
                        <option value="Shadowfax">Shadowfax</option>
                        <option value="India Post Speed Post">India Post Speed Post</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Standard Delivery Window *
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.estimatedDeliveryDays}
                        onChange={(e) => setSettings(prev => ({ ...prev, estimatedDeliveryDays: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37]"
                        placeholder="e.g. 3 to 5 Business Days"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Default Central Fulfillment Facility / Origin Hub *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.dispatchHub}
                      onChange={(e) => setSettings(prev => ({ ...prev, dispatchHub: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37]"
                      placeholder="e.g. Apna Brand Central Fulfillment Hub, New Delhi"
                    />
                  </div>

                  {/* Free Shipping Toggle */}
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Always Free Shipping Policy</span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        Provide complimentary express courier delivery on all orders without minimum threshold.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, alwaysFreeShipping: !prev.alwaysFreeShipping }))}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                        settings.alwaysFreeShipping ? 'bg-emerald-500' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.alwaysFreeShipping ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 3: PAYMENTS & GATEWAYS */}
              {settingsSection === 'payments' && (
                <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-xl space-y-5 animate-fadeIn">
                  <div className="border-b border-white/[0.08] pb-4">
                    <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <CreditCard size={18} className="text-[#d4af37]" />
                      Payment Gateways & Currency Controls
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Manage checkout payment modes (UPI, Cash on Delivery) and promotional coupon codes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Default Currency Display *
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-[#161d2e] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37] font-semibold"
                      >
                        <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                        <option value="USD ($)">USD ($) - US Dollar</option>
                        <option value="EUR (€)">EUR (€) - Euro</option>
                        <option value="GBP (£)">GBP (£) - British Pound</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Secret Promotional Coupon Code
                      </label>
                      <input
                        type="text"
                        value={settings.couponCode}
                        onChange={(e) => setSettings(prev => ({ ...prev, couponCode: e.target.value.toUpperCase() }))}
                        className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-[#d4af37] font-mono font-bold outline-none focus:border-[#d4af37]"
                        placeholder="e.g. DHARM10"
                      />
                    </div>
                  </div>

                  {/* Payment Switches */}
                  <div className="space-y-3 pt-2">
                    {/* UPI */}
                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">UPI Instant Payment (PhonePe, GPay, Paytm)</span>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          Allow customers to scan UPI QR or select PhonePe, Google Pay, or Paytm directly.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, enableUpi: !prev.enableUpi }))}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                          settings.enableUpi ? 'bg-emerald-500' : 'bg-gray-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          settings.enableUpi ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* COD */}
                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Cash on Delivery (COD)</span>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          Enable doorstep payment collection upon order delivery.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, enableCod: !prev.enableCod }))}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                          settings.enableCod ? 'bg-emerald-500' : 'bg-gray-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          settings.enableCod ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: STOCK ALERTS & MAINTENANCE */}
              {settingsSection === 'alerts' && (
                <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-xl space-y-5 animate-fadeIn">
                  <div className="border-b border-white/[0.08] pb-4">
                    <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <BellRing size={18} className="text-[#d4af37]" />
                      Stock Thresholds & System Controls
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Control inventory warning alerts in the Notification Center and toggle maintenance mode.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Low Stock Alert Threshold (Units) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        required
                        value={settings.lowStockThreshold}
                        onChange={(e) => setSettings(prev => ({ ...prev, lowStockThreshold: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37] font-mono font-bold"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        Triggers red/amber badge in Notification Bell when piece drops below this number.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Real-time Sync Interval *
                      </label>
                      <select
                        value={settings.refreshInterval}
                        onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2.5 bg-[#161d2e] border border-white/[0.08] rounded-xl text-xs text-white outline-none focus:border-[#d4af37] font-semibold"
                      >
                        <option value={5}>5 Seconds (Ultra Real-Time)</option>
                        <option value={10}>10 Seconds (Recommended)</option>
                        <option value={30}>30 Seconds (Low Network)</option>
                      </select>
                    </div>
                  </div>

                  {/* Sound Notification Switch */}
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Live Support Audio Chime</span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        Play subtle chime notification when a seeker sends a message on Support Desk.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, chatSoundAlert: !prev.chatSoundAlert }))}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                        settings.chatSoundAlert ? 'bg-emerald-500' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.chatSoundAlert ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Maintenance Mode Switch */}
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <ShieldAlert size={14} /> Storefront Maintenance Mode
                      </span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        Temporarily locks new drop checkouts with a sleek maintenance announcement banner.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                        settings.maintenanceMode ? 'bg-amber-500' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons: Save & Reset */}
              <div className="p-4 rounded-2xl bg-[#0d121f] border border-white/[0.08] shadow-xl flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] hover:bg-white/5 text-gray-400 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>Restore Factory Defaults</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-yellow-400 text-black font-extrabold uppercase tracking-wider text-xs flex items-center gap-2 shadow-lg shadow-[#d4af37]/30 transition-all active:scale-95"
                >
                  <Save size={15} />
                  <span>Save All Settings</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* Add Timed Drop Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141c] border border-white/15 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl animate-fadeIn relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-lg font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Flame size={18} className="text-red-400" />
              Launch New Limited Drop
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Configure launch duration (expires in 4-5 days) and limited stock quantity.
            </p>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-400 uppercase font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MOKSHA — OVERSIZED T-SHIRT"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1">Sanskrit / Hindi Name</label>
                  <input
                    type="text"
                    placeholder="e.g. मोक्ष"
                    value={newSanskrit}
                    onChange={(e) => setNewSanskrit(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-white/15 rounded-xl text-white outline-none"
                  >
                    <option value="Oversized T-Shirts">Oversized T-Shirts</option>
                    <option value="Sweatshirts">Sweatshirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Shirts">Shirts</option>
                  </select>
                </div>
              </div>

              {/* TIMED LAUNCH EXPIRY & STOCK CONTROLS */}
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40 space-y-3">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={13} /> Timed Drop & Expiry Configuration
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">Drop Expiry (Days) *</label>
                    <select
                      value={dropDays}
                      onChange={(e) => setDropDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#1a1c24] border border-white/15 rounded-xl text-white outline-none font-bold"
                    >
                      <option value={3}>Expires in 3 Days</option>
                      <option value={4}>Expires in 4 Days</option>
                      <option value={5}>Expires in 5 Days (Recommended)</option>
                      <option value={7}>Expires in 7 Days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">Total Limited Units *</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={500}
                      value={newTotalUnits}
                      onChange={(e) => setNewTotalUnits(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1a1c24] border border-white/15 rounded-xl text-white outline-none font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1">T-Shirt Color *</label>
                  <select
                    value={newColorName}
                    onChange={(e) => {
                      setNewColorName(e.target.value);
                      if (e.target.value === 'Baby Pink') setNewColorHex('#f4c2c2');
                      else if (e.target.value === 'Lavender') setNewColorHex('#c8b6e2');
                      else if (e.target.value === 'Maroon') setNewColorHex('#6b1724');
                      else if (e.target.value === 'Navy Blue') setNewColorHex('#1e293b');
                      else if (e.target.value === 'Off White') setNewColorHex('#e8e4dc');
                      else setNewColorHex('#111113');
                    }}
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-white/15 rounded-xl text-white outline-none"
                  >
                    <option value="Black">Black</option>
                    <option value="Off White">Off White</option>
                    <option value="Baby Pink">Baby Pink</option>
                    <option value="Lavender">Lavender</option>
                    <option value="Maroon">Maroon</option>
                    <option value="Navy Blue">Navy Blue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 uppercase font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none text-[11px]"
                />
              </div>

              <div>
                <label className="block text-gray-400 uppercase font-bold mb-1">Philosophy Lore</label>
                <input
                  type="text"
                  placeholder="e.g. Non-dual truth woven into heavyweight silhouette."
                  value={newPhilosophy}
                  onChange={(e) => setNewPhilosophy(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none italic"
                />
              </div>

              <div className="pt-3 border-t border-white/10">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#d4af37] text-black font-extrabold uppercase tracking-widest hover:bg-yellow-400 transition-colors"
                >
                  PUBLISH TIMED SACRED DROP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE ORDER TRACKING CARD MODAL (Exact same options & view as Website) */}
      {viewTrackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#f4f5f7] border border-gray-300 rounded-[28px] max-w-xl w-full p-6 sm:p-8 text-[#121212] shadow-2xl animate-fadeIn relative max-h-[92vh] overflow-y-auto space-y-7">

            {/* Top Close Button */}
            <button
              onClick={() => setViewTrackingOrder(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-gray-700 hover:text-black transition-colors"
              title="Close Tracker"
            >
              <X size={18} />
            </button>

            {/* 1. TOP HEADER ROW */}
            <div className="flex items-center justify-between gap-3 pb-2 pr-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/70 flex items-center justify-center text-gray-600 flex-shrink-0 shadow-sm">
                  <Package size={20} className="stroke-[1.75]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans text-base sm:text-lg font-bold text-gray-900 tracking-tight whitespace-nowrap">
                    Order {viewTrackingOrder.orderId || viewTrackingOrder.id}
                  </h3>
                  <span className="text-[11px] text-gray-500 font-normal block">
                    Customer: {viewTrackingOrder.customer?.name} ({viewTrackingOrder.customer?.phone})
                  </span>
                </div>
              </div>

              {/* Order ID Copy Button */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(viewTrackingOrder.orderId || viewTrackingOrder.id);
                  setCopiedTrackingId(true);
                  setTimeout(() => setCopiedTrackingId(false), 2000);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 hover:text-black transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm border border-gray-200"
              >
                {copiedTrackingId ? (
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
            </div>

            {/* 2. ORDER TRACKING SECTION (7 STAGES) */}
            <div className="space-y-4 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-800 text-sm">
                    {viewTrackingOrder.status === 'Delivered' ? 'Product Delivered' : viewTrackingOrder.status === 'In Transit' ? 'Product in Transit' : `Product ${viewTrackingOrder.status}`}
                  </span>
                  {viewTrackingOrder.currentLocation && (
                    <span className="text-[11px] text-gray-500 font-normal">
                      • {viewTrackingOrder.currentLocation.split(',')[0]}
                    </span>
                  )}
                </div>
                <span className="font-medium text-gray-400">
                  {viewTrackingOrder.status === 'Delivered' ? 'Delivered' : 'EST: 3 days'}
                </span>
              </div>

              {/* Horizontal 7-Stage Timeline */}
              <div className="relative pt-3 pb-2 px-1 overflow-x-auto scrollbar-none">
                <div className="min-w-[500px] sm:min-w-0 relative">
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
                    let currentIndex = stageOrder.indexOf(viewTrackingOrder.status);
                    if (currentIndex === -1) {
                      currentIndex = viewTrackingOrder.status === 'Cancelled' ? -1 : 1;
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
                              <div key={stage.id} className="flex flex-col items-center flex-1 min-w-[55px] sm:min-w-0">
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

                                <span className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 block font-sans truncate max-w-[65px]">
                                  {isReached
                                    ? (isCurrent && viewTrackingOrder.currentLocation
                                        ? viewTrackingOrder.currentLocation.split(',')[0].slice(0, 10)
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

              {/* 4 Metadata Columns matching website */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-gray-100 text-left">
                <div>
                  <span className="text-xs text-gray-400 block font-normal">Order Date</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 mt-1 block">
                    {new Date(viewTrackingOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block font-normal">Delivery Date</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 mt-1 block">
                    {viewTrackingOrder.courier?.expectedDelivery
                      ? new Date(viewTrackingOrder.courier.expectedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block font-normal">Courier</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-5 h-3.5 rounded bg-amber-400 text-[8px] font-black text-black flex items-center justify-center font-mono">
                      {viewTrackingOrder.courier?.name ? viewTrackingOrder.courier.name.slice(0, 2).toUpperCase() : 'BD'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {viewTrackingOrder.courier?.name || 'Bluedart Express'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block font-normal">Address</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 mt-1 block truncate" title={viewTrackingOrder.customer?.address}>
                    {viewTrackingOrder.customer?.address ? viewTrackingOrder.customer.address.slice(0, 16) + '...' : 'Destination Address'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. ORDER SUMMARY */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-2.5">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Order Summary</h4>
              <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                <span>Sub total</span>
                <span className="text-gray-900 font-semibold font-mono">₹{viewTrackingOrder.total?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                <span>Discount</span>
                <span className="text-gray-900 font-semibold font-mono">₹0</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold font-mono">FREE</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                <span className="text-xs sm:text-sm font-bold text-gray-800">Total Amount</span>
                <span className="text-base sm:text-lg font-black text-gray-900 font-mono">₹{viewTrackingOrder.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* 4. ORDER INFO (Items) */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Ordered Items ({viewTrackingOrder.items?.length || 1})</h4>
              <div className="divide-y divide-gray-100">
                {viewTrackingOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image || 'https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Agni_ubg.png?v=1791201501'}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-900 uppercase block truncate">{item.title}</span>
                        <span className="text-[11px] text-gray-400 block mt-0.5">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm">
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsTrackingDetailsOpen(prev => !prev)}
                className="w-full mt-2 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-gray-100"
              >
                <span>{isTrackingDetailsOpen ? 'Hide full details' : 'View full dispatch details'}</span>
                <ChevronRight size={14} className={`transition-transform duration-300 ${isTrackingDetailsOpen ? '-rotate-90' : 'rotate-90'}`} />
              </button>

              {isTrackingDetailsOpen && (
                <div className="mt-3 p-4 rounded-xl bg-gray-50/80 border border-gray-200 text-left space-y-3 animate-fadeIn text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Customer</span>
                      <strong className="text-gray-900 block">{viewTrackingOrder.customer?.name}</strong>
                      <span className="text-gray-600 block">{viewTrackingOrder.customer?.phone}</span>
                      <span className="text-gray-500 block truncate">{viewTrackingOrder.customer?.email}</span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Destination</span>
                      <p className="text-gray-800 leading-relaxed">{viewTrackingOrder.customer?.address || 'No address'}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#135d54]/5 rounded-lg border border-[#135d54]/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#135d54] uppercase text-[10px] flex items-center gap-1">
                        <Truck size={12} /> Dispatch Logistics
                      </span>
                      <span className="font-mono text-gray-700 font-bold">AWB: {viewTrackingOrder.courier?.trackingNumber || 'BD-8472910'}</span>
                    </div>
                    <div className="text-gray-800">
                      <strong>Current Hub: </strong>{viewTrackingOrder.currentLocation || 'Central Warehouse'}
                    </div>
                    {viewTrackingOrder.transitNote && (
                      <p className="text-gray-600 text-[11px] leading-relaxed">
                        <strong>Note: </strong>{viewTrackingOrder.transitNote}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewTrackingOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewTrackingOrder;
                  setViewTrackingOrder(null);
                  handleOpenTrackingModal(target);
                }}
                className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow"
              >
                <Truck size={14} />
                <span>Update Tracking & Location</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141c] border border-white/15 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl animate-fadeIn relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setTrackingModalOrder(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold uppercase tracking-wider text-white">
                  Order Transit & Location Update
                </h3>
                <span className="text-xs text-[#d4af37] font-mono font-bold">
                  {trackingModalOrder.id} • {trackingModalOrder.customer?.name} ({trackingModalOrder.customer?.phone})
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 mb-5">
              Enter where this order has currently reached and next transit notes. The customer will see this live on their "Track Your Order" screen.
            </p>

            <form onSubmit={handleSaveTracking} className="space-y-4 text-xs">

              <div>
                <label className="block text-gray-300 uppercase font-bold text-[11px] mb-2">
                  Item Status & Stage (English) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Pending', label: '1. Pending', desc: 'Awaiting confirmation' },
                    { id: 'Confirmed', label: '2. Confirmed', desc: 'Verified & approved' },
                    { id: 'Processing', label: '3. Processing', desc: 'Packed & QC verified' },
                    { id: 'Dispatched', label: '4. Dispatched', desc: 'Sent out via courier' },
                    { id: 'In Transit', label: '5. In Transit', desc: 'On the way to city' },
                    { id: 'Out for Delivery', label: '6. Out for Delivery', desc: 'With delivery agent' },
                    { id: 'Delivered', label: '7. Delivered', desc: 'Safely delivered' }
                  ].map(stage => {
                    const isSelected = trackingStatus === stage.id;
                    const isDeliveredStage = stage.id === 'Delivered';

                    let selectedClass = 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10';
                    if (isSelected) {
                      selectedClass = isDeliveredStage
                        ? 'bg-emerald-950 text-emerald-400 font-bold border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-white/15 text-white font-bold border-white shadow-lg shadow-white/10';
                    }

                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => {
                          setTrackingStatus(stage.id);
                          if (stage.id === 'Pending') {
                            setTrackingTransitNote('Order placed by customer, pending admin confirmation.');
                          } else if (stage.id === 'Confirmed') {
                            setTrackingTransitNote('Order verified and confirmed by store team.');
                          } else if (stage.id === 'Processing') {
                            setTrackingTransitNote('Quality check passed. Garment packed in custom packaging.');
                          } else if (stage.id === 'Dispatched') {
                            setTrackingLocation('Central Warehouse, New Delhi');
                            setTrackingTransitNote('Dispatched from warehouse via Bluedart express courier.');
                          } else if (stage.id === 'In Transit') {
                            setTrackingLocation('Regional Transit Logistics Hub');
                            setTrackingTransitNote('Package in transit on the way to destination regional hub.');
                          } else if (stage.id === 'Out for Delivery') {
                            setTrackingLocation('Destination City Delivery Station');
                            setTrackingTransitNote('Out for delivery with courier delivery executive.');
                          } else if (stage.id === 'Delivered') {
                            setTrackingLocation('Customer Delivery Address');
                            setTrackingTransitNote('Package safely delivered to recipient.');
                          }
                        }}
                        className={`p-2 rounded-xl border text-left transition-all ${selectedClass}`}
                      >
                        <span className="block text-xs font-bold leading-tight">{stage.label}</span>
                        <span className="block text-[10px] mt-0.5 leading-tight opacity-80">
                          {stage.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-300 uppercase font-bold text-[11px] flex items-center gap-1.5">
                    <MapPin size={13} className="text-white" />
                    <span>Current Item Location / Hub (English) *</span>
                  </label>
                  <span className="text-[10px] text-gray-400">Live on customer tracker</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Warehouse / Regional Transit Logistics Hub / Destination City Station"
                  value={trackingLocation}
                  onChange={(e) => setTrackingLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-white text-xs font-medium"
                />

                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500 whitespace-nowrap">Quick fill:</span>
                  {[
                    'Central Fulfillment Facility, New Delhi',
                    'Airport Logistics Cargo Terminal',
                    'Regional Transit Hub',
                    'Destination City Sorting Hub',
                    'Local Delivery Center (Out with agent)',
                    'Delivered to Customer Doorstep'
                  ].map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTrackingLocation(loc)}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-gray-300 whitespace-nowrap transition-colors"
                    >
                      {loc.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 uppercase font-bold text-[11px] mb-1.5">
                  Live Transit Update & Next Step (English)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dispatched from warehouse via express courier, in transit to destination city."
                  value={trackingTransitNote}
                  onChange={(e) => setTrackingTransitNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-white text-xs resize-none"
                />

                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500 whitespace-nowrap">Quick notes:</span>
                  {[
                    'Dispatched from warehouse via express courier.',
                    'Package in transit on the way to destination city.',
                    'Arrived at regional delivery station.',
                    'Out for delivery with courier delivery executive.',
                    'Package delivered safely to customer.'
                  ].map((note, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTrackingTransitNote(note)}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-gray-300 whitespace-nowrap transition-colors"
                    >
                      {note.slice(0, 24)}...
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 uppercase font-bold text-[11px] mb-1.5">
                    Courier Partner
                  </label>
                  <select
                    value={trackingCourier}
                    onChange={(e) => setTrackingCourier(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-white/15 rounded-xl text-white outline-none text-xs"
                  >
                    <option value="Bluedart Express">Bluedart Express (Priority)</option>
                    <option value="Delhivery Express">Delhivery Express</option>
                    <option value="DTDC Express">DTDC Express</option>
                    <option value="Shadowfax">Shadowfax</option>
                    <option value="India Post Speed Post">India Post Speed Post</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 uppercase font-bold text-[11px] mb-1.5">
                    Courier AWB / Tracking No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BD-9826287"
                    value={trackingAwb}
                    onChange={(e) => setTrackingAwb(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 uppercase font-bold text-[11px] mb-1.5">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={trackingDeliveryDate}
                    onChange={(e) => setTrackingDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Customer Destination Address</span>
                  <span className="text-xs text-gray-300 block truncate">{trackingModalOrder.customer?.address || 'No address provided'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTracking}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-gray-200 text-black font-extrabold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSavingTracking ? (
                    <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Save & Broadcast Updates</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
