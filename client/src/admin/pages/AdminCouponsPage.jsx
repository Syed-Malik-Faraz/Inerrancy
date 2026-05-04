import React, { useState, useEffect } from 'react';
import { 
  Ticket, Plus, Search, Edit2, Trash2, 
  Calendar, CheckCircle2, XCircle, ArrowRight, Tag
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: '',
    minOrderAmount: '0',
    expiryDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data.coupons);
    } catch (err) {
      toast.error('Failed to retrieve discount archives');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/coupons/${editingId}`, formData);
        toast.success('Discount Protocol Updated');
      } else {
        await api.post('/coupons', formData);
        toast.success('Discount Protocol Registered');
      }
      resetForm();
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setFormData({
      ...c,
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : ''
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Void this discount protocol permanently?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Protocol Voided');
      fetchCoupons();
    } catch {
      toast.error('Operation failed');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ code: '', discountType: 'percentage', discountAmount: '', minOrderAmount: '0', expiryDate: '', isActive: true });
    setFormOpen(false);
  };

  return (
    <div className="space-y-20 lg:space-y-32 pb-20">
      
      <header className="header-vault flex flex-col md:flex-row justify-between items-end">
        <div>
          <h1 className="title-vault">Discount Protocols</h1>
          <p className="label-vault">Manage exchange incentives and promotional keycodes</p>
        </div>
        <button 
          onClick={() => setFormOpen(true)}
          className="btn btn-primary px-8 h-12 text-[10px] tracking-[4px] font-bold"
        >
          <Plus size={16} /> REGISTER NEW COUPON
        </button>
      </header>

      {formOpen ? (
        <div className="animate-fade-in max-w-2xl mx-auto">
           <form onSubmit={handleSubmit} className="bg-black-2 border border-gold/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold" />
              <h2 className="font-heading text-3xl text-ivory mb-10 tracking-wide uppercase">{editingId ? 'Refine Protocol' : 'Initial Protocol'}</h2>
              
              <div className="space-y-8">
                 <div className="form-group">
                    <label className="form-label">Exchange Keycode (Code)</label>
                    <input type="text" name="code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} required className="luxury-input font-bold tracking-[4px]" placeholder="e.g. LUXURY50" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="form-group">
                       <label className="form-label">Benefit Type</label>
                       <select name="discountType" value={formData.discountType} onChange={handleInputChange} className="form-select text-[11px] font-bold uppercase">
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Val (INR)</option>
                       </select>
                    </div>
                    <div className="form-group">
                       <label className="form-label">Benefit Value</label>
                       <input type="number" name="discountAmount" value={formData.discountAmount} onChange={handleInputChange} required className="luxury-input" placeholder="e.g. 10" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="form-group">
                       <label className="form-label">Min Threshold (INR)</label>
                       <input type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleInputChange} className="luxury-input" placeholder="e.g. 1999" />
                    </div>
                    <div className="form-group">
                       <label className="form-label">Cease Date (Expiry)</label>
                       <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required className="luxury-input" />
                    </div>
                 </div>

                 <div className="flex items-center gap-4 p-4 border border-gold/10 rounded-xl">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-5 h-5 accent-gold" />
                    <span className="text-[10px] font-bold text-ivory uppercase tracking-[3px]">PROTOCOL ACTIVE</span>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={loading} className="grow btn btn-primary h-14 text-[11px] font-bold tracking-[4px] uppercase shadow-gold">
                       {loading ? 'SYNCHRONIZING...' : 'SAVE PROTOCOL'}
                    </button>
                    <button type="button" onClick={resetForm} className="btn btn-ghost px-10">ABANDON</button>
                 </div>
              </div>
           </form>
        </div>
      ) : (
        <div className="card-vault overflow-hidden pt-10">
           <div className="table-wrapper">
              <table className="table-vault">
                 <thead>
                    <tr>
                       <th>Protocol Code</th>
                       <th>Benefit Structure</th>
                       <th>Temporal Validity</th>
                       <th>Client Status</th>
                       <th>Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {coupons.map((c) => (
                      <tr key={c._id} className="group">
                         <td>
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-lg bg-gold-muted border border-gold/10 flex items-center justify-center text-gold">
                                  <Tag size={18} />
                               </div>
                               <span className="text-xs font-bold text- gold uppercase tracking-[4px]">{c.code}</span>
                            </div>
                         </td>
                         <td>
                            <div className="flex flex-col">
                               <span className="text-xs font-bold text-ivory uppercase tracking-widest">{c.discountAmount}{c.discountType === 'percentage' ? '%' : ' INR'} OFF</span>
                               <span className="text-[9px] text-ivory/20 uppercase tracking-[2px]">Threshold: ₹{c.minOrderAmount}</span>
                            </div>
                         </td>
                         <td>
                            <div className="flex items-center gap-2 text-[10px] text-ivory/40 uppercase tracking-widest">
                               <Calendar size={12} className="text-gold/30" /> {new Date(c.expiryDate).toLocaleDateString()}
                            </div>
                         </td>
                         <td>
                            <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${c.isActive ? 'text-luxury-green bg-luxury-green/10 border-luxury-green/20 shadow-green' : 'text-luxury-red bg-luxury-red/10 border-luxury-red/20'}`}>
                               {c.isActive ? 'Active' : 'Ceased'}
                            </span>
                         </td>
                         <td>
                            <div className="flex gap-3">
                               <button onClick={() => handleEdit(c)} className="p-2.5 bg-gold-muted/30 text-gold rounded-lg border border-gold/10 hover:bg-gold hover:text-black transition-all">
                                  <Edit2 size={14} />
                               </button>
                               <button onClick={() => handleDelete(c._id)} className="p-2.5 bg-luxury-red/10 text-luxury-red rounded-lg border border-luxury-red/10 hover:bg-luxury-red hover:text-white transition-all">
                                  <Trash2 size={14} />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
              {coupons.length === 0 && !loading && <p className="text-center py-20 text-ivory/20 text-xs italic tracking-widest">No discount protocols found</p>}
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminCouponsPage;
