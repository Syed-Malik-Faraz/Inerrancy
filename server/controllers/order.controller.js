import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import Coupon from '../models/Coupon.model.js';
import { sendOrderConfirmationEmail } from '../config/mailer.js';

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      orderItems, // Handle frontend nickname
      shippingAddress, 
      paymentMethod, 
      couponCode, 
      couponUsed, // Handle frontend nickname
      transactionId 
    } = req.body;

    const finalItems = items || orderItems;
    const finalCouponCode = couponCode || couponUsed;

    if (!finalItems || !Array.isArray(finalItems) || finalItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Selection is empty' });
    }

    // Calculate totals
    let itemsTotal = 0;
    const enrichedItems = [];
    for (const item of finalItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      const price = item.price || product.discountPrice || product.price;
      itemsTotal += price * item.qty;
      enrichedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        brand: product.brand,
        size: item.size || '',
        price,
        qty: item.qty,
      });
    }

    // Free shipping over ₹999
    const shippingCharge = itemsTotal >= 999 ? 0 : 99;
    let discount = 0;

    // Validate coupon
    if (finalCouponCode) {
      const coupon = await Coupon.findOne({ code: finalCouponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date()) && coupon.usedCount < coupon.maxUses && itemsTotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') discount = Math.round(itemsTotal * coupon.discountValue / 100);
        else discount = coupon.discountValue;
        coupon.usedCount += 1;
        if (!coupon.usedBy.includes(req.user._id)) coupon.usedBy.push(req.user._id);
        await coupon.save();
      }
    }

    const totalAmount = itemsTotal + shippingCharge - discount;
    const paymentStatus = paymentMethod === 'COD' ? 'pending' : 'paid';

    const order = await Order.create({
      user: req.user._id,
      items: enrichedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      transactionId: transactionId || '',
      itemsTotal,
      shippingCharge,
      discount,
      totalAmount,
      couponCode: finalCouponCode || '',
      status: 'confirmed',
      timeline: [{ status: 'confirmed', note: 'Order placed successfully' }],
    });

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    // Send email (non-blocking)
    sendOrderConfirmationEmail({
      to: req.user.email,
      name: req.user.name,
      orderId: order._id.toString().slice(-8).toUpperCase(),
      items: enrichedItems,
      total: totalAmount,
      address: `${shippingAddress.line1}, ${shippingAddress.city} - ${shippingAddress.pincode}`,
    }).catch(console.error);

    res.status(201).json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    // Allow access to own order or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Access denied' });
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/orders/:id/status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.timeline.push({ status, note: note || `Status updated to ${status}` });
    await order.save();
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Access denied' });
    if (['shipped', 'delivered'].includes(order.status))
      return res.status(400).json({ success: false, message: 'Cannot cancel shipped/delivered orders' });
    order.status = 'cancelled';
    order.cancelReason = req.body.reason || 'Cancelled by user';
    order.timeline.push({ status: 'cancelled', note: order.cancelReason });
    await order.save();
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
