import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star, Eye } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { user, updateUser } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await api.get('/users/wishlist');
        setWishlist(res.data.wishlist);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.put(`/users/wishlist/${productId}`);
      updateUser({ ...user, wishlist: res.data.wishlist });
      setWishlist(wishlist.filter(p => p._id !== productId));
      toast.success('Removed from collection');
    } catch {
      toast.error('Operation failed');
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
              <span className="text-gold">Favorites</span>
            </nav>
            <h1 className="font-heading text-4xl lg:text-5xl text-ivory italic">Saved Masterpieces</h1>
            <p className="text-ivory/40 text-xs tracking-wider uppercase mt-4">Your personal curation of desired essences</p>
          </div>
          <Link to="/shop" className="btn btn-outline min-w-[200px] group">
            EXPAND COLLECTION <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-gold/10 rounded-2xl bg-black-2 animate-fade-in relative overflow-hidden">
             <div className="absolute inset-0 bg-gold/5 blur-3xl -z-10" />
             <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mb-8 mx-auto border border-gold/10 relative">
                <Heart size={32} className="text-gold opacity-10" />
             </div>
             <h3 className="font-heading text-2xl text-ivory mb-2 tracking-wide">Empty Archive</h3>
             <p className="text-ivory/40 text-xs uppercase tracking-widest mb-10">You haven't marked any essences for your collection yet</p>
             <Link to="/shop" className="btn btn-primary px-12 uppercase tracking-[4px]">DISCOVER ESSENCES</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product._id} className="group relative animate-fade-up">
                 {/* Similar to ProductCard but with a remove button overlay */}
                 <div className="relative aspect-[3/4] overflow-hidden bg-black-2 border border-gold/5 transition-all duration-500 hover:border-gold/20">
                    <Link to={`/product/${product._id}`} className="block h-full w-full">
                       <img src={product.images?.[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </Link>
                    <button 
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-ivory/40 hover:text-luxury-red transition-all duration-300 z-20 border border-gold/10"
                    >
                       <Trash2 size={16} />
                    </button>
                    <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                       <button 
                        onClick={() => addToCart(product._id)}
                        className="w-full btn btn-primary py-3 text-[10px] font-bold tracking-[2px] uppercase flex items-center justify-center gap-2 shadow-2xl"
                       >
                          <ShoppingBag size={14} /> ADQUIRE NOW
                       </button>
                    </div>
                 </div>
                 <div className="mt-5 text-center">
                    <p className="text-[10px] text-gold font-bold tracking-[3px] uppercase mb-1">{product.brand}</p>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-heading text-lg text-ivory hover:text-gold transition-colors mb-2 truncate px-4">{product.name}</h3>
                    </Link>
                    <div className="flex items-center justify-center gap-2 mb-3">
                       <div className="flex text-gold text-[10px]">
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < Math.floor(product.ratings) ? 'currentColor' : 'transparent'} className={i >= Math.floor(product.ratings) ? 'text-charcoal' : ''} />)}
                       </div>
                    </div>
                    <p className="text-gold font-bold text-sm">₹{product.discountPrice || product.price}</p>
                 </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
