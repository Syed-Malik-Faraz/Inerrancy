import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user, updateUser } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = user?.wishlist?.includes(product._id);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    setIsLiking(true);
    try {
      const res = await api.put(`/users/wishlist/${product._id}`);
      updateUser({ ...user, wishlist: res.data.wishlist });
      toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error('Wishlist update failed');
    } finally {
      setIsLiking(false);
    }
  };

  const discountAmount = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <div className="group relative animate-fade-in">
      {/* Upper: Image + Actions */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black-2 border border-gold/5 transition-all duration-500 group-hover:border-gold/20">
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          <img 
            src={product.images?.[0]} 
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>
        
        {/* badges */}
        {discountAmount > 0 && (
          <div className="absolute top-4 left-4 bg-luxury-red text-white text-[9px] font-bold px-2 py-1 tracking-wider uppercase z-10">
            -{discountAmount}% OFF
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-4 right-4 bg-gold text-black text-[9px] font-bold px-2 py-1 tracking-wider uppercase z-10">
            Collector's Choice
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <div className="flex gap-2">
            <button 
              onClick={() => addToCart(product._id)}
              className="grow bg-gold text-black py-3 text-[10px] font-bold uppercase tracking-[2px] transition-colors hover:bg-gold-light flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} /> Add to Cart
            </button>
            <Link 
              to={`/product/${product._id}`}
              className="bg-black/80 backdrop-blur-md text-ivory p-3 hover:text-gold transition-colors"
            >
              <Eye size={16} />
            </Link>
            <button 
              onClick={handleToggleWishlist}
              disabled={isLiking}
              className={`p-3 backdrop-blur-md border transition-all duration-300 ${isLiked ? 'bg-luxury-red border-luxury-red text-white' : 'bg-black/60 border-gold/20 text-ivory hover:text-gold'}`}
            >
              <Heart size={16} fill={isLiked ? 'white' : 'transparent'} />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 text-center px-4">
        <p className="text-[10px] text-gold font-bold tracking-[4px] uppercase mb-2">{product.brand}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-heading text-xl lg:text-2xl text-ivory hover:text-gold transition-colors mb-3 truncate px-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(product.ratings || 0) ? 'currentColor' : 'transparent'} className={i >= Math.floor(product.ratings || 0) ? 'text-charcoal' : ''} />
            ))}
          </div>
          <span className="text-[10px] text-ivory/30 tracking-widest uppercase font-bold">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-baseline justify-center gap-4">
          {product.discountPrice ? (
            <>
              <span className="text-gold font-bold">₹{product.discountPrice}</span>
              <span className="text-ivory/40 text-xs line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="text-ivory font-bold tracking-wider">₹{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
