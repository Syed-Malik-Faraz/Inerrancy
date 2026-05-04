import Coupon from '../models/Coupon.model.js';

// POST /api/coupons (admin)
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/coupons (admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/coupons/:id (admin)
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, coupon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/coupons/:id (admin)
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    if (coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    if (orderAmount < coupon.minOrderAmount)
      return res.status(400).json({ success: false, message: `Minimum order ₹${coupon.minOrderAmount} required` });
    if (coupon.usedBy.includes(req.user._id))
      return res.status(400).json({ success: false, message: 'You have already used this coupon' });

    let discount = 0;
    if (coupon.discountType === 'percentage') discount = Math.round(orderAmount * coupon.discountValue / 100);
    else discount = coupon.discountValue;

    res.json({ success: true, coupon, discount, message: `Coupon applied! You save ₹${discount}` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
