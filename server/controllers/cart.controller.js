import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price discountPrice brand stock sizes');
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/cart - add item
export const addToCart = async (req, res) => {
  try {
    const { productId, size, qty = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Determine price
    let price = product.discountPrice || product.price;
    if (size && product.sizes?.length) {
      const sizeObj = product.sizes.find(s => s.label === size);
      if (sizeObj) price = sizeObj.discountPrice || sizeObj.price;
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existIdx = cart.items.findIndex(i => i.product.toString() === productId && i.size === size);
    if (existIdx > -1) {
      cart.items[existIdx].qty += qty;
    } else {
      cart.items.push({ product: productId, size: size || '', qty, price });
    }
    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice brand stock');
    res.json({ success: true, cart });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/cart/:itemId
export const updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (qty <= 0) cart.items.pull(req.params.itemId);
    else item.qty = qty;
    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice brand stock');
    res.json({ success: true, cart });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/cart/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name images price discountPrice brand stock');
    res.json({ success: true, cart });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/cart - clear
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
