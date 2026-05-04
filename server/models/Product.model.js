import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g. "30ml", "50ml", "100ml"
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  images: [{ type: String }],
  sizes: [sizeSchema],
  // Default price shown when no size selected
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    required: true,
  },
  fragranceFamily: {
    type: String,
    enum: ['Sweet', 'Fresh', 'Woody', 'Spicy', 'Floral', 'Fruity', 'Citrus', 'Oriental', 'Aqua'],
  },
  occasion: {
    type: String,
    enum: ['Party & Evening', 'Date Night', 'Daily Wear', 'Summer Fresh', 'Winter Warmth', 'Gym & Active', 'Office Wear'],
  },
  collection: {
    type: String,
    enum: ['Best Sellers', 'New Arrivals', 'Gift Sets', 'Luxury', 'Viral Hits', 'Limited Edition', 'Summer & Spring', 'Collectors Edition'],
  },
  notes: {
    top: [String],
    middle: [String],
    base: [String],
  },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

// Text search index
productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
