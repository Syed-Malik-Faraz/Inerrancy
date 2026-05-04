import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      const res = await api.get('/cart');
      setCart(res.data.cart || { items: [] });
    } catch { setCart({ items: [] }); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, size = '', qty = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return; }
    setLoading(true);
    try {
      const res = await api.post('/cart', { productId, size, qty });
      setCart(res.data.cart);
      setCartOpen(true);
      toast.success('Added to cart ✨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally { setLoading(false); }
  };

  const updateItem = async (itemId, qty) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { qty });
      setCart(res.data.cart);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      setCart(res.data.cart);
      toast.success('Item removed');
    } catch (err) { toast.error(err.response?.data?.message || 'Remove failed'); }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({ items: [] });
    } catch {}
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.qty, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => sum + i.price * i.qty, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartTotal, cartOpen, setCartOpen,
      loading, addToCart, updateItem, removeItem, clearCart, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
