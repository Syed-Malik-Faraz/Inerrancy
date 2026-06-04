import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Image as ImageIcon, X, 
  Save, ArrowLeft, Filter, MoreVertical, Star, Check 
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    shortDescription: '',
    price: '',
    discountPrice: '',
    category: 'Unisex',
    fragranceFamily: 'Woody',
    occasion: 'Daily Wear',
    collection: 'Best Sellers',
    stock: '',
    isFeatured: false,
    notes: { top: [], middle: [], base: [] }
  });

  const [previewImages, setPreviewImages] = useState([]); // Cloudinary URLs
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products?keyword=${search}&limit=100`);
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to fetch vault contents');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value.split(',') } });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingImages(true);
    try {
      const formDataImages = new FormData();
      files.forEach(img => formDataImages.append('images', img));
      const uploadRes = await api.post('/upload/multiple', formDataImages, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPreviewImages(prev => [...prev, ...uploadRes.data.urls]);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      ...product,
      notes: {
        top: product.notes?.top || [],
        middle: product.notes?.middle || [],
        base: product.notes?.base || []
      }
    });
    setPreviewImages(product.images || []);
    setFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '', brand: '', description: '', shortDescription: '',
      price: '', discountPrice: '', category: 'Unisex',
      fragranceFamily: 'Woody', occasion: 'Daily Wear',
      collection: 'Best Sellers', stock: '', isFeatured: false,
      notes: { top: [], middle: [], base: [] }
    });
    setPreviewImages([]);
    setUploadingImages(false);
    setFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = toast.loading('Adding Product...');

    try {
      const productToSave = { ...formData, images: previewImages };

      if (editingId) {
        await api.put(`/products/${editingId}`, productToSave);
        toast.success('Masterpiece Updated', { id });
      } else {
        await api.post('/products', productToSave);
        toast.success('Masterpiece Registered', { id });
      }

      window.dispatchEvent(new Event('brands-updated'));
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed', { id });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you certain you wish to void this masterpiece from the vault?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Masterpiece Voided');
      fetchProducts();
    } catch {
      toast.error('Destruction failed');
    }
  };

  return (
    <div className="space-y-20 lg:space-y-32 pb-20">
      
      {!formOpen ? (
        <>
          <header className="header-vault flex flex-col md:flex-row justify-between items-end">
            <div>
              <h1 className="title-vault">Masterpiece Inventory</h1>
              <p className="label-vault">Manage the Inerrancy luxury fragrance portfolio</p>
            </div>
            <button 
              onClick={() => setFormOpen(true)}
              className="btn btn-primary px-8 h-12 text-[10px] tracking-[4px] font-bold"
            >
              <Plus size={16} /> ADD NEW MASTERPIECE
            </button>
          </header>

          <div className="card-vault overflow-hidden">
          <div className="flex flex-wrap gap-4 mb-16 justify-between items-center px-4">
                <div className="relative group w-full md:w-96">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/25 group-focus-within:text-gold/60 transition-colors duration-300" size={16} />
                   <input
                     type="text"
                     placeholder="Search by name, brand, tag..."
                     className="w-full bg-black-2 border border-gold/20 pl-12 pr-5 py-3.5 rounded-xl text-[11px] font-bold tracking-[2px] uppercase text-gold/80 outline-none placeholder-gold/20 focus:border-gold/50 focus:text-gold focus:bg-black-3 transition-all duration-300"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                   />
                </div>
                <div className="flex gap-4">
                   <button className="p-3 bg-black border border-gold/10 rounded-xl text-ivory/40 hover:text-gold transition-all"><Filter size={18} /></button>
                   <button className="p-3 bg-black border border-gold/10 rounded-xl text-ivory/40 hover:text-gold transition-all"><MoreVertical size={18} /></button>
                </div>
             </div>

             <div className="table-wrapper">
                <table className="table-vault">
                   <thead>
                      <tr>
                         <th>Product Details</th>
                         <th>Category / Family</th>
                         <th>Stock Context</th>
                         <th>Fiscal Value</th>
                         <th>Featured</th>
                         <th>Actions</th>
                      </tr>
                   </thead>
                   <tbody>
                      {products.map((p) => (
                        <tr key={p._id}>
                           <td className="!py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-16 h-20 bg-black rounded border border-gold/10 overflow-hidden flex items-center justify-center shrink-0">
                                    {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gold/20" />}
                                 </div>
                                 <div>
                                    <p className="text-[10px] text-gold font-bold uppercase tracking-[2px] mb-1">{p.brand}</p>
                                    <p className="text-sm font-bold text-ivory uppercase tracking-widest">{p.name}</p>
                                    <p className="text-[9px] text-ivory/20 mt-1 uppercase">ID: {p._id.slice(-8)}</p>
                                 </div>
                              </div>
                           </td>
                           <td>
                              <div className="flex flex-col gap-1">
                                 <span className="text-[10px] text-ivory/60 font-bold uppercase tracking-wider">{p.category}</span>
                                 <span className="text-[10px] text-gold font-bold uppercase tracking-wider opacity-60 italic">{p.fragranceFamily}</span>
                              </div>
                           </td>
                           <td>
                              <div className="flex items-center gap-3">
                                 <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-luxury-green' : p.stock > 0 ? 'bg-warning' : 'bg-luxury-red'}`} />
                                 <span className="text-xs font-bold text-ivory/60 uppercase tracking-widest">{p.stock} units</span>
                              </div>
                           </td>
                           <td>
                              <div className="flex flex-col">
                                 <span className="text-xs font-bold text-gold uppercase tracking-widest transition-all">₹{p.discountPrice || p.price}</span>
                                 {p.discountPrice && <span className="text-[9px] text-ivory/20 line-through">₹{p.price}</span>}
                              </div>
                           </td>
                           <td>
                              {p.isFeatured ? <Check size={16} className="text-gold" /> : <X size={16} className="text-ivory/10" />}
                           </td>
                           <td>
                              <div className="flex gap-2">
                                 <button onClick={() => handleEdit(p)} className="p-2.5 bg-gold-muted/30 text-gold rounded-lg border border-gold/10 hover:bg-gold hover:text-black transition-all">
                                    <Edit2 size={14} />
                                 </button>
                                 <button onClick={() => handleDelete(p._id)} className="p-2.5 bg-luxury-red/10 text-luxury-red rounded-lg border border-luxury-red/10 hover:bg-luxury-red hover:text-white transition-all">
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </>
      ) : (
        <div className="animate-fade-in max-w-5xl mx-auto">
           <button onClick={resetForm} className="flex items-center gap-3 text-[10px] font-bold text-gold uppercase tracking-[4px] mb-10 hover:gap-6 transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1" /> Return to Archives
           </button>

           <form onSubmit={handleSubmit} className="bg-black-2 border border-gold/10 p-10 lg:p-14 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold" />
              <h2 className="font-heading text-4xl text-ivory mb-12 tracking-wide uppercase">{editingId ? 'Refine Masterpiece' : 'Register New Masterpiece'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                 <div className="form-group">
                    <label className="form-label">Essence Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="luxury-input" placeholder="e.g. Oud Royale" />
                 </div>
                 <div className="form-group">
                    <label className="form-label">House Brand</label>
                    <input type="text" name="name" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required className="luxury-input" placeholder="e.g. Inerrancy" />
                 </div>
                 <div className="form-group md:col-span-2">
                    <label className="form-label">Fiscal Short Description</label>
                    <input 
                      type="text" 
                      name="shortDescription" 
                      value={formData.shortDescription} 
                      onChange={handleInputChange} 
                      required 
                      className="luxury-input italic" 
                      placeholder="The evocative soul of the Middle East..." 
                    />
                 </div>
                 <div className="form-group md:col-span-2">
                    <label className="form-label">Olfactory Narrative (Description)</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      required 
                      rows="6" 
                      className="luxury-input py-4 font-light leading-relaxed" 
                      placeholder="Detailed masterpiece description..."
                    />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Base Price (INR)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="luxury-input" placeholder="e.g. 5999" />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Exchange Price (Discounted - Optional)</label>
                    <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} className="luxury-input border-luxury-green/30" placeholder="e.g. 4999" />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Available Essence Vol. (Stock)</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="luxury-input font-bold text-gold" placeholder="Units available" />
                 </div>
                 <div className="form-group flex items-end">
                    <label className="flex items-center gap-4 p-4 border border-gold/10 rounded-xl cursor-pointer w-full group transition-all hover:bg-gold-muted/20">
                       <input 
                        type="checkbox" 
                        name="isFeatured" 
                        checked={formData.isFeatured} 
                        onChange={handleInputChange} 
                        className="w-5 h-5 accent-gold" 
                       />
                       <span className="text-[11px] font-bold text-ivory uppercase tracking-[3px] group-hover:text-gold transition-colors flex items-center gap-2 underline decoration-gold/20">
                          <Star size={14} className={formData.isFeatured ? 'fill-gold text-gold' : ''} /> ELEVATE TO FEATURED
                       </span>
                    </label>
                 </div>
              </div>

              {/* Dynamic Categorization */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gold/10 mb-12">
                 {[
                   { label: 'Client Focus', name: 'category', options: ['Men', 'Women', 'Unisex'] },
                   { label: 'Fragrance Family', name: 'fragranceFamily', options: ['Sweet', 'Fresh', 'Woody', 'Spicy', 'Floral', 'Fruity', 'Aqua', 'Oriental'] },
                   { label: 'Prime Occasion', name: 'occasion', options: ['Party & Evening', 'Date Night', 'Daily Wear', 'Office Wear', 'Winter Warmth'] },
                   { label: 'Exhibition', name: 'collection', options: ['Best Sellers', 'New Arrivals', 'Gift Sets', 'Luxury', 'Viral Hits'] },
                 ].map((select) => (
                   <div key={select.name} className="form-group">
                      <label className="form-label">{select.label}</label>
                      <select 
                        name={select.name} 
                        value={formData[select.name]} 
                        onChange={handleInputChange} 
                        className="form-select text-[11px] font-bold tracking-widest"
                      >
                         {select.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                   </div>
                 ))}
              </div>

              {/* Notes Matrix */}
              <div className="mb-12">
                 <h3 className="text-xs font-bold text-gold uppercase tracking-[4px] mb-8 border-b border-gold/10 pb-4">Olfactory Matrix (Notes)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['top', 'middle', 'base'].map(note => (
                      <div key={note} className="form-group">
                         <label className="form-label uppercase">{note} Notes (Comma Separated)</label>
                         <input 
                           type="text" 
                           name={`notes.${note}`}
                           value={formData.notes[note]?.join(', ')}
                           onChange={handleInputChange}
                           className="luxury-input py-4 text-[11px]"
                           placeholder={`e.g. ${note === 'top' ? 'Oud, Bergamot' : note === 'middle' ? 'Rose, Saffron' : 'Musk, Amber'}`}
                         />
                      </div>
                    ))}
                 </div>
              </div>

              {/* Imagery */}
              <div className="mb-16">
                 <h3 className="text-xs font-bold text-gold uppercase tracking-[4px] mb-8 border-b border-gold/10 pb-4">Visual Archives (Images)</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {previewImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gold/20 group">
                         <img src={img} className="w-full h-full object-cover" />
                         <button 
                          type="button" 
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-luxury-red/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white font-bold text-[10px] tracking-widest uppercase"
                         >
                            VOID IMAGE
                         </button>
                      </div>
                    ))}
                    <label className={`aspect-square rounded-xl border-2 border-dashed border-gold/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gold-muted/10 hover:border-gold/50 transition-all text-gold group ${uploadingImages ? 'opacity-50 pointer-events-none' : ''}`}>
                       {uploadingImages ? <div className="spinner spinner-sm" /> : <ImageIcon size={32} className="opacity-20 group-hover:opacity-100 transition-opacity" />}
                       <span className="text-[9px] font-bold uppercase tracking-[2px]">{uploadingImages ? 'UPLOADING...' : 'UPLOAD ASSET'}</span>
                       <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" disabled={uploadingImages} />
                    </label>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button 
                  type="submit" 
                  disabled={loading}
                  className="grow btn btn-primary h-14 text-[12px] font-bold tracking-[6px] flex items-center justify-center gap-4"
                 >
                    {loading ? <><div className="spinner spinner-sm !border-black" /> ADDING PRODUCT...</> : <><Save size={18} /> ADD PRODUCT</>}
                 </button>
                 <button 
                  type="button"
                  onClick={resetForm}
                  className="btn btn-ghost px-10 h-14"
                 >
                    ABANDON
                 </button>
              </div>
           </form>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;
