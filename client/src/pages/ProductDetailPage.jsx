import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Star, ShieldCheck, Truck, RefreshCcw, Minus, Plus, Heart, Share2 } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, updateUser } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLiking, setIsLiking] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    if (!newReview.title || !newReview.comment) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/${product._id}`, newReview);
      toast.success('Testimonial submitted successfully! ✨');
      setReviews([res.data.review, ...reviews]);
      setNewReview({ rating: 5, title: '', comment: '' });
      setReviewModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
        setReviews(res.data.reviews || []);
        setSelectedSize(res.data.product.sizes?.[0] || null);

        // Fetch related products
        const relatedRes = await api.get(`/products?category=${res.data.product.category}&limit=4`);
        setRelatedProducts(relatedRes.data.products.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const isLiked = user?.wishlist?.includes(product?._id);

  const handleToggleWishlist = async () => {
    if (!user) { toast.error('Please login to save favorites'); return; }
    setIsLiking(true);
    try {
      const res = await api.put(`/users/wishlist/${product._id}`);
      updateUser({ ...user, wishlist: res.data.wishlist });
      toast.success(isLiked ? 'Removed from wishlist' : 'Saved to favorites ✨');
    } catch { toast.error('Wishlist update failed'); }
    finally { setIsLiking(false); }
  };

  const handleAddToCart = () => {
    addToCart(product._id, selectedSize?.label || '', qty);
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!product) return <div className="page-loader">Product not found.</div>;

  const currentPrice = selectedSize ? (selectedSize.discountPrice || selectedSize.price) : (product.discountPrice || product.price);
  const originalPrice = selectedSize ? selectedSize.price : product.price;

  return (
    <div className="bg-black min-h-screen pb-20">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-widest text-ivory/30 uppercase mb-12">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold transition-colors">Collection</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-gold transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-28">
          
          {/* Left: Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
              {product.images?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`w-20 lg:w-24 aspect-square bg-black-2 border transition-all duration-300 overflow-hidden shrink-0 ${activeImg === i ? 'border-gold p-1' : 'border-gold/5 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="grow relative aspect-[3/4] bg-black-2 border border-gold/5 group overflow-hidden">
              <img 
                src={product.images?.[activeImg]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <button 
                onClick={handleToggleWishlist}
                disabled={isLiking}
                className={`absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 z-10 ${isLiked ? 'bg-luxury-red text-white' : 'bg-black/40 text-ivory hover:text-gold border border-gold/10'}`}
              >
                <Heart size={20} fill={isLiked ? 'white' : 'transparent'} />
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-[4px] text-gold uppercase mb-3">{product.brand}</span>
            <h1 className="font-heading text-4xl lg:text-6xl text-ivory mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-8 border-b border-gold/10 pb-8">
              <div className="flex items-center gap-2">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.ratings) ? 'currentColor' : 'transparent'} className={i >= Math.floor(product.ratings) ? 'text-charcoal' : ''} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-ivory/60">({product.numReviews} Verified Reviews)</span>
              </div>
              <div className="h-4 w-px bg-gold/20" />
              <span className="text-xs font-bold tracking-widest text-luxury-green uppercase">In Stock</span>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl lg:text-4xl font-bold text-gold">₹{currentPrice}</span>
                {originalPrice > currentPrice && (
                  <span className="text-xl text-ivory/30 line-through">₹{originalPrice}</span>
                )}
                {originalPrice > currentPrice && (
                  <span className="bg-luxury-red text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                    Save {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Price inclusive of all taxes</p>
            </div>

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] font-bold tracking-[3px] uppercase text-gold mb-4">Select Essence Vol.</p>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[100px] border py-3 px-6 text-xs tracking-widest uppercase transition-all duration-300 ${selectedSize?.label === s.label ? 'border-gold bg-gold-muted text-gold' : 'border-gold/20 text-ivory/60 hover:border-gold/60'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-gold/10">
              <div className="flex items-center border border-gold/20 h-14 w-full sm:w-32 bg-black-2">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="grow text-ivory/40 hover:text-gold transition-colors"><Minus size={16} className="mx-auto" /></button>
                <span className="w-10 text-center text-sm font-bold text-ivory font-body">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="grow text-ivory/40 hover:text-gold transition-colors"><Plus size={16} className="mx-auto" /></button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary h-14 grow text-xs font-bold tracking-[3px]"
              >
                ADD TO SELECTION
              </button>
            </div>

            {/* USP List */}
            <div className="flex flex-col gap-6 mb-10">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gold-muted flex items-center justify-center text-gold border border-gold/10">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ivory uppercase tracking-widest mb-1">100% Authentic Guarantee</h4>
                  <p className="text-[10px] text-ivory/40 leading-relaxed">Direct from House of {product.brand}. Factory Sealed.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gold-muted flex items-center justify-center text-gold border border-gold/10">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ivory uppercase tracking-widest mb-1">Priority Luxury Delivery</h4>
                  <p className="text-[10px] text-ivory/40 leading-relaxed">Complimentary Express shipping on all orders over ₹999.</p>
                </div>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-[10px] text-ivory/30 uppercase tracking-[2px]">Share Scent:</span>
              <div className="flex gap-4">
                {[FaInstagram, FaFacebookF, FaTwitter].map((Icon, i) => (
                  <button key={i} className="text-ivory/40 hover:text-gold transition-colors">
                    <Icon size={16} />
                  </button>
                ))}
                <button className="text-ivory/40 hover:text-gold transition-colors"><Share2 size={16} /></button>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Tabs */}
        <section className="mb-28">
          <div className="flex border-b border-gold/10 mb-12 overflow-x-auto no-scrollbar">
            {['description', 'notes', 'specifications', 'reviews'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-8 text-xs font-bold tracking-[3px] uppercase whitespace-nowrap transition-all duration-300 relative ${activeTab === tab ? 'text-gold' : 'text-ivory/40 hover:text-ivory'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold animate-fade-in" />}
              </button>
            ))}
          </div>

          <div className="animate-fade-in py-4">
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <h3 className="font-heading text-3xl text-ivory mb-6 tracking-wide">The Olfactory Narrative</h3>
                <p className="text-ivory/60 leading-loose text-lg font-light mb-8 italic">"{product.shortDescription}"</p>
                <div className="text-ivory/60 leading-loose space-y-6" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
                {product.notes?.top?.length > 0 && (
                  <div className="p-8 bg-black-2 border border-gold/5 rounded-lg flex flex-col items-center text-center group hover:border-gold transition-colors">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-[4px] mb-6">Top Notes</span>
                    <div className="flex flex-col gap-4">
                      {product.notes.top.map((n, i) => <span key={i} className="text-lg text-ivory/80 font-heading tracking-widest">{n}</span>)}
                    </div>
                  </div>
                )}
                {product.notes?.middle?.length > 0 && (
                  <div className="p-8 bg-black-2 border border-gold/5 rounded-lg flex flex-col items-center text-center group hover:border-gold transition-colors scale-105 border-gold/20">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-[4px] mb-6">Heart Notes</span>
                    <div className="flex flex-col gap-4">
                      {product.notes.middle.map((n, i) => <span key={i} className="text-xl text-ivory font-heading tracking-widest">{n}</span>)}
                    </div>
                  </div>
                )}
                {product.notes?.base?.length > 0 && (
                  <div className="p-8 bg-black-2 border border-gold/5 rounded-lg flex flex-col items-center text-center group hover:border-gold transition-colors">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-[4px] mb-6">Base Notes</span>
                    <div className="flex flex-col gap-4">
                      {product.notes.base.map((n, i) => <span key={i} className="text-lg text-ivory/80 font-heading tracking-widest">{n}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-xl">
                <div className="grid grid-cols-2 gap-y-4 border border-gold/10 p-8 rounded-lg">
                  <span className="text-ivory/40 text-xs uppercase tracking-widest">Brand</span>
                  <span className="text-gold font-bold uppercase tracking-wider">{product.brand}</span>
                  <span className="text-ivory/40 text-xs uppercase tracking-widest">Fragrance Family</span>
                  <span className="text-ivory text-sm">{product.fragranceFamily}</span>
                  <span className="text-ivory/40 text-xs uppercase tracking-widest">Suited For</span>
                  <span className="text-ivory text-sm">{product.category}</span>
                  <span className="text-ivory/40 text-xs uppercase tracking-widest">Ideal Occasions</span>
                  <span className="text-ivory text-sm">{product.occasion}</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-4xl">
                 <div className="flex items-center justify-between mb-12">
                    <h3 className="font-heading text-3xl text-ivory tracking-wide">Client Testimonials</h3>
                    <button 
                      onClick={() => {
                        if (!user) {
                          toast.error('Access Restricted. Please log in to leave your feedback.');
                          return;
                        }
                        setReviewModalOpen(true);
                      }}
                      className="btn btn-outline btn-sm font-bold tracking-[2px] hover:border-gold hover:text-gold transition-colors"
                    >
                      Write Review
                    </button>
                 </div>
                
                {reviews.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-gold/10 rounded-lg">
                    <p className="text-ivory/40 text-sm italic">Be the first to share your olfactory experience with this masterpiece.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-10">
                    {reviews.map((rev, i) => (
                      <div key={i} className="flex gap-6 border-b border-gold/5 pb-10 last:border-0 translate-up">
                        <div className="w-14 h-14 rounded-full bg-black-3 border border-gold/20 flex items-center justify-center text-gold font-heading text-2xl overflow-hidden shrink-0">
                          {rev.user?.avatar ? <img src={rev.user.avatar} className="w-full h-full object-cover" /> : rev.user?.name?.[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                             <span className="text-gold font-bold text-xs uppercase tracking-widest">{rev.user?.name}</span>
                             <div className="flex text-gold text-[10px]">
                                {[...Array(5)].map((_, j) => <Star key={j} size={10} fill={j < rev.rating ? 'currentColor' : 'transparent'} />)}
                             </div>
                             <span className="text-[10px] text-ivory/30 uppercase">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h5 className="text-ivory font-bold text-sm mb-3 tracking-wide">{rev.title}</h5>
                          <p className="text-ivory/60 text-sm leading-relaxed mb-4">{rev.comment}</p>
                          {rev.images?.length > 0 && (
                            <div className="flex gap-2">
                               {rev.images.map((img, idx) => <img key={idx} src={img} className="w-20 aspect-square object-cover border border-gold/10" />)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="section-sm">
            <div className="flex justify-between items-end mb-16">
              <div>
                 <span className="section-label">Aromatic Kinship</span>
                 <h2 className="section-title">You May Also Envy</h2>
              </div>
              <Link to="/shop" className="text-xs font-bold tracking-[3px] text-gold uppercase hover:underline">Explore All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}

      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-gold/20 p-8 md:p-10 rounded-lg max-w-lg w-full relative animate-fade-in shadow-2xl">
            <button 
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-6 right-6 text-ivory/50 hover:text-gold text-lg transition-colors font-sans"
            >
              ✕
            </button>
            <h3 className="font-heading text-2xl text-gold mb-2 uppercase tracking-widest">Share Your Olfactory Journey</h3>
            <p className="text-ivory/40 text-[10px] uppercase tracking-[2px] mb-8">Your feedback helps sustain the circle of excellence</p>
            
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label font-bold tracking-[2px] text-xs text-gold uppercase mb-3 block">Your Rating</label>
                <div className="flex gap-3 text-gold">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform duration-200 hover:scale-125 focus:outline-none"
                    >
                      <Star 
                        size={28} 
                        fill={(hoverRating || newReview.rating) >= star ? 'currentColor' : 'transparent'} 
                        className={(hoverRating || newReview.rating) >= star ? 'text-gold' : 'text-charcoal'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label font-bold tracking-[2px] text-xs text-gold uppercase mb-2 block">Review Title</label>
                <input 
                  type="text"
                  required
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="e.g. Masterpiece of Liquid Gold"
                  className="luxury-input h-12 w-full"
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold tracking-[2px] text-xs text-gold uppercase mb-2 block">Detailed Testimonial</label>
                <textarea 
                  required
                  rows="4"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Describe the notes, the sillage, the longevity, and your overall sensory experience..."
                  className="luxury-input w-full p-4 h-32 bg-black/50 border border-gold/10 text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none rounded"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="btn btn-outline w-1/2 h-12 text-[10px] tracking-[2px] font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn btn-primary w-1/2 h-12 text-[10px] tracking-[2px] font-bold uppercase"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
