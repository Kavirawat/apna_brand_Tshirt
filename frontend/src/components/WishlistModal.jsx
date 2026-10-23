import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function WishlistModal({ isOpen, onClose, onSelectProduct }) {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121318] border border-white/15 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl animate-fadeIn relative max-h-[85vh] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-red-500 fill-red-500" />
            <h3 className="font-serif text-sm font-bold uppercase tracking-widest">
              SACRED WISHLIST ({wishlist.length})
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-xs">
              <Heart size={36} className="mx-auto mb-2 text-gray-600" />
              Your wishlist is empty. Tap the heart icon on any product to save it.
            </div>
          ) : (
            wishlist.map(product => (
              <div
                key={product.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <img src={product.images[0]} alt={product.title} className="w-12 h-16 object-cover rounded-lg" />
                  <div className="min-w-0">
                    <span className="font-sanskrit text-xs text-[#d4af37] block truncate">{product.sanskritTitle}</span>
                    <h4 className="text-xs font-bold text-white truncate uppercase">{product.title}</h4>
                    <span className="text-xs font-mono text-gray-300">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      addToCart(product, 'L', product.colors[0]?.name || 'Black', 1);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black font-bold text-xs uppercase"
                  >
                    ADD TO BAG
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 text-gray-400 hover:text-red-400"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider text-white"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
