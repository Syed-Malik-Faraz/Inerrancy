import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Eye, Truck, CheckCircle2, XCircle, 
  MapPin, Phone, Mail, ArrowRight, ExternalLink, Calendar
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?keyword=${search}`);
      setOrders(res.data.orders);
    } catch (err) {
      toast.error('Failed to retrieve transmissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Protocol Updated: ${status}`);
      fetchOrders();
      if (viewingOrder?._id === id) setViewingOrder(null);
    } catch {
      toast.error('Dispatch update failed');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-luxury-green bg-luxury-green/10 border-luxury-green/20';
      case 'Shipped': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Processing': return 'text-gold bg-gold/10 border-gold/20';
      case 'Cancelled': return 'text-luxury-red bg-luxury-red/10 border-luxury-red/20';
      default: return 'text-ivory/40 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-20 lg:space-y-32 pb-20">
      <header className="header-vault">
        <div>
          <h1 className="title-vault">Acquisition Protocols</h1>
          <p className="label-vault">Manage and monitor global essence transmissions</p>
        </div>
      </header>

      <div className="card-vault overflow-hidden">
        <div className="flex flex-wrap gap-4 mb-20 justify-between items-center px-4">
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/20" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID, email, or name..." 
              className="bg-black border border-gold/10 pl-12 pr-4 py-3 rounded-xl text-xs font-bold tracking-[2px] uppercase text-gold outline-none w-full focus:border-gold/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table-vault">
            <thead>
              <tr>
                <th>Protocol ID</th>
                <th>Client Focus</th>
                <th>Temporal Stamp</th>
                <th>Fiscal Summary</th>
                <th>Dispatch Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td><span className="text-[10px] font-bold text-gold tracking-widest uppercase">#{o._id.slice(-8)}</span></td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-ivory uppercase tracking-widest">{o.user?.name || 'Guest'}</span>
                      <span className="text-[9px] text-ivory/20 uppercase tracking-[2px]">{o.user?.email}</span>
                    </div>
                  </td>
                  <td><span className="text-[10px] text-ivory/40 uppercase tracking-widest">{new Date(o.createdAt).toLocaleDateString()}</span></td>
                  <td><span className="text-xs font-bold text-gold tracking-widest">₹{o.totalPrice}</span></td>
                  <td>
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${getStatusColor(o.orderStatus)}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                       <button onClick={() => setViewingOrder(o)} className="p-2.5 bg-gold-muted/30 text-gold rounded-lg border border-gold/10 hover:bg-gold hover:text-black transition-all">
                          <Eye size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && !loading && <p className="text-center py-20 text-ivory/20 text-xs italic">No transmissions registered</p>}
        </div>
      </div>

      {/* Detail Modal overlay */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="w-full max-w-4xl bg-black-2 border border-gold/20 rounded-3xl overflow-hidden shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="p-8 border-b border-gold/10 flex justify-between items-center bg-gold-muted/20">
                 <div>
                    <h2 className="font-heading text-3xl text-ivory tracking-wide italic">Transmission Analysis</h2>
                    <p className="text-[9px] text-gold font-bold uppercase tracking-[4px]">REF: {viewingOrder._id.toUpperCase()}</p>
                 </div>
                 <button onClick={() => setViewingOrder(null)} className="p-2 text-ivory/20 hover:text-gold transition-colors"><XCircle size={24} /></button>
              </div>

              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                 {/* Left: Metadata */}
                 <div className="space-y-10">
                    <div>
                       <h3 className="text-xs font-bold text- gold uppercase tracking-[4px] mb-6 flex items-center gap-2 underline decoration-gold/20">
                          <MapPin size={14} /> Dispatch Destination
                       </h3>
                       <div className="p-6 bg-black border border-gold/5 rounded-xl space-y-4">
                          <p className="text-ivory font-bold text-sm tracking-wider">{viewingOrder.user?.name}</p>
                          <p className="text-ivory/60 text-xs leading-loose italic">
                            {viewingOrder.shippingAddress.address},<br />
                            {viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.state} {viewingOrder.shippingAddress.postalCode}<br />
                            <span className="flex items-center gap-2 mt-2 text-gold/60"><Phone size={12} /> {viewingOrder.shippingAddress.phone}</span>
                          </p>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-xs font-bold text-gold uppercase tracking-[4px] mb-6 flex items-center gap-2 underline decoration-gold/20">
                          <Package size={14} /> Curated Essences
                       </h3>
                       <div className="space-y-6">
                          {viewingOrder.items.map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                               <div className="w-14 h-16 bg-black border border-gold/5 rounded overflow-hidden">
                                  <img src={item.image} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" />
                               </div>
                               <div className="grow flex flex-col justify-center">
                                  <h4 className="text-[10px] text-ivory font-bold uppercase tracking-widest mb-1">{item.name}</h4>
                                  <div className="flex justify-between items-center text-[9px] text-ivory/30 tracking-[2px] uppercase">
                                     <span>Qty: {item.qty} × {item.size}</span>
                                     <span className="text-gold font-bold">₹{item.price * item.qty}</span>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Right: Operations */}
                 <div className="space-y-12">
                     <div className="p-8 bg-black rounded-2xl border border-gold/10">
                        <h3 className="text-[10px] font-bold text-ivory uppercase tracking-[4px] mb-8 text-center italic underline decoration-gold/20">Protocol Execution</h3>
                        <div className="flex flex-col gap-4">
                           {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                             <button 
                                key={status}
                                disabled={updating || viewingOrder.orderStatus === status}
                                onClick={() => updateStatus(viewingOrder._id, status)}
                                className={`w-full py-4 text-[10px] font-bold tracking-[4px] uppercase border transition-all duration-300 rounded-xl ${viewingOrder.orderStatus === status ? 'bg-gold text-black border-gold shadow-gold' : 'bg-gold-muted/10 text-gold/40 border-gold/5 hover:border-gold/30 hover:text-gold'}`}
                             >
                               {viewingOrder.orderStatus === status ? `Status: ${status} [Active]` : `Escalate to ${status}`}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="pt-10 border-t border-gold/10 space-y-4">
                        <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-[2px]">
                           <span>Items Gross</span>
                           <span>₹{viewingOrder.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-[2px]">
                           <span>Curating Fee</span>
                           <span>₹{viewingOrder.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                           <span className="text-sm font-bold text-gold uppercase tracking-[4px]">Investment Net</span>
                           <span className="text-3xl font-bold text-gold">₹{viewingOrder.totalPrice}</span>
                        </div>
                     </div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrdersPage;
