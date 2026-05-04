import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, cartTotal, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();

  if (loading && !cart.items?.length) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="bg-black min-h-screen pt-28 pb-20">
      <div className="container">
        
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <nav className="flex items-center gap-2 text-[10px] tracking-widest text-ivory/30 uppercase mb-4">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gold">Your Selection</span>
            </nav>
            <h1 className="font-heading text-4xl lg:text-5xl text-ivory">Bag Of Essence</h1>
            <p className="text-ivory/40 text-xs tracking-wider uppercase mt-4">Review your curated olfactory collection</p>
          </div>
          <Link to="/shop" className="text-xs font-bold tracking-[3px] text-gold uppercase hover:underline">Continue Exploring</Link>
        </div>

        {cart.items?.length === 0 ? (
          <div className="py-24 text-center border border-gold/10 rounded-xl bg-black-2 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center mb-8 mx-auto border border-gold/5">
              <ShoppingBag size={40} className="text-gold opacity-20" />
            </div>
            <h3 className="font-heading text-3xl text-ivory mb-4">Your Bag is Empty</h3>
            <p className="text-ivory/40 max-w-sm mx-auto mb-10">It seems you haven't added any masterpieces to your collection yet. Let's find your signature scent.</p>
            <Link to="/shop" className="btn btn-primary px-12">GO TO SHOP</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left: Items List */}
            <div className="lg:col-span-2 space-y-8">
              <div className="hidden md:grid grid-cols-12 pb-6 border-b border-gold/10 text-[10px] font-bold tracking-[3px] text-gold uppercase">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {cart.items.map((item) => (
                <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 pb-8 border-b border-gold/5 group">
                  <div className="md:col-span-6 flex gap-6">
                    <div className="w-24 h-32 lg:w-32 lg:h-44 bg-black-2 rounded-lg overflow-hidden border border-gold/10 shrink-0">
                      <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] text-gold font-bold tracking-[2px] uppercase mb-1">{item.product?.brand}</p>
                      <Link to={`/product/${item.product?._id}`} className="font-heading text-xl lg:text-2xl text-ivory hover:text-gold transition-colors mb-2">
                        {item.product?.name}
                      </Link>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-ivory/40">Size: <span className="text-ivory/80 uppercase tracking-widest">{item.size || 'Standard'}</span></p>
                        <button 
                          onClick={() => removeItem(item._id)}
                          className="flex items-center gap-2 text-[10px] text-ivory/30 hover:text-luxury-red transition-all uppercase tracking-widest mt-4"
                        >
                          <Trash2 size={12} /> Remove Choice
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 text-center hidden md:block">
                    <span className="text-ivory">₹{item.price}</span>
                  </div>

                  <div className="md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-gold/10 rounded overflow-hidden h-10 bg-black-2">
                       <button onClick={() => updateItem(item._id, item.qty - 1)} className="px-3 text-ivory/40 hover:text-gold hover:bg-gold/5 transition-colors"><Minus size={14} /></button>
                       <span className="w-10 text-center text-sm text-ivory font-body">{item.qty}</span>
                       <button onClick={() => updateItem(item._id, item.qty + 1)} className="px-3 text-ivory/40 hover:text-gold hover:bg-gold/5 transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-right">
                    <span className="text-gold font-bold text-lg">₹{item.price * item.qty}</span>
                  </div>
                </div>
              ))}

              {/* USPS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                <div className="flex items-center gap-4 py-6 px-8 bg-black-2 rounded-lg border border-gold/5 transition-all hover:border-gold/20">
                  <ShieldCheck size={24} className="text-gold" />
                  <span className="text-[10px] font-bold tracking-[2px] text-ivory/60 uppercase">100% Secure Checkout</span>
                </div>
                <div className="flex items-center gap-4 py-6 px-8 bg-black-2 rounded-lg border border-gold/5 transition-all hover:border-gold/20">
                  <Truck size={24} className="text-gold" />
                  <span className="text-[10px] font-bold tracking-[2px] text-ivory/60 uppercase">Insured Tracked Delivery</span>
                </div>
                <div className="flex items-center gap-4 py-6 px-8 bg-black-2 rounded-lg border border-gold/5 transition-all hover:border-gold/20">
                  <RefreshCw size={24} className="text-gold" />
                  <span className="text-[10px] font-bold tracking-[2px] text-ivory/60 uppercase">Authenticity Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 p-10 bg-black-2 rounded-xl border border-gold/10 shadow-2xl">
                <h3 className="font-heading text-2xl text-ivory mb-8 pb-4 border-b border-gold/10 tracking-wider">Summary</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-ivory/40 uppercase tracking-widest">Order Subtotal</span>
                    <span className="text-ivory font-semibold text-lg">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-luxury-green">
                    <span className="text-xs uppercase tracking-widest">Fragrance Discount</span>
                    <span className="font-semibold">-₹0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-ivory/40 uppercase tracking-widest">Shipping & Handling</span>
                    <span className="text-ivory/80 text-xs uppercase tracking-widest">{cartTotal >= 999 ? 'Complimentary' : '₹99'}</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-gold/10 mb-8">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-[4px]">Grand Total</span>
                      <span className="text-3xl font-bold text-gold">₹{cartTotal >= 999 ? cartTotal : cartTotal + 99}</span>
                   </div>
                   <p className="text-[10px] text-ivory/30 uppercase tracking-widest">Taxes and customs duties included</p>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full btn btn-primary py-5 text-sm tracking-[4px] font-bold group"
                >
                  CHECKOUT NOW <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 pt-8 border-t border-gold/10 text-center">
                  <p className="text-[10px] text-ivory/40 mb-4 uppercase tracking-[2px]">Accepted payment methods</p>
                  <div className="flex justify-center gap-4 opacity-40 invert grayscale transition-opacity hover:opacity-100">
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" className="h-6" alt="Visa" />
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" className="h-6" alt="MC" />
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" className="h-6" alt="Amex" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-6" alt="UPI" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
