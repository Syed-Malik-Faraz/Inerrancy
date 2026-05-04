import Review from '../models/Review.model.js';
import Product from '../models/Product.model.js';

// GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/reviews/:productId
export const addReview = async (req, res) => {
  try {
    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      ...req.body,
    });

    // Recalculate product rating
    const stats = await Review.aggregate([
      { $match: { product: review.product, isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Product.findByIdAndUpdate(req.params.productId, {
        ratings: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].count,
      });
    }

    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/reviews (admin)
export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Review.countDocuments();
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name brand images')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, reviews, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/reviews/:id (admin or review owner)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.deleteOne();
    // Recalculate
    const stats = await Review.aggregate([
      { $match: { product: review.product, isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(review.product, {
      ratings: stats.length ? stats[0].avgRating : 0,
      numReviews: stats.length ? stats[0].count : 0,
    });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/reviews/:id/approve (admin)
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
    res.json({ success: true, review });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
