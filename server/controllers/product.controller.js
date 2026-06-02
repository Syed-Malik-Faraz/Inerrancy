import Product from '../models/Product.model.js';
import Review from '../models/Review.model.js';
import cloudinary from '../config/cloudinary.js';

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, search, brand, category,
      fragranceFamily, occasion, collection,
      minPrice, maxPrice, isFeatured, inStock,
    } = req.query;

    const ALLOWED_SORTS = ['-createdAt', 'createdAt', '-price', 'price', '-ratings', 'ratings'];
    const sort = ALLOWED_SORTS.includes(req.query.sort) ? req.query.sort : '-createdAt';

    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (brand) query.brand = { $in: brand.split(',') };
    if (category) query.category = { $in: category.split(',') };
    if (fragranceFamily) query.fragranceFamily = { $in: fragranceFamily.split(',') };
    if (occasion) query.occasion = { $in: occasion.split(',') };
    if (collection) query.collection = { $in: collection.split(',') };
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
    if (isFeatured === 'true') query.isFeatured = true;
    if (inStock === 'true') query.stock = { $gt: 0 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive)
      return res.status(404).json({ success: false, message: 'Product not found' });

    const reviews = await Review.find({ product: product._id, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, product, reviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/products (admin)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/products/:id (admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/products/:id (admin)
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product removed' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/products/:id/images (admin) - upload images to cloudinary
export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: 'No files uploaded' });

    const uploadPromises = req.files.map(file => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      return cloudinary.uploader.upload(dataURI, {
        folder: 'inerrancy/products',
        transformation: [{ width: 800, height: 800, crop: 'fill', quality: 'auto' }],
      });
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map(r => r.secure_url);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: urls } } },
      { new: true }
    );

    res.json({ success: true, images: urls, product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/products/:id/images - remove one image
export const deleteProductImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { $pull: { images: imageUrl } });
    // Extract public_id from cloudinary url and delete
    const parts = imageUrl.split('/');
    const publicId = 'inerrancy/products/' + parts[parts.length - 1].split('.')[0];
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image removed' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/products/brands - get unique brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true });
    res.json({ success: true, brands });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
