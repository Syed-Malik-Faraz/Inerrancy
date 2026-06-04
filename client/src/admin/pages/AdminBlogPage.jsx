import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Search, Edit2, Trash2, 
  Eye, Save, ArrowLeft, Image as ImageIcon, 
  Calendar, User, Clock, CheckCircle2
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: 'Inerrancy Curators',
    image: '',
    tags: '',
    readTime: '5 min',
    isPublished: true
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs/admin');
      setBlogs(res.data.blogs);
    } catch (err) {
      toast.error('Failed to retrieve editorial archives');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const imgData = new FormData();
      imgData.append('image', file);
      const uploadRes = await api.post('/upload', imgData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPreviewImage(uploadRes.data.url);
      setFormData(prev => ({ ...prev, image: uploadRes.data.url }));
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = toast.loading('Publishing to Archives...');

    try {
      const blogData = {
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags
      };

      if (editingId) {
        await api.put(`/blogs/${editingId}`, blogData);
        toast.success('Editorial Refined', { id });
      } else {
        await api.post('/blogs', blogData);
        toast.success('Editorial Published', { id });
      }

      resetForm();
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed', { id });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (b) => {
    setEditingId(b._id);
    setFormData({
      ...b,
      author: b.author?.name || b.author,
      tags: Array.isArray(b.tags) ? b.tags.join(', ') : b.tags
    });
    setPreviewImage(b.image);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Void this editorial permanently from the archives?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Editorial Voided');
      fetchBlogs();
    } catch {
      toast.error('Operation failed');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', content: '', excerpt: '', author: 'Inerrancy Curators', image: '', tags: '', readTime: '5 min', isPublished: true });
    setPreviewImage(null);
    setUploadingImage(false);
    setFormOpen(false);
  };

  return (
    <div className="space-y-20 lg:space-y-32 pb-20">
      
      <header className="header-vault flex flex-col md:flex-row justify-between items-end">
        <div>
          <h1 className="title-vault">Editorial Archives</h1>
          <p className="label-vault">Curate and publish olfactory narratives and scent stories</p>
        </div>
        {!formOpen && (
          <button 
            onClick={() => setFormOpen(true)}
            className="btn btn-primary px-8 h-12 text-[10px] tracking-[4px] font-bold"
          >
            <Plus size={16} /> COMMENCE NEW STORY
          </button>
        )}
      </header>

      {formOpen ? (
        <div className="animate-fade-in max-w-5xl mx-auto">
           <button onClick={resetForm} className="flex items-center gap-3 text-[10px] font-bold text-gold uppercase tracking-[4px] mb-10 hover:gap-6 transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1" /> Return to Archives
           </button>

           <form onSubmit={handleSubmit} className="bg-black-2 border border-gold/10 p-10 lg:p-14 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold" />
              <h2 className="font-heading text-4xl text-ivory mb-12 tracking-wide uppercase">{editingId ? 'Refine Editorial' : 'Compose Editorial'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                 <div className="form-group md:col-span-2">
                    <label className="form-label">Narrative Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="luxury-input font-heading text-2xl lowercase italic" placeholder="e.g. the art of oud curation" />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Permanent Slug (lowercase/dashes)</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required className="luxury-input text-xs tracking-widest text-gold/60" placeholder="e.g. art-of-oud-curation" />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Estimated Read Duration</label>
                    <input type="text" name="readTime" value={formData.readTime} onChange={handleInputChange} className="luxury-input" placeholder="e.g. 7 min" />
                 </div>
                 <div className="form-group md:col-span-2">
                    <label className="form-label">Olfactory Excerpt (Appears in List)</label>
                    <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} required rows="3" className="luxury-input py-4 text-sm" placeholder="A brief evocative summary..." />
                 </div>
                 <div className="form-group md:col-span-2">
                    <label className="form-label">Main Editorial Content (HTML/Rich-Text Supported)</label>
                    <textarea name="content" value={formData.content} onChange={handleInputChange} required rows="12" className="luxury-input py-6 text-base tracking-wide leading-loose" placeholder="The soul of the story..." />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Tags (Comma Separated)</label>
                    <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="luxury-input text-[10px] tracking-widest uppercase" placeholder="e.g. oud, luxury, mastery" />
                 </div>
                 <div className="form-group flex items-end">
                    <label className="flex items-center gap-4 p-4 border border-gold/10 rounded-xl cursor-pointer w-full group transition-all hover:bg-gold-muted/10">
                       <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} className="w-5 h-5 accent-gold" />
                       <span className="text-[10px] font-bold text-ivory uppercase tracking-[3px] group-hover:text-gold transition-colors">EXHIBIT IN PUBLIC ARCHIVES</span>
                    </label>
                 </div>
              </div>

              {/* Image Upload */}
              <div className="mb-16">
                 <label className="form-label mb-6">Visual Essence (Main Image)</label>
                 <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-80 aspect-video rounded-2xl bg-black border border-gold/10 overflow-hidden relative group">
                       {previewImage ? (
                         <img src={previewImage} className="w-full h-full object-cover" />
                       ) : (
                         <label className="w-full h-full flex flex-col items-center justify-center text-ivory/10 gap-3 italic cursor-pointer hover:text-ivory/30 transition-colors">
                            {uploadingImage ? <div className="spinner spinner-sm" /> : <ImageIcon size={48} />}
                            <span className="text-[10px] tracking-widest uppercase">{uploadingImage ? 'Uploading...' : 'Click to Upload'}</span>
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" disabled={uploadingImage} />
                         </label>
                       )}
                       <label className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-all cursor-pointer text-gold text-[10px] font-bold tracking-[4px] uppercase ${uploadingImage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          {uploadingImage ? <div className="spinner spinner-sm" /> : 'CHANGE IMAGE'}
                          <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" disabled={uploadingImage} />
                       </label>
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-4">
                       <p className="text-[10px] text-ivory/30 uppercase tracking-[2px] leading-relaxed">Recommended dimensions: 1920x1080px. Use high-resolution, evocative imagery to match the editorial tone.</p>
                       <p className="text-[10px] text-gold/60 uppercase tracking-[4px] flex items-center gap-2"><CheckCircle2 size={12} /> Auto-compressed for performance</p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button type="submit" disabled={loading} className="grow btn btn-primary h-14 text-[12px] font-bold tracking-[6px] uppercase flex items-center justify-center gap-4">
                    {loading ? 'SYNCHRONIZING...' : <><Save size={18} /> PUBLISH TO VAULT</>}
                 </button>
                 <button type="button" onClick={resetForm} className="btn btn-ghost px-10">CANCEL</button>
              </div>
           </form>
        </div>
      ) : (
        <div className="card-vault overflow-hidden pt-10">
           <div className="table-wrapper">
              <table className="table-vault">
                 <thead>
                    <tr>
                       <th>Editorial Profile</th>
                       <th>Publication Context</th>
                       <th>Temporal Stamp</th>
                       <th>Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {blogs.map((b) => (
                      <tr key={b._id} className="group">
                         <td className="!py-6">
                            <div className="flex items-center gap-6">
                               <div className="w-24 h-16 bg-black rounded-xl border border-gold/10 overflow-hidden shrink-0">
                                  <img src={b.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                               </div>
                               <div>
                                  <h4 className="text-sm font-bold text-ivory uppercase tracking-widest mb-1 group-hover:text-gold transition-colors">{b.title}</h4>
                                  <div className="flex items-center gap-3 text-[9px] text-ivory/30 uppercase tracking-[2px] font-bold">
                                     <span className="flex items-center gap-1"><User size={10} /> {b.author?.name || b.author}</span>
                                     <span>•</span>
                                     <span className="flex items-center gap-1"><Clock size={10} /> {b.readTime}</span>
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td>
                            <div className="flex flex-wrap gap-2">
                               {b.isPublished ? (
                                 <span className="text-[9px] bg-luxury-green/10 text-luxury-green border border-luxury-green/20 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Exhibited</span>
                               ) : (
                                 <span className="text-[9px] bg-white/5 text-ivory/20 border border-white/10 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Archived</span>
                               )}
                               {b.tags?.slice(0, 2).map(t => <span key={t} className="text-[9px] text-gold/40 lowercase italic font-bold">#{t}</span>)}
                            </div>
                         </td>
                         <td>
                            <span className="text-[10px] text-ivory/40 uppercase tracking-widest">{new Date(b.createdAt).toLocaleDateString()}</span>
                         </td>
                         <td>
                            <div className="flex gap-3">
                               <button onClick={() => handleEdit(b)} className="p-2.5 bg-gold-muted/30 text-gold rounded-lg border border-gold/10 hover:bg-gold hover:text-black transition-all">
                                  <Edit2 size={14} />
                               </button>
                               <button onClick={() => handleDelete(b._id)} className="p-2.5 bg-luxury-red/10 text-luxury-red rounded-lg border border-luxury-red/10 hover:bg-luxury-red hover:text-white transition-all">
                                  <Trash2 size={14} />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
              {blogs.length === 0 && !loading && (
                 <p className="text-center py-24 text-ivory/20 text-xs italic tracking-widest uppercase">The editorial vault is currently empty</p>
              )}
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminBlogPage;
