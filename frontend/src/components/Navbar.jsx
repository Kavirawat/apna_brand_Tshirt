import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useThemeColor } from '../context/ThemeColorContext';
import AccountPopover from './AccountPopover';

export default function Navbar({
  activeNav,
  onSelectNav,
  onOpenSearch,
  onOpenOrders
}) {
  const { themeMode = 'dark' } = useThemeColor();
  const isLight = themeMode === 'light';
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('brahmman_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('brahmman_user');
        setCurrentUser(saved ? JSON.parse(saved) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    handleSync();
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, [accountPopoverOpen]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'all-product', label: 'All Product' },
    { id: 'track-order', label: 'Track Your Order' },
    { id: 'policy', label: 'Store Policy' },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 relative ${
      isLight
        ? 'bg-white/95 border-gray-200 text-gray-900 shadow-xs'
        : 'bg-[#0f232c]/95 border-[#224b5c] text-white'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">

        <div
          onClick={() => onSelectNav('home')}
          className="flex items-center cursor-pointer select-none"
        >
          <img
            src="/brand-logo.jpg"
            alt="Brand Logo"
            className="h-10 sm:h-12 w-auto object-contain hover:opacity-90 transition-opacity rounded border border-[#f0aa93]/30"
          />
        </div>

        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`text-[13px] font-normal transition-all relative py-1 cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'text-[#122731] font-bold border-b-2 border-[#122731]'
                      : 'text-[#f0aa93] font-semibold border-b-2 border-[#f0aa93]'
                    : isLight
                    ? 'text-gray-600 hover:text-black hover:border-b-2 hover:border-black/30'
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-white/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className={`flex items-center space-x-4 sm:space-x-5 ${isLight ? 'text-gray-700' : 'text-gray-200'}`}>

          <button
            onClick={onOpenSearch}
            className="p-1.5 hover:text-[#f0aa93] transition-colors cursor-pointer"
            title="Search"
            aria-label="Search"
          >
            <Search size={21} strokeWidth={1.5} />
          </button>

          <div className="relative">
            <button
              onClick={() => setAccountPopoverOpen(!accountPopoverOpen)}
              className="p-1.5 hover:text-[#f0aa93] transition-colors flex items-center gap-1.5 cursor-pointer"
              title={currentUser ? `Profile: ${currentUser.name || currentUser.username}` : "My Account"}
              aria-label="Account"
            >
              <div className="relative">
                <User size={21} strokeWidth={1.5} />
              </div>
              {currentUser && (
                <span className={`hidden md:inline text-xs font-semibold max-w-[85px] truncate ${
                  isLight ? 'text-gray-800' : 'text-gray-200'
                }`}>
                  {currentUser.name?.split(' ')[0] || currentUser.username}
                </span>
              )}
            </button>

            <AccountPopover
              isOpen={accountPopoverOpen}
              onClose={() => setAccountPopoverOpen(false)}
              onOpenOrders={onOpenOrders}
            />
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-1.5 hover:text-[#f0aa93] transition-colors relative cursor-pointer"
            title="Cart"
            aria-label="Cart"
          >
            <ShoppingBag size={21} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#f0aa93] text-[#122832] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 hover:text-[#f0aa93] cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-6 py-4 space-y-3 ${
          isLight ? 'bg-white border-gray-200' : 'bg-[#0f232c] border-[#224b5c]'
        }`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectNav(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left text-sm py-2 border-b ${
                isLight ? 'text-gray-800 border-gray-100' : 'text-gray-200 border-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
