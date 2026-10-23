import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('brahmman_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('brahmman_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('brahmman_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('brahmman_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product, size = 'L', color = null, quantity = 1) => {
    const selectedColor = color || (product.colors && product.colors[0]?.name) || 'Black';
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item =>
        item.id === product.id && item.size === size && item.color === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          handle: product.handle,
          title: product.title,
          sanskritTitle: product.sanskritTitle,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.images && product.images[0],
          size,
          color: selectedColor,
          quantity
        }];
      }
    });

    showToast(`Added ${product.sanskritTitle || product.title} (${size}) to bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size, color) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size && item.color === color)));
  };

  const updateQuantity = (id, size, color, qty) => {
    if (qty <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.size === size && item.color === color) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`Removed from sacred wishlist`);
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(`Saved to sacred wishlist`);
        return [...prev, product];
      }
    });
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DHARM10' || clean === 'BRAHMMAN10') {
      setCouponCode(clean);
      setDiscountPercent(10);
      showToast('10% Dharma Blessing applied!');
      return { success: true, message: '10% discount applied!' };
    } else if (clean === 'VEDA20') {
      setCouponCode(clean);
      setDiscountPercent(20);
      showToast('20% Vedic Privilege applied!');
      return { success: true, message: '20% discount applied!' };
    } else {
      showToast('Invalid coupon code');
      return { success: false, message: 'Invalid promo code' };
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount;
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || cartItems.length === 0;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartCount,
      subtotal,
      discountPercent,
      discountAmount,
      total,
      couponCode,
      applyCoupon,
      freeShippingThreshold,
      isFreeShipping,
      wishlist,
      toggleWishlist,
      toastMessage
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
