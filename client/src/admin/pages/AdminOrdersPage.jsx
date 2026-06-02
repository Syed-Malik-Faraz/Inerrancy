import React, { useState, useEffect, useRef } from 'react';
import {
  Package, Search, Eye, XCircle,
  MapPin, Phone, Download
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    fetchOrders();
  }, [search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?search=${encodeURIComponent(search)}`);
      setOrders(res.data.orders || []);
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
      // Refresh the modal order too
      const updatedOrders = orders.map(o => o._id === id ? { ...o, status } : o);
      setOrders(updatedOrders);
      if (viewingOrder?._id === id) setViewingOrder({ ...viewingOrder, status });
    } catch {
      toast.error('Dispatch update failed');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':  return 'text-luxury-green bg-luxury-green/10 border-luxury-green/20';
      case 'shipped':    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'processing': return 'text-gold bg-gold/10 border-gold/20';
      case 'confirmed':  return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'cancelled':  return 'text-luxury-red bg-luxury-red/10 border-luxury-red/20';
      default:           return 'text-ivory/40 bg-white/5 border-white/10';
    }
  };

  const handleDownloadPDF = async () => {
    const el = invoiceRef.current;
    if (!el) return;

    // Temporarily make it visible so html2canvas can render it
    el.style.display = 'block';
    el.style.position = 'fixed';
    el.style.top = '-9999px';
    el.style.left = '0';
    el.style.width = '900px';
    el.style.zIndex = '-1';

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 900,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      const imgH = pdfW / ratio;

      // If content is taller than one page, split across pages
      let yOffset = 0;
      let remaining = imgH;
      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, yOffset === 0 ? 0 : -(imgH - remaining), pdfW, imgH);
        remaining -= pdfH;
        if (remaining > 0) {
          pdf.addPage();
          yOffset = imgH - remaining;
        }
      }

      const orderId = viewingOrder._id.slice(-10).toUpperCase();
      pdf.save(`Invoice_${orderId}.pdf`);
    } catch (err) {
      toast.error('PDF generation failed');
      console.error(err);
    } finally {
      el.style.display = 'none';
      el.style.position = '';
      el.style.top = '';
      el.style.left = '';
      el.style.width = '';
      el.style.zIndex = '';
    }
  };

  // Status steps for escalation (lowercase as stored in DB)
  const statusSteps = [
    { value: 'confirmed',  label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped',    label: 'Shipped' },
    { value: 'delivered',  label: 'Delivered' },
    { value: 'cancelled',  label: 'Cancelled' },
  ];

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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/25 group-focus-within:text-gold/60 transition-colors duration-300" size={16} />
            <input
              type="text"
              placeholder="Search by ID, email, or name..."
              className="w-full bg-black-2 border border-gold/20 pl-12 pr-5 py-3.5 rounded-xl text-[11px] font-bold tracking-[2px] uppercase text-gold/80 outline-none placeholder-gold/20 focus:border-gold/50 focus:text-gold focus:bg-black-3 transition-all duration-300"
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
                  {/* Fixed: o.totalAmount instead of o.totalPrice */}
                  <td><span className="text-xs font-bold text-gold tracking-widest">₹{o.totalAmount}</span></td>
                  <td>
                    {/* Fixed: o.status instead of o.orderStatus */}
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${getStatusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                       <button onClick={() => setViewingOrder(o)} className="p-2.5 bg-gold-muted/30 text-gold rounded-lg border border-gold/10 hover:bg-gold hover:text-black transition-all" title="View Details">
                          <Eye size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && !loading && <p className="text-center py-20 text-ivory/20 text-xs italic">No transmissions registered</p>}
          {loading && <p className="text-center py-20 text-ivory/20 text-xs italic">Loading transmissions...</p>}
        </div>
      </div>

      {/* Detail Modal overlay */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="w-full max-w-4xl bg-black-2 border border-gold/20 rounded-3xl overflow-hidden shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto no-scrollbar">
              {/* Modal Header */}
              <div className="p-8 border-b border-gold/10 flex justify-between items-center bg-gold-muted/20">
                 <div>
                    <h2 className="font-heading text-3xl text-ivory tracking-wide italic">Transmission Analysis</h2>
                    <p className="text-[9px] text-gold font-bold uppercase tracking-[4px]">REF: #{viewingOrder._id.slice(-12).toUpperCase()}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    {/* DOWNLOAD PDF BUTTON */}
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-5 py-3 bg-gold text-black text-[10px] font-bold tracking-[2px] uppercase rounded-xl hover:bg-gold/90 transition-all shadow-gold"
                      title="Download PDF Invoice"
                    >
                      <Download size={16} />
                      Download PDF
                    </button>
                    <button onClick={() => setViewingOrder(null)} className="p-2 text-ivory/20 hover:text-gold transition-colors"><XCircle size={24} /></button>
                 </div>
              </div>

              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                 {/* Left: Metadata */}
                 <div className="space-y-10">
                    <div>
                       <h3 className="text-xs font-bold text-gold uppercase tracking-[4px] mb-6 flex items-center gap-2 underline decoration-gold/20">
                          <MapPin size={14} /> Dispatch Destination
                       </h3>
                       <div className="p-6 bg-black border border-gold/5 rounded-xl space-y-2">
                          <p className="text-ivory font-bold text-sm tracking-wider">{viewingOrder.shippingAddress?.name || viewingOrder.user?.name}</p>
                          <p className="text-ivory/60 text-xs leading-loose italic">
                            {/* Fixed: line1 instead of address */}
                            {viewingOrder.shippingAddress?.line1}
                            {viewingOrder.shippingAddress?.line2 && <>, {viewingOrder.shippingAddress.line2}</>}<br />
                            {viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.state}
                            {/* Fixed: pincode instead of postalCode */}
                            {' '}{viewingOrder.shippingAddress?.pincode}<br />
                            <span className="flex items-center gap-2 mt-2 text-gold/60">
                              <Phone size={12} /> {viewingOrder.shippingAddress?.phone}
                            </span>
                          </p>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-xs font-bold text-gold uppercase tracking-[4px] mb-6 flex items-center gap-2 underline decoration-gold/20">
                          <Package size={14} /> Curated Essences
                       </h3>
                       <div className="space-y-6">
                          {viewingOrder.items?.map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                               <div className="w-14 h-16 bg-black border border-gold/5 rounded overflow-hidden">
                                  <img src={item.image} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" alt={item.name} />
                               </div>
                               <div className="grow flex flex-col justify-center">
                                  <h4 className="text-[10px] text-ivory font-bold uppercase tracking-widest mb-1">{item.name}</h4>
                                  <div className="flex justify-between items-center text-[9px] text-ivory/30 tracking-[2px] uppercase">
                                     <span>Qty: {item.qty} {item.size && `× ${item.size}`}</span>
                                     <span className="text-gold font-bold">₹{item.price * item.qty}</span>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Right: Status + Financials */}
                 <div className="space-y-12">
                     <div className="p-8 bg-black rounded-2xl border border-gold/10">
                        <h3 className="text-[10px] font-bold text-ivory uppercase tracking-[4px] mb-8 text-center italic underline decoration-gold/20">Protocol Escalation</h3>
                        <div className="flex flex-col gap-4">
                           {statusSteps.map(({ value, label }) => (
                             <button 
                                key={value}
                                disabled={updating || viewingOrder.status === value}
                                onClick={() => updateStatus(viewingOrder._id, value)}
                                className={`w-full py-4 text-[10px] font-bold tracking-[4px] uppercase border transition-all duration-300 rounded-xl ${viewingOrder.status === value ? 'bg-gold text-black border-gold shadow-gold' : 'bg-gold-muted/10 text-gold/40 border-gold/5 hover:border-gold/30 hover:text-gold'}`}
                             >
                               {/* Fixed: sends lowercase value to API, shows capitalized label in UI */}
                               {viewingOrder.status === value ? `✓ ${label} [Active]` : `Set → ${label}`}
                             </button>
                           ))}
                        </div>
                     </div>

                     {/* Fiscal Summary — Fixed field names */}
                     <div className="pt-10 border-t border-gold/10 space-y-4">
                        <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-[2px]">
                           <span>Items Gross</span>
                           {/* Fixed: itemsTotal instead of itemsPrice */}
                           <span>₹{viewingOrder.itemsTotal}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-[2px]">
                           <span>Curating Fee</span>
                           {/* Fixed: shippingCharge instead of shippingPrice */}
                           <span>₹{viewingOrder.shippingCharge}</span>
                        </div>
                        {viewingOrder.discount > 0 && (
                          <div className="flex justify-between text-[10px] text-luxury-green uppercase tracking-[2px]">
                             <span>Discount</span>
                             <span>−₹{viewingOrder.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t border-gold/10">
                           <span className="text-sm font-bold text-gold uppercase tracking-[4px]">Investment Net</span>
                           {/* Fixed: totalAmount instead of totalPrice */}
                           <span className="text-3xl font-bold text-gold">₹{viewingOrder.totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-[2px]">
                           <span>Payment Method</span>
                           <span className="text-gold">{viewingOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-ivory/40 uppercase tracking-[2px]">
                           <span>Payment Status</span>
                           <span className={viewingOrder.paymentStatus === 'paid' ? 'text-luxury-green font-bold' : 'text-ivory/60'}>{viewingOrder.paymentStatus}</span>
                        </div>
                     </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* ===== PRINTABLE INVOICE (hidden on screen, visible during print) ===== */}
      {viewingOrder && (
        <div id="printable-invoice" ref={invoiceRef} style={{ display: 'none' }}>
          <div style={{ fontFamily: 'Georgia, serif', color: '#111', background: 'white', padding: '48px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', borderBottom: '2px solid #C9A84C', paddingBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '8px', color: '#C9A84C', marginBottom: '4px' }}>INERRANCY</div>
                <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#888', textTransform: 'uppercase' }}>House of Middle Eastern Excellence</div>
                <div style={{ fontSize: '10px', color: '#555', marginTop: '8px' }}>DLF Cyber City, Tower 10 · Gurgaon 122002, India</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#111', letterSpacing: '2px' }}>INVOICE</div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>#{viewingOrder._id.slice(-12).toUpperCase()}</div>
                <div style={{ fontSize: '11px', color: '#555' }}>Date: {new Date(viewingOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '8px' }}>Bill To</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{viewingOrder.shippingAddress?.name || viewingOrder.user?.name}</div>
                <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.8' }}>
                  {viewingOrder.shippingAddress?.line1}{viewingOrder.shippingAddress?.line2 ? `, ${viewingOrder.shippingAddress.line2}` : ''}<br/>
                  {viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.state} – {viewingOrder.shippingAddress?.pincode}<br/>
                  Ph: {viewingOrder.shippingAddress?.phone}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '8px' }}>Order Details</div>
                <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.8' }}>
                  Status: <strong style={{ textTransform: 'capitalize' }}>{viewingOrder.status}</strong><br/>
                  Payment: {viewingOrder.paymentMethod}<br/>
                  Pay Status: <strong>{viewingOrder.paymentStatus}</strong>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f0e8', borderBottom: '2px solid #C9A84C' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555' }}>Size</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555' }}>Unit Price</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {viewingOrder.items?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 'bold' }}>{item.name}<br/><span style={{ fontWeight: 'normal', fontSize: '11px', color: '#777' }}>{item.brand}</span></td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#555' }}>{item.size || '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px' }}>{item.qty}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px' }}>₹{item.price?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold' }}>₹{(item.price * item.qty)?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
              <div style={{ width: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px', color: '#555', borderBottom: '1px solid #eee' }}>
                  <span>Subtotal</span>
                  <span>₹{viewingOrder.itemsTotal?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px', color: '#555', borderBottom: '1px solid #eee' }}>
                  <span>Shipping</span>
                  <span>₹{viewingOrder.shippingCharge?.toLocaleString()}</span>
                </div>
                {viewingOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px', color: 'green', borderBottom: '1px solid #eee' }}>
                    <span>Discount {viewingOrder.couponCode && `(${viewingOrder.couponCode})`}</span>
                    <span>−₹{viewingOrder.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontSize: '18px', fontWeight: 'bold', borderTop: '2px solid #C9A84C', marginTop: '4px' }}>
                  <span>Grand Total</span>
                  <span style={{ color: '#C9A84C' }}>₹{viewingOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '24px', textAlign: 'center', fontSize: '10px', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Thank you for your patronage · support@inerrancy.in · inerrancy.in<br/>
              All prices inclusive of taxes · This is a computer-generated invoice
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrdersPage;
