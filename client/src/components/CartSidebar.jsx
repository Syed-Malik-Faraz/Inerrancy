import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { cart, cartOpen, setCartOpen, cartTotal, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 h-screen w-full z-[80] backdrop-blur-sm animate-fade-in"
        onClick={() => setCartOpen(false)}
      />
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-black-2 z-[90] shadow-2xl animate-slide-in flex flex-col border-l border-gold/10">
        
        {/* Header */}
        <div className="p-6 border-b border-gold/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-gold" size={20} />
            <h2 className="font-heading text-2xl text-ivory tracking-wider uppercase">Your Selection</h2>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="text-ivory hover:text-gold transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {cart.items?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-black-3 flex items-center justify-center mb-6 border border-gold/5">
                <ShoppingBag size={32} className="text-gold opacity-20" />
              </div>
              <p className="font-heading text-xl text-ivory mb-2">The collection is empty</p>
              <p className="text-ivory/40 text-xs uppercase tracking-widest mb-8">Embark on a journey to find your signature scent</p>
              <button 
                onClick={() => { setCartOpen(false); navigate('/shop'); }}
                className="btn btn-outline"
              >
                Go to Shop
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {cart.items.map((item) => (
                <div key={item._id} className="flex gap-4 group">
                  <div className="w-24 h-32 bg-black-3 shrink-0 border border-gold/5 overflow-hidden">
                    <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] text-gold font-bold tracking-widest uppercase">{item.product?.brand}</p>
                        <button 
                          onClick={() => removeItem(item._id)}
                          className="text-ivory/20 hover:text-luxury-red transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h4 className="font-heading text-lg text-ivory leading-tight hover:text-gold transition-colors cursor-pointer mb-1">
                        {item.product?.name}
                      </h4>
                      <p className="text-[11px] text-ivory/40 tracking-wider uppercase">{item.size || 'Standard Size'}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-gold/10 rounded overflow-hidden h-8">
                        <button onClick={() => updateItem(item._id, item.qty - 1)} className="px-2 text-ivory/40 hover:text-gold hover:bg-gold/5 transition-colors"><Minus size={12} /></button>
                        <span className="w-8 text-center text-xs text-ivory font-body">{item.qty}</span>
                        <button onClick={() => updateItem(item._id, item.qty + 1)} className="px-2 text-ivory/40 hover:text-gold hover:bg-gold/5 transition-colors"><Plus size={12} /></button>
                      </div>
                      <p className="text-gold font-bold text-sm">₹{item.price * item.qty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items?.length > 0 && (
          <div className="p-6 bg-black border-t border-gold/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-ivory/40 uppercase tracking-widest">Estimated Total</span>
              <span className="text-xl font-bold text-gold">₹{cartTotal}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full btn btn-primary py-4 text-xs font-bold tracking-[3px] group"
            >
              PROCEED TO SECURE CHECKOUT <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-[10px] text-ivory/30 mt-4 uppercase tracking-widest">Complimentary Shipping on orders over ₹999</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
