import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  Package,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  ShieldCheck,
  MapPin,
  Edit2,
  Plus,
  Phone,
  Sun,
  Moon
} from 'lucide-react';
import { API_BASE } from '../config';
import { useThemeColor } from '../context/ThemeColorContext';

export default function AccountPopover({ isOpen, onClose, onOpenOrders }) {
  const { themeMode = 'dark', setThemeMode = () => {} } = useThemeColor();
  const isLight = themeMode === 'light';

  const [mode, setMode] = useState('login');

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('brahmman_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('brahmman_user');
        if (saved) {
          const user = JSON.parse(saved);
          setCurrentUser(user);

          const id = user.username || user.email;
          if (id) {
            fetch(`${API_BASE}/api/auth/user/${encodeURIComponent(id)}`)
              .then(res => res.json())
              .then(data => {
                if (data.success && data.user) {
                  setCurrentUser(data.user);
                  localStorage.setItem('brahmman_user', JSON.stringify(data.user));
                }
              })
              .catch(() => {});
          }
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentUser?.deliveryAddress) {
      const addr = currentUser.deliveryAddress;
      setStreet(addr.street || '');
      setCity(addr.city || '');
      setStateName(addr.state || '');
      setPincode(addr.pincode || '');
      setDeliveryPhone(addr.phone || currentUser.phone || '');
      setLandmark(addr.landmark || '');
    } else if (currentUser) {
      setDeliveryPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const resetFormState = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Please fill in both identifier and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed.');
      }

      setCurrentUser(data.user);
      localStorage.setItem('brahmman_user', JSON.stringify(data.user));
      setSuccessMessage(`Welcome back, ${data.user.name || data.user.username}!`);
      setLoginPassword('');

      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupUsername.trim()) {
      setErrorMessage('Please choose a username.');
      return;
    }
    if (signupUsername.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim() || signupUsername.trim(),
          username: signupUsername.trim().toLowerCase(),
          email: signupEmail.trim().toLowerCase(),
          password: signupPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      setCurrentUser(data.user);
      localStorage.setItem('brahmman_user', JSON.stringify(data.user));
      setSuccessMessage('Account created and connected to MongoDB!');
      setSignupPassword('');

      setTimeout(() => {
        setSuccessMessage('');
      }, 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDeliveryAddress = async (e) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !pincode.trim()) {
      setErrorMessage('Please fill in street address, city and pincode.');
      return;
    }

    setIsSavingAddress(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: currentUser.username || currentUser.email,
          street: street.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
          phone: deliveryPhone.trim(),
          landmark: landmark.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save address');
      }

      setCurrentUser(data.user);
      localStorage.setItem('brahmman_user', JSON.stringify(data.user));
      setIsEditingAddress(false);
      setSuccessMessage('Delivery location saved to MongoDB!');
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Could not update delivery address.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('brahmman_user');
    setSuccessMessage('Logged out successfully.');
    setLoginIdentifier('');
    setLoginPassword('');
    setIsEditingAddress(false);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const hasDeliveryAddress = currentUser?.deliveryAddress && (currentUser.deliveryAddress.street || currentUser.deliveryAddress.city);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:absolute sm:inset-auto sm:right-0 sm:top-12 sm:block animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-[390px] sm:w-[390px] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border p-5 sm:p-6 relative mx-auto max-h-[85vh] overflow-y-auto scrollbar-thin select-none transition-colors duration-300 ${
          isLight
            ? 'bg-white border-gray-200 text-gray-900 shadow-xl'
            : 'bg-[#163643] border-[#224b5c] text-white shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Modal Header */}
        <div className={`relative flex items-center justify-center pb-3.5 mb-3 border-b ${
          isLight ? 'border-gray-200' : 'border-[#224b5c]'
        }`}>
          <h3 className={`font-bold text-[15px] tracking-tight text-center uppercase font-sans ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>
            {currentUser ? 'My Profile' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-1.5 rounded-full text-gray-400 hover:text-[#f0aa93] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Theme Preference Switcher Option (Dark / Light) */}
        <div className={`p-2.5 rounded-2xl border mb-3.5 flex items-center justify-between ${
          isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#122731] border-[#224b5c]'
        }`}>
          <div className="flex items-center gap-2">
            {isLight ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} className="text-[#f0aa93]" />}
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Theme Mode:
            </span>
          </div>

          <div className={`flex items-center p-1 rounded-xl border ${
            isLight ? 'bg-white border-gray-200' : 'bg-[#163643] border-[#224b5c]'
          }`}>
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                !isLight
                  ? 'bg-[#f0aa93] text-[#122731] shadow-sm font-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <Moon size={11} />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#122731] text-white shadow-sm font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sun size={11} />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Error / Success Toast alerts */}
        {errorMessage && (
          <div className="mb-3.5 p-3 rounded-2xl bg-red-950/40 text-red-200 text-xs flex items-center gap-2 border border-red-800/40 animate-fadeIn">
            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-3.5 p-3 rounded-2xl bg-emerald-950/40 text-emerald-200 text-xs flex items-center gap-2 border border-emerald-800/40 animate-fadeIn">
            <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
            <span className="leading-tight">{successMessage}</span>
          </div>
        )}

        {currentUser ? (
          /* ─────────────────────────────────────────────────────────────
              LOGGED IN USER PROFILE
             ───────────────────────────────────────────────────────────── */
          <div className="space-y-4">

            {/* Profile Avatar & Verified Badge */}
            <div className={`p-4 rounded-2xl border text-center shadow-md ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#122731] border-[#224b5c]'
            }`}>
              <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center font-black text-xl shadow-xl uppercase tracking-wider mb-2 border-2 ${
                isLight
                  ? 'bg-white text-[#122731] border-[#122731]'
                  : 'bg-[#163643] text-[#f0aa93] border-[#f0aa93]'
              }`}>
                {currentUser.name ? currentUser.name.charAt(0) : currentUser.username ? currentUser.username.charAt(0) : 'U'}
              </div>
              <h4 className={`text-base font-bold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {currentUser.name || currentUser.username}
              </h4>
              <div className="inline-flex items-center gap-1 px-3 py-0.5 mt-1.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>Verified Member</span>
              </div>
            </div>

            {/* Account Details Box */}
            <div className={`p-3.5 rounded-2xl border shadow-sm space-y-2.5 ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#122731] border-[#224b5c]'
            }`}>
              <div className={`flex items-center justify-between pb-2 border-b ${
                isLight ? 'border-gray-200' : 'border-[#224b5c]'
              }`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isLight ? 'text-gray-600' : 'text-[#f0aa93]'
                }`}>
                  Account Details
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <User size={13} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} />
                  <span>Username</span>
                </div>
                <span className={`font-bold font-mono text-right truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  @{currentUser.username}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Mail size={13} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} />
                  <span>Email ID</span>
                </div>
                <span className={`font-bold font-mono text-right truncate max-w-[200px] ${isLight ? 'text-gray-900' : 'text-white'}`} title={currentUser.email}>
                  {currentUser.email}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Phone size={13} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} />
                  <span>Phone</span>
                </div>
                <span className={`font-bold font-mono text-right ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  {currentUser.phone || currentUser.deliveryAddress?.phone || 'Not added'}
                </span>
              </div>
            </div>

            {/* Delivery Location Section */}
            <div className={`p-3.5 rounded-2xl border shadow-sm space-y-2.5 ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#122731] border-[#224b5c]'
            }`}>
              <div className={`flex items-center justify-between pb-2 border-b ${
                isLight ? 'border-gray-200' : 'border-[#224b5c]'
              }`}>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  <MapPin size={14} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} />
                  <span>Delivery Location</span>
                </span>
                {hasDeliveryAddress && !isEditingAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="text-[11px] text-[#f0aa93] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={11} />
                    <span>Edit Location</span>
                  </button>
                )}
              </div>

              {hasDeliveryAddress && !isEditingAddress && (
                <div className={`text-xs space-y-1.5 p-3 rounded-xl border ${
                  isLight ? 'bg-white border-gray-200 text-gray-700' : 'bg-[#163643] border-[#224b5c] text-gray-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${isLight ? 'text-gray-900' : 'text-white'}`}>Primary Shipping Address</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/30">Saved</span>
                  </div>
                  <p className={`font-semibold text-left pt-0.5 leading-snug ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    {currentUser.deliveryAddress.street}
                  </p>
                  {currentUser.deliveryAddress.landmark && (
                    <p className="text-gray-400 text-[11px] text-left">
                      Landmark: {currentUser.deliveryAddress.landmark}
                    </p>
                  )}
                  <p className="text-left text-gray-400">
                    {currentUser.deliveryAddress.city}, {currentUser.deliveryAddress.state} - <strong className={`font-mono ${isLight ? 'text-gray-900' : 'text-white'}`}>{currentUser.deliveryAddress.pincode}</strong>
                  </p>
                  {currentUser.deliveryAddress.phone && (
                    <p className={`text-[11px] flex items-center gap-1 pt-1.5 border-t ${
                      isLight ? 'border-gray-200 text-gray-500' : 'border-[#224b5c] text-gray-400'
                    }`}>
                      <Phone size={11} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} /> {currentUser.deliveryAddress.phone}
                    </p>
                  )}
                </div>
              )}

              {!hasDeliveryAddress && !isEditingAddress && (
                <div className="text-center py-2.5">
                  <p className="text-xs text-gray-400 mb-2">No delivery location saved yet.</p>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className={`w-full py-2.5 px-3 border border-dashed rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isLight
                        ? 'border-gray-300 hover:border-black bg-white hover:bg-gray-100 text-gray-900'
                        : 'border-[#224b5c] hover:border-[#f0aa93] bg-[#163643] hover:bg-[#1e4555] text-white'
                    }`}
                  >
                    <Plus size={13} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} />
                    <span>Add Delivery Location</span>
                  </button>
                </div>
              )}

              {isEditingAddress && (
                <form onSubmit={handleSaveDeliveryAddress} className="space-y-2.5 pt-1 animate-fadeIn">
                  <div>
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Street Address *</label>
                    <input
                      type="text"
                      placeholder="House / Flat No, Street or Area"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${
                        isLight
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-[#122731]'
                          : 'bg-[#163643] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Temple or Market"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${
                        isLight
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-[#122731]'
                          : 'bg-[#163643] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">City *</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${
                          isLight
                            ? 'bg-white border-gray-200 text-gray-900 focus:border-[#122731]'
                            : 'bg-[#163643] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${
                          isLight
                            ? 'bg-white border-gray-200 text-gray-900 focus:border-[#122731]'
                            : 'bg-[#163643] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Pincode *</label>
                      <input
                        type="text"
                        placeholder="6-digit PIN"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        required
                        maxLength={6}
                        className={`w-full rounded-xl px-3 py-2 text-xs outline-none font-mono border ${
                          isLight
                            ? 'bg-white border-gray-200 text-gray-900 focus:border-[#122731]'
                            : 'bg-[#163643] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 Phone"
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2 text-xs outline-none font-mono border ${
                          isLight
                            ? 'bg-white border-gray-200 text-gray-900 focus:border-[#122731]'
                            : 'bg-[#163643] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1.5">
                    <button
                      type="submit"
                      disabled={isSavingAddress}
                      className="flex-1 py-2.5 bg-[#f0aa93] hover:bg-white hover:text-black text-[#122731] rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {isSavingAddress ? 'Saving...' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="px-3.5 py-2.5 border border-[#224b5c] hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-400 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Actions: Track Orders & Logout */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
                className="flex-1 py-3 px-3 bg-[#f0aa93] hover:bg-white hover:text-black text-[#122731] rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Package size={15} />
                <span>Track Orders</span>
              </button>
              <button
                onClick={handleLogout}
                className="py-3 px-4 border border-red-500/40 bg-red-950/30 hover:bg-red-900/50 text-red-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
              SIGN IN / SIGN UP FORM
             ───────────────────────────────────────────────────────────── */
          <div className="space-y-4">

            {/* Mode Switch Tabs */}
            <div className={`flex items-center border p-1 rounded-2xl text-xs font-bold mb-2 ${
              isLight ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-[#122731] border-[#224b5c] text-gray-400'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetFormState();
                }}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                  mode === 'login'
                    ? (isLight ? 'bg-[#122731] text-white shadow-md' : 'bg-[#f0aa93] text-[#122731] shadow-md')
                    : (isLight ? 'hover:text-black' : 'hover:text-white')
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  resetFormState();
                }}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                  mode === 'signup'
                    ? (isLight ? 'bg-[#122731] text-white shadow-md' : 'bg-[#f0aa93] text-[#122731] shadow-md')
                    : (isLight ? 'hover:text-black' : 'hover:text-white')
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* 1. SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    Username or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. kavi_rawat or kavi@gmail.com"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                      className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none border transition-colors ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#122731]'
                          : 'bg-[#122731] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                      }`}
                    />
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className={`w-full rounded-xl pl-9 pr-10 py-2.5 text-xs outline-none border transition-colors ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#122731]'
                          : 'bg-[#122731] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                      }`}
                    />
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f0aa93] transition-colors cursor-pointer"
                      tabIndex="-1"
                    >
                      {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-1 cursor-pointer active:scale-95 ${
                    isLight
                      ? 'bg-[#122731] hover:bg-black text-white'
                      : 'bg-[#f0aa93] hover:bg-white text-[#122731]'
                  }`}
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <span className="text-[11px] text-gray-400">
                    Don't have an account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      resetFormState();
                    }}
                    className={`text-[11px] font-bold hover:underline cursor-pointer ${
                      isLight ? 'text-[#122731]' : 'text-[#f0aa93]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}

            {/* 2. SIGN UP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-3">
                <div>
                  <label className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Kavi Rawat"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none border transition-colors ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#122731]'
                          : 'bg-[#122731] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                      }`}
                    />
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    Username <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. kavi_rawat"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      required
                      className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none border transition-colors ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#122731]'
                          : 'bg-[#122731] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                      }`}
                    />
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs ${
                      isLight ? 'text-[#122731]' : 'text-[#f0aa93]'
                    }`}>@</span>
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="e.g. kavi@gmail.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none border transition-colors ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#122731]'
                          : 'bg-[#122731] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                      }`}
                    />
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                    isLight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="Min 4 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className={`w-full rounded-xl pl-9 pr-10 py-2.5 text-xs outline-none border transition-colors ${
                        isLight
                          ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#122731]'
                          : 'bg-[#122731] border-[#224b5c] text-white placeholder-gray-500 focus:border-[#f0aa93]'
                      }`}
                    />
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f0aa93] transition-colors cursor-pointer"
                      tabIndex="-1"
                    >
                      {showSignupPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-1 cursor-pointer active:scale-95 ${
                    isLight
                      ? 'bg-[#122731] hover:bg-black text-white'
                      : 'bg-[#f0aa93] hover:bg-white text-[#122731]'
                  }`}
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <Sparkles size={14} />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <span className="text-[11px] text-gray-400">
                    Already have an account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      resetFormState();
                    }}
                    className={`text-[11px] font-bold hover:underline cursor-pointer ${
                      isLight ? 'text-[#122731]' : 'text-[#f0aa93]'
                    }`}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Quick Guest / Orders helper */}
            <div className={`pt-2.5 border-t flex items-center justify-between text-[11px] ${
              isLight ? 'border-gray-200 text-gray-500' : 'border-[#224b5c] text-gray-400'
            }`}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
                className={`flex items-center gap-1.5 transition-colors font-medium cursor-pointer ${
                  isLight ? 'hover:text-black' : 'hover:text-[#f0aa93]'
                }`}
              >
                <Package size={14} className={isLight ? 'text-[#122731]' : 'text-[#f0aa93]'} />
                <span>Track Orders with Order ID</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
