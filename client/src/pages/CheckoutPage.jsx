import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Lock, CreditCard, Truck, CheckCircle2, Zap, MapPin, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Selected saved address ID; 'new' = manually entered
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    if (!user?.addresses?.length) return 'new';
    return user.addresses.find((a) => a.isDefault)?._id || user.addresses[0]._id;
  });

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'card',
  });

  // Pre-fill form from the initially-selected saved address
  useEffect(() => {
    if (!cart.items?.length) {
      toast.error('Your cart is empty');
      navigate('/shop');
      return;
    }
    if (user?.addresses?.length) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      fillFromAddress(defaultAddr);
    }
  }, []);

  const fillFromAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      address: [addr.line1, addr.line2].filter(Boolean).join(', '),
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.pincode || '',
      phone: addr.phone || prev.phone,
      firstName: addr.name?.split(' ')[0] || prev.firstName,
      lastName: addr.name?.split(' ').slice(1).join(' ') || prev.lastName,
    }));
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    fillFromAddress(addr);
  };

  const handleSelectNewAddress = () => {
    setSelectedAddressId('new');
    setFormData((prev) => ({
      ...prev,
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    }));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, orderAmount: cartTotal });
      setAppliedCoupon(res.data.coupon);
      setDiscountAmount(res.data.discountAmount);
      toast.success(`Coupon applied: -₹${res.data.discountAmount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const shippingCost = cartTotal >= 999 ? 0 : 99;
  const grandTotal = cartTotal + shippingCost - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          qty: item.qty,
          image: item.product.images[0],
          price: item.price,
          size: item.size,
        })),
        shippingAddress: {
          line1: formData.address,
          city: formData.city,
          pincode: formData.zip,
          state: formData.state,
          phone: formData.phone,
        },
        paymentMethod:
          formData.paymentMethod === 'card'
            ? 'Dummy Card'
            : formData.paymentMethod === 'upi'
            ? 'Dummy UPI'
            : 'COD',
        itemsPrice: cartTotal,
        shippingPrice: shippingCost,
        discountPrice: discountAmount,
        totalPrice: grandTotal,
        couponCode: appliedCoupon?.code,
      };

      const res = await api.post('/orders', orderData);
      const orderId = res.data.order._id;

      toast.loading('Processing secured payment...', { id: 'payment' });
      await new Promise((resolve) => setTimeout(resolve, 2500));

      await api.post('/payment/verify', {
        orderId,
        paymentStatus: 'paid',
        transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      });

      toast.success('Payment successful! Preparing your order...', { id: 'payment' });
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || 'Transaction failed', { id: 'payment' });
    }
  };

  const hasSavedAddresses = user?.addresses?.length > 0;

  return (
    <div className="bg-black min-h-screen pb-20">
      <div className="container">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-widest text-ivory/30 uppercase mb-12">
          <Link to="/cart" className="hover:text-gold transition-colors">Bag</Link>
          <ChevronRight size={10} />
          <span className="text-gold">Secure Checkout</span>
        </nav>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left: Forms */}
          <div className="lg:col-span-7">

            {/* 1. Delivery Address */}
            <section className="animate-fade-in mb-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold font-heading text-xl">1</div>
                <h2 className="font-heading text-3xl text-ivory tracking-wide">Delivery Address</h2>
              </div>

              {/* Saved Addresses Grid */}
              {hasSavedAddresses && (
                <div className="mb-8">
                  <p className="text-[10px] text-ivory/30 uppercase tracking-[3px] font-bold mb-4">Choose from saved addresses</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {user.addresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`text-left p-4 border rounded-xl transition-all relative ${
                          selectedAddressId === addr._id
                            ? 'border-gold bg-gold/5'
                            : 'border-gold/10 bg-black-2 hover:border-gold/25'
                        }`}
                      >
                        {selectedAddressId === addr._id && (
                          <CheckCircle2 size={14} className="absolute top-3 right-3 text-gold" />
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex items-center gap-1 text-[9px] font-bold text-gold uppercase tracking-widest px-2 py-0.5 border border-gold/30 rounded-full">
                            <MapPin size={8} /> {addr.label || 'Address'}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[8px] text-ivory/25 uppercase tracking-wider">Default</span>
                          )}
                        </div>
                        <p className="text-ivory text-xs font-bold mb-0.5">{addr.name}</p>
                        <p className="text-ivory/40 text-[10px] leading-relaxed">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </button>
                    ))}

                    {/* New Address Option */}
                    <button
                      type="button"
                      onClick={handleSelectNewAddress}
                      className={`text-left p-4 border rounded-xl transition-all border-dashed flex items-center gap-3 ${
                        selectedAddressId === 'new'
                          ? 'border-gold bg-gold/5'
                          : 'border-gold/10 hover:border-gold/25'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${selectedAddressId === 'new' ? 'border-gold text-gold' : 'border-gold/20 text-ivory/20'}`}>
                        <Plus size={14} />
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider ${selectedAddressId === 'new' ? 'text-gold' : 'text-ivory/30'}`}>Enter new address</p>
                        <p className="text-[10px] text-ivory/20 mt-0.5">Fill in the fields below</p>
                      </div>
                    </button>
                  </div>

                  <Link to="/profile" className="text-[10px] text-ivory/25 hover:text-gold uppercase tracking-[2px] font-bold transition-colors inline-flex items-center gap-1">
                    <MapPin size={10} /> Manage saved addresses
                  </Link>

                  <div className="h-px bg-gold/10 mt-6" />
                </div>
              )}

              {/* Manual Form — always visible, pre-filled when saved address selected */}
              <div className={`transition-opacity duration-300 ${hasSavedAddresses && selectedAddressId !== 'new' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {hasSavedAddresses && selectedAddressId !== 'new' && (
                  <p className="text-[10px] text-ivory/30 uppercase tracking-[3px] font-bold mb-4">Delivery details from selected address</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="luxury-input" placeholder="e.g. Aryan" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="luxury-input" placeholder="e.g. Malik" />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" value={formData.email} readOnly className="luxury-input opacity-50 cursor-not-allowed" />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="luxury-input" placeholder="+91 XXX XXX XXXX" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="form-group">
                    <label className="form-label">Mailing Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="luxury-input" placeholder="Street, Building, Apartment" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="luxury-input" placeholder="Mumbai" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="luxury-input" placeholder="Maharashtra" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} required className="luxury-input" placeholder="400001" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary of selected saved address */}
              {hasSavedAddresses && selectedAddressId !== 'new' && (() => {
                const addr = user.addresses.find((a) => a._id === selectedAddressId);
                if (!addr) return null;
                return (
                  <div className="mt-6 p-5 bg-gold/5 border border-gold/20 rounded-xl flex items-start gap-4">
                    <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] text-gold font-bold uppercase tracking-widest mb-1">{addr.label || 'Address'}</p>
                      <p className="text-ivory text-sm font-bold">{addr.name}</p>
                      <p className="text-ivory/50 text-xs mt-0.5 leading-relaxed">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      <p className="text-ivory/30 text-[10px] mt-1">{addr.phone}</p>
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* 2. Payment Method */}
            <section className="animate-fade-in mb-12 py-12 border-t border-gold/10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold font-heading text-xl">2</div>
                <h2 className="font-heading text-3xl text-ivory tracking-wide">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI / Digital Wallet', icon: Zap },
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-6 border transition-all cursor-pointer rounded-lg ${formData.paymentMethod === method.id ? 'bg-gold-muted border-gold' : 'bg-black-2 border-gold/10 hover:border-gold/30'}`}
                  >
                    <div className="flex items-center gap-4">
                      <input type="radio" name="paymentMethod" checked={formData.paymentMethod === method.id} onChange={() => setFormData({ ...formData, paymentMethod: method.id })} className="hidden" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === method.id ? 'border-gold' : 'border-gold/30'}`}>
                        {formData.paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                      </div>
                      <span className={`text-sm font-bold tracking-widest uppercase ${formData.paymentMethod === method.id ? 'text-gold' : 'text-ivory/60'}`}>{method.label}</span>
                    </div>
                    <method.icon size={20} className={formData.paymentMethod === method.id ? 'text-gold' : 'text-ivory/20'} />
                  </label>
                ))}
              </div>
            </section>

            {/* Security Note */}
            <div className="p-8 bg-black-2 rounded-xl border border-gold/10 flex gap-6">
              <div className="w-14 h-14 rounded-full bg-gold-muted flex items-center justify-center text-gold shrink-0 border border-gold/10">
                <Lock size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-ivory uppercase tracking-widest mb-2">Secure Payment</h4>
                <p className="text-[11px] text-ivory/40 leading-relaxed uppercase tracking-widest">Your payment details are encrypted using banking-standard TLS 1.3 protocol. Inerrancy never stores your financial credentials.</p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 p-10 bg-black-2 rounded-xl border border-gold/10 shadow-2xl">
              <h3 className="font-heading text-2xl text-ivory mb-8 pb-4 border-b border-gold/10 tracking-wider text-center">Your Selection</h3>

              <div className="max-h-75 overflow-y-auto pr-2 mb-8 space-y-4 no-scrollbar">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-20 bg-black border border-gold/5 shrink-0 overflow-hidden">
                      <img src={item.product?.images?.[0]} className="w-full h-full object-cover" />
                    </div>
                    <div className="grow flex flex-col justify-center">
                      <h4 className="text-[11px] text-ivory font-bold uppercase tracking-wider mb-1 truncate max-w-45">{item.product?.name}</h4>
                      <div className="flex justify-between items-center text-[10px] text-ivory/40 uppercase tracking-[2px]">
                        <span>Qty: {item.qty} × {item.size}</span>
                        <span className="text-gold font-bold">₹{item.price * item.qty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-10 p-2 bg-black border border-gold/10 flex">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="bg-transparent border-0 px-4 py-3 text-[10px] tracking-[4px] font-bold text-gold outline-none grow placeholder:text-ivory/20"
                />
                <button type="button" onClick={applyCoupon} className="bg-gold/10 text-gold px-6 text-[10px] font-bold tracking-[2px] uppercase hover:bg-gold hover:text-black transition-all">
                  APPLY
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-xs uppercase tracking-widest text-ivory/40">
                  <span>Subtotal</span><span className="text-ivory">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest text-ivory/40">
                  <span>Shipping</span><span className="text-ivory">{shippingCost === 0 ? 'COMPLIMENTARY' : `₹${shippingCost}`}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs uppercase tracking-[3px] text-luxury-green font-bold">
                    <span>- DISCOUNT APPLIED</span><span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="pt-6 border-t border-gold/10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gold uppercase tracking-[4px]">Total</span>
                    <span className="text-4xl font-bold text-gold">₹{grandTotal}</span>
                  </div>
                  <p className="text-center text-[10px] text-ivory/20 mt-4 tracking-widest uppercase">Safe & Encrypted Transaction by Inerrancy Pay</p>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn btn-primary py-5 text-sm tracking-[5px] font-bold flex items-center justify-center gap-4">
                {loading ? (
                  <><div className="spinner spinner-sm border-black!" /> PLACING ORDER...</>
                ) : (
                  <>COMPLETE ORDER</>
                )}
              </button>

              <div className="mt-8 flex items-center justify-center gap-6 opacity-30 invert grayscale">
                <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" className="h-4" />
                <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" className="h-4" />
                <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4" />
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
