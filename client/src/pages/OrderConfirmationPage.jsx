import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Calendar, MapPin, Mail, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!order) return <div className="page-loader">Order not found.</div>;

  return (
    <div className="bg-black min-h-screen pb-24 relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gold/5 blur-[120px] rounded-full -z-10" />

      <div className="container max-w-4xl">
        
        {/* Success Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold-muted border border-gold/20 mb-8 relative">
            <CheckCircle2 size={48} className="text-gold animate-fade-in" />
            <div className="absolute inset-0 bg-gold/10 rounded-full animate-ping opacity-20" />
          </div>
          <p className="text-gold font-bold tracking-[6px] uppercase text-xs mb-4">Masterpiece Secured</p>
          <h1 className="font-heading text-5xl lg:text-7xl text-ivory mb-6 tracking-wide">Thank You, {user?.name?.split(' ')[0]}</h1>
          <p className="text-ivory/60 text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed italic">
            "Your selection has been registered in our archives. Our curators are now preparing your essence for its journey."
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-black-2 border border-gold/10 rounded-2xl overflow-hidden shadow-2xl animate-fade-up">
          
          {/* Summary Banner */}
          <div className="p-8 lg:p-12 border-b border-gold/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left bg-gold-muted/30">
            <div>
              <p className="text-[10px] text-ivory/40 uppercase tracking-[3px] mb-2 font-bold">Inerrancy Order ID</p>
              <p className="text-xl font-heading text-gold tracking-widest">{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-[10px] text-ivory/40 uppercase tracking-[3px] mb-2 font-bold">Acquisition Date</p>
              <p className="text-xl font-heading text-ivory tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-[10px] text-ivory/40 uppercase tracking-[3px] mb-2 font-bold">Acquisition Value</p>
              <p className="text-xl font-heading text-gold tracking-widest">₹{order.totalPrice}</p>
            </div>
          </div>

          <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Col: Details */}
            <div>
              <div className="mb-12">
                <h3 className="text-xs font-bold text- gold uppercase tracking-[4px] mb-6 flex items-center gap-3">
                  <Truck size={16} /> Destination Portfolio
                </h3>
                <div className="space-y-4 p-6 bg-black border border-gold/5 rounded-xl">
                  <p className="text-ivory font-bold tracking-wider">{user?.name}</p>
                  <p className="text-ivory/60 text-sm leading-relaxed">
                    {order.shippingAddress.address},<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    T: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-xs font-bold text-gold uppercase tracking-[4px] mb-6 flex items-center gap-3">
                  <Package size={16} /> Curated Essence
                </h3>
                <div className="space-y-6">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="w-16 h-20 bg-black border border-gold/5 shrink-0 overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="grow flex flex-col justify-center">
                        <h4 className="text-xs text-ivory font-bold uppercase tracking-widest mb-1">{item.name}</h4>
                        <div className="flex justify-between text-[10px] text-ivory/40 tracking-[2px] uppercase">
                           <span>Qty: {item.qty} × {item.size}</span>
                           <span className="text-gold font-bold">₹{item.price * item.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-gold/5 space-y-4">
                 <div className="flex justify-between items-center text-xs tracking-widest uppercase text-ivory/40">
                    <span>Selection Total</span>
                    <span>₹{order.itemsPrice}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs tracking-widest uppercase text-ivory/40">
                    <span>Curating Fee</span>
                    <span>{order.shippingPrice === 0 ? 'Complimentary' : `₹${order.shippingPrice}`}</span>
                 </div>
                 {order.discountPrice > 0 && (
                   <div className="flex justify-between items-center text-xs tracking-widest uppercase text-luxury-green font-bold">
                    <span>- Discount Applied</span>
                    <span>-₹{order.discountPrice}</span>
                   </div>
                 )}
                 <div className="flex justify-between items-center pt-4 border-t border-gold/10">
                    <span className="text-sm font-bold text-gold uppercase tracking-[4px]">Investment Total</span>
                    <span className="text-2xl font-bold text-gold">₹{order.totalPrice}</span>
                 </div>
              </div>
            </div>

            {/* Right Col: Logistics */}
            <div className="flex flex-col">
              <div className="p-8 bg-black rounded-2xl border border-gold/5 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gold-muted border border-gold/10 flex items-center justify-center text-gold mb-6">
                  <Calendar size={28} />
                </div>
                <h4 className="text-sm font-bold text-ivory uppercase tracking-[4px] mb-4">Timeline Update</h4>
                <p className="text-[11px] text-ivory/40 mb-6 leading-relaxed uppercase tracking-widest">
                  Your order is currently being inspected and vault-sealed. You can expect tracking metadata in your inbox within 24 hours.
                </p>
                <div className="w-full h-2 bg-black-3 rounded-full overflow-hidden mb-8 border border-gold/10">
                   <div className="h-full w-1/4 bg-gold animate-[pulse_2s_infinite]" />
                </div>
                <div className="w-full space-y-4">
                   <div className="flex items-center gap-3 text-[10px] font-bold tracking-[2px] uppercase text-gold">
                      <div className="w-2 h-2 rounded-full bg-gold" /> ORDER CONFIRMED
                   </div>
                   <div className="flex items-center gap-3 text-[10px] font-bold tracking-[2px] uppercase text-ivory/20">
                      <div className="w-2 h-2 rounded-full bg-ivory/10" /> UNDER PREPARATION
                   </div>
                   <div className="flex items-center gap-3 text-[10px] font-bold tracking-[2px] uppercase text-ivory/20">
                      <div className="w-2 h-2 rounded-full bg-ivory/10" /> SHIPPED
                   </div>
                </div>
              </div>

              <div className="mt-12 space-y-8">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold shrink-0">
                       <Mail size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-ivory uppercase tracking-widest">Confirmation Sent</p>
                       <p className="text-[10px] text-ivory/40 uppercase tracking-widest mt-1">To: {user?.email}</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => window.print()}
                  className="w-full btn btn-ghost text-[10px] tracking-[4px] py-4"
                >
                  PRINT TRANSACTION RECORD
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in delay-500">
           <Link to="/orders" className="btn btn-outline min-w-[240px] px-12 group">
              MANAGE MY PORTFOLIO <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
           </Link>
           <Link to="/shop" className="btn btn-primary min-w-[240px] px-12 flex items-center justify-center gap-3">
              <ShoppingBag size={18} /> BACK TO COLLECTION
           </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;
