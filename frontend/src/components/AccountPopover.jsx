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
  Phone
} from 'lucide-react';
import { API_BASE } from '../config';

export default function AccountPopover({ isOpen, onClose, onOpenOrders }) {
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

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your username or email.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
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
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      setCurrentUser(data.user);
      localStorage.setItem('brahmman_user', JSON.stringify(data.user));
      setSuccessMessage(data.message || 'Logged in successfully!');
      setLoginPassword('');

      setTimeout(() => {
        setSuccessMessage('');
      }, 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to server. Please try again.');
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:absolute sm:inset-auto sm:right-0 sm:top-12 sm:block animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[380px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 text-[#121212] relative mx-auto max-h-[85vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="relative flex items-center justify-center pb-3 mb-3 border-b border-gray-100">
          <h3 className="font-bold text-[15px] text-[#121212] tracking-tight text-center">
            {currentUser ? 'My Profile' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200 animate-fadeIn">
            <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200 animate-fadeIn">
            <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
            <span className="leading-tight">{successMessage}</span>
          </div>
        )}

        {currentUser ? (

          <div className="space-y-3.5">

            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200/80 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shadow-md uppercase tracking-wider mb-2">
                {currentUser.name ? currentUser.name.charAt(0) : currentUser.username ? currentUser.username.charAt(0) : 'U'}
              </div>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight">
                {currentUser.name || currentUser.username}
              </h4>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-semibold">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Verified Member</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Account Details
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <User size={13} className="text-gray-400 flex-shrink-0" />
                  <span>Username</span>
                </div>
                <span className="font-bold text-gray-900 font-mono text-right truncate">
                  @{currentUser.username}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <Mail size={13} className="text-gray-400 flex-shrink-0" />
                  <span>Email ID</span>
                </div>
                <span className="font-bold text-gray-900 font-mono text-right truncate max-w-[200px]" title={currentUser.email}>
                  {currentUser.email}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <Phone size={13} className="text-gray-400 flex-shrink-0" />
                  <span>Phone</span>
                </div>
                <span className="font-bold text-gray-900 font-mono text-right">
                  {currentUser.phone || currentUser.deliveryAddress?.phone || 'Not added'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#d4af37]" />
                  <span>Delivery Location</span>
                </span>
                {hasDeliveryAddress && !isEditingAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="text-[11px] text-[#5a31f4] hover:underline font-bold flex items-center gap-1"
                  >
                    <Edit2 size={11} />
                    <span>Edit Location</span>
                  </button>
                )}
              </div>

              {hasDeliveryAddress && !isEditingAddress && (
                <div className="text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs">Primary Shipping Address</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">Saved</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-left pt-0.5 leading-snug">
                    {currentUser.deliveryAddress.street}
                  </p>
                  {currentUser.deliveryAddress.landmark && (
                    <p className="text-gray-500 text-[11px] text-left">
                      Landmark: {currentUser.deliveryAddress.landmark}
                    </p>
                  )}
                  <p className="text-left text-gray-700">
                    {currentUser.deliveryAddress.city}, {currentUser.deliveryAddress.state} - <strong className="font-mono text-gray-900">{currentUser.deliveryAddress.pincode}</strong>
                  </p>
                  {currentUser.deliveryAddress.phone && (
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 pt-1 border-t border-gray-200/60">
                      <Phone size={11} /> {currentUser.deliveryAddress.phone}
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
                    className="w-full py-2 px-3 border border-dashed border-gray-300 hover:border-black rounded-xl text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-colors bg-gray-50 hover:bg-gray-100"
                  >
                    <Plus size={13} />
                    <span>Add Delivery Location</span>
                  </button>
                </div>
              )}

              {isEditingAddress && (
                <form onSubmit={handleSaveDeliveryAddress} className="space-y-2 pt-1 animate-fadeIn">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Street Address *</label>
                    <input
                      type="text"
                      placeholder="House / Flat No, Street or Area"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#121212] outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Temple or Market"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#121212] outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">City *</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#121212] outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#121212] outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Pincode *</label>
                      <input
                        type="text"
                        placeholder="6-digit PIN"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        required
                        maxLength={6}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#121212] outline-none focus:border-black font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 Phone"
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#121212] outline-none focus:border-black font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSavingAddress}
                      className="flex-1 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {isSavingAddress ? 'Saving to MongoDB...' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="px-3 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
                className="flex-1 py-2.5 px-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Package size={15} />
                <span>Track Orders</span>
              </button>
              <button
                onClick={handleLogout}
                className="py-2.5 px-3.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title="Log out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (

          <div className="space-y-3.5">

            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-500 mb-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetFormState();
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white text-black shadow-sm'
                    : 'hover:text-black'
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
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-black shadow-sm'
                    : 'hover:text-black'
                }`}
              >
                Sign Up
              </button>
            </div>

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Username or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. kavi_rawat or kavi@gmail.com"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-[#121212] placeholder-gray-400 outline-none focus:border-black transition-colors"
                    />
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2 text-xs text-[#121212] placeholder-gray-400 outline-none focus:border-black transition-colors"
                    />
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                      tabIndex="-1"
                    >
                      {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
                    className="text-[11px] font-bold text-black hover:underline"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}

            {/* 2. SIGN UP FORM (Full Name, Username, Email, Password -> MongoDB) */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Kavi Rawat"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-[#121212] placeholder-gray-400 outline-none focus:border-black transition-colors"
                    />
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. kavi_rawat"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-[#121212] placeholder-gray-400 outline-none focus:border-black transition-colors"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">@</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="e.g. kavi@gmail.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-[#121212] placeholder-gray-400 outline-none focus:border-black transition-colors"
                    />
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-0.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="Min 4 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2 text-xs text-[#121212] placeholder-gray-400 outline-none focus:border-black transition-colors"
                    />
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                      tabIndex="-1"
                    >
                      {showSignupPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#5a31f4] hover:bg-[#4d26d9] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-[#5a31f4]/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <Sparkles size={14} />
                    </>
                  )}
                </button>

                <div className="text-center pt-0.5">
                  <span className="text-[11px] text-gray-400">
                    Already have an account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      resetFormState();
                    }}
                    className="text-[11px] font-bold text-black hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Quick Guest / Orders helper */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
                className="flex items-center gap-1.5 hover:text-black transition-colors font-medium"
              >
                <Package size={14} />
                <span>Track Orders with Order ID</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
