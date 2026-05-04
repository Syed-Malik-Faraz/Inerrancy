import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, ChevronRight, ShoppingBag, Search, ExternalLink } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return <span className="bg-luxury-green/10 text-luxury-green text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-luxury-green/20">Delivered</span>;
      case 'Shipped': return <span className="bg-blue-500/10 text-blue-400 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/20">In Transit</span>;
      case 'Processing': return <span className="bg-gold/10 text-gold text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-gold/20">Being Curated</span>;
      case 'Cancelled': return <span className="bg-luxury-red/10 text-luxury-red text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-luxury-red/20">Voided</span>;
      default: return <span className="bg-ivory/10 text-ivory/60 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-ivory/20">{status}</span>;
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <nav className="flex items-center gap-2 text-[10px] tracking-widest text-ivory/30 uppercase mb-4">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gold">Portfolio</span>
            </nav>
            <h1 className="font-heading text-4xl lg:text-5xl text-ivory">Order History</h1>
            <p className="text-ivory/40 text-xs tracking-wider uppercase mt-4">Archive of your olfactory acquisitions</p>
          </div>
          <Link to="/shop" className="btn btn-outline min-w-[200px] group">
            NEW ACQUISITION <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-gold/10 rounded-2xl bg-black-2 animate-fade-in">
             <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mb-8 mx-auto border border-gold/5">
                <Package size={32} className="text-gold opacity-10" />
             </div>
             <h3 className="font-heading text-2xl text-ivory mb-2">No Acquisitions Found</h3>
             <p className="text-ivory/40 text-xs uppercase tracking-widest mb-10">Your personal archive is currently empty</p>
             <Link to="/shop" className="btn btn-primary px-12">DISCOVER ESSENCES</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-black-2 border border-gold/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-gold/30 group animate-fade-up">
                
                {/* Header Information */}
                <div className="p-6 md:p-8 bg-black/40 border-b border-gold/10 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                  <div className="flex flex-wrap gap-8 items-center">
                    <div>
                       <p className="text-[10px] text-ivory/30 uppercase tracking-[2px] mb-1">Acquisition ID</p>
                       <p className="text-xs font-bold text-gold tracking-widest">#{order._id.toUpperCase()}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-ivory/30 uppercase tracking-[2px] mb-1">Date</p>
                       <p className="text-xs text-ivory/80 font-semibold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-ivory/30 uppercase tracking-[2px] mb-1">Total Value</p>
                       <p className="text-xs font-bold text-ivory">₹{order.totalPrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     {getStatusBadge(order.orderStatus)}
                     <Link to={`/order-confirmation/${order._id}`} className="p-2 text-ivory/30 hover:text-gold transition-colors">
                        <ExternalLink size={18} />
                     </Link>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-8 flex flex-wrap gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="relative group/item">
                        <div className="w-16 h-20 bg-black rounded border border-gold/5 overflow-hidden">
                          <img src={item.image} className="w-full h-full object-cover grayscale transition-all group-hover/item:grayscale-0" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-gold text-black text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                          {item.qty}
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col justify-center ml-2">
                       <p className="text-xs text-ivory/80 font-heading mb-1">{order.items.length} Fragrance{order.items.length > 1 ? 's' : ''}</p>
                       <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Curated for {order.shippingAddress.city}</p>
                    </div>
                  </div>

                  {/* Tracking / Quick Info */}
                  <div className="lg:col-span-4 flex justify-end">
                    <div className="w-full lg:w-auto p-4 bg-black border border-gold/5 rounded-lg flex items-center gap-6">
                      <div className="w-10 h-10 rounded-full bg-gold-muted flex items-center justify-center text-gold border border-gold/10">
                        {order.isDelivered ? <CheckCircle2 size={18} /> : <Truck size={18} className="animate-pulse" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ivory uppercase tracking-widest">{order.isDelivered ? 'Delivery Complete' : 'Logistic Status'}</p>
                        <p className="text-[10px] text-ivory/40 uppercase tracking-widest mt-1">
                          {order.isDelivered ? `Arrived on ${new Date(order.deliveredAt).toLocaleDateString()}` : `Estimated Arrival: 3-5 Business Days`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Code if exists */}
                {order.trackingNumber && (
                   <div className="px-8 pb-8 flex items-center gap-2 text-[10px] text-gold/60 uppercase tracking-widest font-bold">
                      TRK-REF: <span className="text-ivory/60">{order.trackingNumber}</span>
                   </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrdersPage;
