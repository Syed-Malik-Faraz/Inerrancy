import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Star, Trash2, CheckCircle2, 
  XCircle, User, Filter, Search, Image as ImageIcon
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [search]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reviews?keyword=${search}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      toast.error('Failed to retrieve client testimonials');
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id) => {
    try {
      await api.put(`/reviews/${id}/approve`);
      toast.success('Testimonial Approved for Exhibition');
      fetchReviews();
    } catch {
      toast.error('Approval failed');
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Void this client testimonial permanently?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Testimonial Voided');
      fetchReviews();
    } catch {
      toast.error('Operation failed');
    }
  };

  return (
    <div className="space-y-20 lg:space-y-32 pb-20">
      <header className="header-vault">
        <div>
          <h1 className="title-vault">Client Testimonials</h1>
          <p className="label-vault">Moderate and curate olfactory reviews and ratings</p>
        </div>
      </header>

      <div className="card-vault overflow-hidden">
        <div className="flex flex-wrap gap-4 mb-20 justify-between items-center px-4">
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/25 group-focus-within:text-gold/60 transition-colors duration-300" size={16} />
            <input
              type="text"
              placeholder="Search by client, product, content..."
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
                <th>Testimonial Source</th>
                <th>Exhibition Item</th>
                <th>Olfactory Impression</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="group">
                  <td>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-gold-muted border border-gold/10 flex items-center justify-center text-gold font-bold overflow-hidden shrink-0 uppercase">
                          {r.user?.name?.[0]}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-ivory uppercase tracking-widest">{r.user?.name}</p>
                          <p className="text-[9px] text-ivory/20 uppercase tracking-[2px]">{new Date(r.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gold font-bold uppercase tracking-[2px] mb-1">{r.product?.brand}</span>
                       <span className="text-xs font-bold text-ivory/60 uppercase tracking-widest truncate max-w-[150px]">{r.product?.name}</span>
                    </div>
                  </td>
                  <td className="max-w-md">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-1 text-gold text-[10px]">
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < r.rating ? 'currentColor' : 'transparent'} className={i >= r.rating ? 'text-charcoal' : ''} />)}
                       </div>
                       <p className="text-ivory/80 text-[11px] font-bold uppercase tracking-wider truncate mb-1">{r.title}</p>
                       <p className="text-[10px] text-ivory/30 leading-relaxed line-clamp-2 italic uppercase">"{r.comment}"</p>
                       {r.images?.length > 0 && (
                         <div className="flex gap-1 mt-2">
                            {r.images.map((img, i) => <div key={i} className="w-8 h-8 rounded border border-gold/10 overflow-hidden"><img src={img} className="w-full h-full object-cover" /></div>)}
                         </div>
                       )}
                    </div>
                  </td>
                  <td>
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${r.isApproved ? 'text-luxury-green bg-luxury-green/10 border-luxury-green/20' : 'text-gold-muted bg-gold-muted/10 border-gold/10'}`}>
                      {r.isApproved ? 'Exhibited' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                       {!r.isApproved && (
                         <button onClick={() => approveReview(r._id)} className="p-2.5 bg-luxury-green/10 text-luxury-green rounded-lg border border-luxury-green/10 hover:bg-luxury-green hover:text-white transition-all" title="Approve Exhibition">
                            <CheckCircle2 size={14} />
                         </button>
                       )}
                       <button onClick={() => deleteReview(r._id)} className="p-2.5 bg-luxury-red/10 text-luxury-red rounded-lg border border-luxury-red/10 hover:bg-luxury-red hover:text-white transition-all" title="Void Testimonial">
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviews.length === 0 && !loading && (
             <p className="text-center py-20 text-ivory/20 text-xs italic tracking-widest">No client testimonials registered in vault</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminReviewsPage;
