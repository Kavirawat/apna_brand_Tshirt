import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { ThemeColorProvider, useThemeColor } from './context/ThemeColorContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import Bestsellers from './components/Bestsellers';
import ShopNowSection from './components/ShopNowSection';
import MoreThanClothingSection from './components/MoreThanClothingSection';
import BrandManifestoSection from './components/BrandManifestoSection';
import CollectionsAll from './components/CollectionsAll';
import ProductView from './components/ProductView';
import BottomBar from './components/BottomBar';
import KaalChatWidget from './components/KaalChatWidget';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import SizeGuideModal from './components/SizeGuideModal';
import AccountPopover from './components/AccountPopover';
import TrackOrderView from './components/TrackOrderView';
import { API_BASE } from './config';

import initialProducts from './data/products.json';

function Storefront() {
  const { themeMode = 'dark' } = useThemeColor();
  const isLight = themeMode === 'light';
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeNav, setActiveNav] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#track-order') {
      return 'track-order';
    }
    return 'home';
  });
  const [trackingOrderId, setTrackingOrderId] = useState('');

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#track-order') {
        setActiveNav('track-order');
        setSelectedProduct(null);
      } else if (window.location.hash === '#home') {
        setActiveNav('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTrackOrder = (orderId) => {
    setTrackingOrderId(orderId || '');
    setActiveNav('track-order');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [sizeGuideModalOpen, setSizeGuideModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  useEffect(() => {
    async function loadBackendData() {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch {

      }
    }
    loadBackendData();
  }, []);

  const handleSelectNav = (navId) => {
    setActiveNav(navId);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboardPage = activeNav === 'home' && !selectedProduct;

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans selection:bg-[#f0aa93] selection:text-[#122832] transition-colors duration-300 ${
      isLight ? 'bg-white text-gray-900' : 'bg-[#122832] text-white'
    }`}>

      <Navbar
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenOrders={() => handleSelectNav('track-order')}
        onOpenAccount={() => setAccountModalOpen(true)}
      />

      <main className="flex-1">

        {selectedProduct ? (
          <ProductView
            product={selectedProduct}
            onBack={handleBackToCatalog}
            onOpenSizeGuide={() => setSizeGuideModalOpen(true)}
          />
        ) : activeNav === 'home' ? (

          <div>

            <HeroBanner onShopNowClick={() => handleSelectNav('all-product')} />

            <Bestsellers
              products={products}
              onSelectProduct={handleSelectProduct}
              onShopNowClick={() => handleSelectNav('all-product')}
            />

            <ShopNowSection
              products={products}
              onSelectProduct={handleSelectProduct}
              onViewAllClick={() => handleSelectNav('all-product')}
            />

            <MoreThanClothingSection
              onExploreClick={() => handleSelectNav('all-product')}
            />

            <BrandManifestoSection
              onDiscoverClick={() => handleSelectNav('all-product')}
            />
          </div>
        ) : activeNav === 'all-product' ? (

          <div>
            <CollectionsAll
              products={products}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        ) : activeNav === 'track-order' ? (

          <TrackOrderView initialOrderId={trackingOrderId} />
        ) : (

          <div className={`max-w-3xl mx-auto py-16 px-4 space-y-6 ${isLight ? 'text-gray-900' : 'text-white'}`}>
            <h2 className={`text-2xl font-bold uppercase mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>Apna Brand Policy</h2>
            <div className={`space-y-4 text-sm leading-relaxed border-t pt-4 ${isLight ? 'text-gray-600 border-gray-200' : 'text-gray-300 border-white/10'}`}>
              <p><strong className={isLight ? 'text-gray-900' : 'text-white'}>1. Shipping:</strong> We provide express domestic delivery across India. Orders are processed within 24–48 hours.</p>
              <p><strong className={isLight ? 'text-gray-900' : 'text-white'}>2. 7-Day Exchange:</strong> Size exchanges are accepted within 7 days of delivery, provided tags remain intact.</p>
              <p><strong className={isLight ? 'text-gray-900' : 'text-white'}>3. Cash on Delivery:</strong> Available across 26,000+ PIN codes with zero advance payment requirement.</p>
              <p><strong className={isLight ? 'text-gray-900' : 'text-white'}>4. Craft Integrity:</strong> 100% super-combed bio-washed cotton, engineered for longevity.</p>
            </div>
          </div>
        )}

      </main>

      <BottomBar
        onSelectPhilosophy={() => handleSelectNav('policy')}
        onOpenStore={() => handleSelectNav('home')}
      />

      {isDashboardPage && <KaalChatWidget />}

      <CartDrawer
        onSelectProduct={handleSelectProduct}
        onTrackOrder={handleTrackOrder}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      <SizeGuideModal
        isOpen={sizeGuideModalOpen}
        onClose={() => setSizeGuideModalOpen(false)}
      />

      <AccountPopover
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onOpenOrders={() => handleSelectNav('track-order')}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeColorProvider>
      <CartProvider>
        <Storefront />
      </CartProvider>
    </ThemeColorProvider>
  );
}
