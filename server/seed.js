import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import Product from './models/Product.model.js';
import Coupon from './models/Coupon.model.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Oud Eternity Noir',
    brand: 'Inerrancy',
    description: 'A majestic journey through the ancient oud trails of the Middle East. Rich, smoky, and deeply intoxicating with notes of black oud, amber, and precious resins. This is the pinnacle of luxury.',
    shortDescription: 'Rich black oud with amber and precious resins.',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80',
      'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800&q=80',
    ],
    sizes: [
      { label: '30ml', price: 3499, discountPrice: 2999, stock: 20 },
      { label: '50ml', price: 5499, discountPrice: 4799, stock: 15 },
      { label: '100ml', price: 8999, discountPrice: 7999, stock: 10 },
    ],
    price: 4799,
    discountPrice: 3999,
    stock: 45,
    category: 'Unisex',
    fragranceFamily: 'Woody',
    occasion: 'Party & Evening',
    collection: 'Luxury',
    notes: { top: ['Black Oud', 'Saffron'], middle: ['Rose', 'Amber'], base: ['Musk', 'Sandalwood', 'Vanilla'] },
    tags: ['oud', 'luxury', 'unisex', 'woody'],
    isFeatured: true,
    ratings: 4.8, numReviews: 124,
  },
  {
    name: 'Golden Iris Absolu',
    brand: 'Inerrancy',
    description: 'A powdery, divine iris at the heart, wrapped in warm golden amber and soft musk. Elegance personified for the modern woman who demands nothing but the extraordinary.',
    shortDescription: 'Powdery iris with golden amber and soft musk.',
    images: [
      'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=800&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    ],
    sizes: [
      { label: '50ml', price: 4299, discountPrice: 3699, stock: 25 },
      { label: '100ml', price: 6999, discountPrice: 5999, stock: 12 },
    ],
    price: 3699,
    discountPrice: 2999,
    stock: 37,
    category: 'Women',
    fragranceFamily: 'Floral',
    occasion: 'Date Night',
    collection: 'Best Sellers',
    notes: { top: ['Bergamot', 'Pink Pepper'], middle: ['Iris', 'Jasmine'], base: ['Amber', 'White Musk', 'Sandalwood'] },
    tags: ['iris', 'floral', 'women', 'elegant'],
    isFeatured: true,
    ratings: 4.7, numReviews: 89,
  },
  {
    name: 'Arabian Nights Intense',
    brand: 'Inerrancy',
    description: 'Inspired by the mystical nights of Arabia, this rich oriental fragrance opens with spicy cardamom and clove, evolving into a heart of rose and oud, settling on a warm base of amber and musk.',
    shortDescription: 'Spicy cardamom and clove with rose oud heart.',
    images: [
      'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
    ],
    sizes: [
      { label: '50ml', price: 3999, discountPrice: 3499, stock: 30 },
      { label: '100ml', price: 6499, discountPrice: 5499, stock: 18 },
    ],
    price: 3499,
    discountPrice: 2799,
    stock: 48,
    category: 'Men',
    fragranceFamily: 'Oriental',
    occasion: 'Party & Evening',
    collection: 'New Arrivals',
    notes: { top: ['Cardamom', 'Clove', 'Saffron'], middle: ['Rose', 'Oud', 'Vetiver'], base: ['Amber', 'Labdanum', 'Musk'] },
    tags: ['oriental', 'men', 'spicy', 'oud'],
    isFeatured: true,
    ratings: 4.6, numReviews: 67,
  },
  {
    name: 'Citrus Verde Elixir',
    brand: 'Inerrancy',
    description: 'A refreshing explosion of Sicilian citrus and aromatic herbs. Perfect for daily wear, this vibrant fragrance lifts the spirit with its clean, energetic personality.',
    shortDescription: 'Fresh Sicilian citrus with aromatic herbs.',
    images: ['https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80'],
    sizes: [
      { label: '30ml', price: 1999, discountPrice: 1699, stock: 40 },
      { label: '50ml', price: 2999, discountPrice: 2499, stock: 35 },
      { label: '100ml', price: 4499, discountPrice: 3799, stock: 20 },
    ],
    price: 2499,
    discountPrice: 1999,
    stock: 95,
    category: 'Men',
    fragranceFamily: 'Citrus',
    occasion: 'Daily Wear',
    collection: 'Best Sellers',
    notes: { top: ['Lemon', 'Bergamot', 'Grapefruit'], middle: ['Rosemary', 'Basil', 'Mint'], base: ['Cedarwood', 'Musk'] },
    tags: ['citrus', 'fresh', 'daily', 'men'],
    isFeatured: false,
    ratings: 4.5, numReviews: 203,
  },
  {
    name: 'Rose Seduction Parfum',
    brand: 'Inerrancy',
    description: 'A modern love story told through lush Turkish rose, delicate peony, and sensual patchouli. This is femininity at its most confident and enchanting.',
    shortDescription: 'Turkish rose with peony and sensual patchouli.',
    images: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80',
    ],
    sizes: [
      { label: '50ml', price: 3299, discountPrice: 2899, stock: 22 },
      { label: '100ml', price: 5499, discountPrice: 4699, stock: 14 },
    ],
    price: 2899,
    discountPrice: 2499,
    stock: 36,
    category: 'Women',
    fragranceFamily: 'Floral',
    occasion: 'Date Night',
    collection: 'Best Sellers',
    notes: { top: ['Rose', 'Peony', 'Raspberry'], middle: ['Jasmine', 'Iris'], base: ['Patchouli', 'Musk', 'Amber'] },
    tags: ['rose', 'floral', 'women', 'romantic'],
    isFeatured: true,
    ratings: 4.9, numReviews: 156,
  },
  {
    name: 'Midnight Oud Royale',
    brand: 'Inerrancy',
    description: 'The king of ouds. A bold, assertive fragrance that commands attention. Deep oud and leather are softened by smoky incense and warm vanilla in this spectacular creation.',
    shortDescription: 'Bold oud and leather with smoky incense.',
    images: [
      'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=800&q=80',
    ],
    sizes: [
      { label: '50ml', price: 6999, discountPrice: 5999, stock: 10 },
      { label: '100ml', price: 11999, discountPrice: 9999, stock: 6 },
    ],
    price: 5999,
    discountPrice: 4999,
    stock: 16,
    category: 'Men',
    fragranceFamily: 'Woody',
    occasion: 'Party & Evening',
    collection: 'Luxury',
    notes: { top: ['Black Oud', 'Leather'], middle: ['Incense', 'Rose', 'Saffron'], base: ['Vanilla', 'Musk', 'Amber'] },
    tags: ['oud', 'luxury', 'men', 'bold'],
    isFeatured: true,
    ratings: 4.8, numReviews: 78,
  },
  {
    name: 'Fresh Aqua Breeze',
    brand: 'Inerrancy',
    description: 'Inspired by morning ocean breezes, this aquatic fragrance blends sea salt, crisp melon, and white florals over a driftwood and musk base. Perfect for summer and office wear.',
    shortDescription: 'Ocean breeze with sea salt and white florals.',
    images: [
      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
    ],
    sizes: [
      { label: '30ml', price: 1799, discountPrice: 1499, stock: 50 },
      { label: '50ml', price: 2799, discountPrice: 2299, stock: 40 },
      { label: '100ml', price: 4199, discountPrice: 3499, stock: 25 },
    ],
    price: 2299,
    discountPrice: 1799,
    stock: 115,
    category: 'Unisex',
    fragranceFamily: 'Aqua',
    occasion: 'Office Wear',
    collection: 'Summer & Spring',
    notes: { top: ['Sea Salt', 'Melon', 'Bergamot'], middle: ['White Florals', 'Violet', 'Lily'], base: ['Driftwood', 'Musk', 'Amber'] },
    tags: ['aqua', 'fresh', 'unisex', 'summer'],
    isFeatured: false,
    ratings: 4.4, numReviews: 92,
  },
  {
    name: 'Santal Mystique',
    brand: 'Inerrancy',
    description: 'A warm, creamy sandalwood with rich vanilla and a touch of coconut. Comforting, sensual, and utterly addictive. The perfect winter companion.',
    shortDescription: 'Creamy sandalwood with vanilla and coconut.',
    images: [
      'https://images.unsplash.com/photo-1605651531144-51381895e23d?w=800&q=80',
    ],
    sizes: [
      { label: '50ml', price: 3799, discountPrice: 3199, stock: 28 },
      { label: '100ml', price: 5999, discountPrice: 5199, stock: 16 },
    ],
    price: 3199,
    discountPrice: 2699,
    stock: 44,
    category: 'Unisex',
    fragranceFamily: 'Sweet',
    occasion: 'Winter Warmth',
    collection: 'New Arrivals',
    notes: { top: ['Coconut', 'Cardamom'], middle: ['Sandalwood', 'Rose'], base: ['Vanilla', 'Musk', 'Tonka Bean'] },
    tags: ['sandalwood', 'sweet', 'unisex', 'winter'],
    isFeatured: false,
    ratings: 4.6, numReviews: 54,
  },
  {
    name: 'Velvet Oud Gift Set',
    brand: 'Inerrancy',
    description: 'The ultimate luxury gift set featuring our three bestselling oud fragrances in stunning presentation packaging. Perfect for gifting or starting your oud collection.',
    shortDescription: 'Three bestselling ouds in premium gift packaging.',
    images: [
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=80',
    ],
    sizes: [{ label: '3x30ml', price: 7999, discountPrice: 5999, stock: 15 }],
    price: 5999,
    discountPrice: 4999,
    stock: 15,
    category: 'Unisex',
    fragranceFamily: 'Woody',
    occasion: 'Party & Evening',
    collection: 'Gift Sets',
    notes: { top: ['Oud', 'Saffron'], middle: ['Rose', 'Amber'], base: ['Musk', 'Sandalwood'] },
    tags: ['gift', 'set', 'oud', 'luxury'],
    isFeatured: true,
    ratings: 4.9, numReviews: 43,
  },
  {
    name: 'Spice Route Parfum',
    brand: 'Inerrancy',
    description: 'Travel along ancient spice routes with this captivating blend of black pepper, cinnamon, and clove opening to a rich heart of warm resins and deep vetiver.',
    shortDescription: 'Black pepper and cinnamon with warm resins.',
    images: [
      'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=800&q=80',
    ],
    sizes: [
      { label: '50ml', price: 3499, discountPrice: 2999, stock: 20 },
      { label: '100ml', price: 5799, discountPrice: 4999, stock: 12 },
    ],
    price: 2999,
    discountPrice: 2499,
    stock: 32,
    category: 'Men',
    fragranceFamily: 'Spicy',
    occasion: 'Winter Warmth',
    collection: 'New Arrivals',
    notes: { top: ['Black Pepper', 'Cinnamon', 'Clove'], middle: ['Frankincense', 'Myrrh', 'Rose'], base: ['Vetiver', 'Oud', 'Musk'] },
    tags: ['spicy', 'men', 'winter', 'oriental'],
    isFeatured: false,
    ratings: 4.5, numReviews: 38,
  },
  {
    name: 'Blueberry Frost',
    brand: 'Inerrancy',
    description: 'A playful yet sophisticated fruity fragrance with juicy blueberry and blackcurrant atop a floral heart and clean white musk. Fresh, fun, and utterly wearable.',
    shortDescription: 'Juicy blueberry and blackcurrant with white musk.',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
    ],
    sizes: [
      { label: '30ml', price: 1699, discountPrice: 1399, stock: 45 },
      { label: '50ml', price: 2599, discountPrice: 2199, stock: 30 },
    ],
    price: 2199,
    discountPrice: 1799,
    stock: 75,
    category: 'Women',
    fragranceFamily: 'Fruity',
    occasion: 'Daily Wear',
    collection: 'Best Sellers',
    notes: { top: ['Blueberry', 'Blackcurrant', 'Lemon'], middle: ['Jasmine', 'Peony'], base: ['White Musk', 'Vanilla'] },
    tags: ['fruity', 'women', 'fresh', 'daily'],
    isFeatured: false,
    ratings: 4.3, numReviews: 117,
  },
  {
    name: "Collector's Oud Ambergris",
    brand: 'Inerrancy',
    description: 'An extraordinarily rare and precious blend of aged oud and natural ambergris. Limited to 100 bottles per batch, this is the ultimate expression of perfumery excellence.',
    shortDescription: 'Aged oud and rare natural ambergris. Limited edition.',
    images: [
      'https://images.unsplash.com/photo-1540202404-a2008897b576?w=800&q=80',
    ],
    sizes: [{ label: '50ml', price: 24999, discountPrice: 21999, stock: 8 }],
    price: 21999,
    discountPrice: 18999,
    stock: 8,
    category: 'Unisex',
    fragranceFamily: 'Woody',
    occasion: 'Party & Evening',
    collection: 'Collectors Edition',
    notes: { top: ['Ambergris', 'Saffron'], middle: ['Aged Oud', 'Rose'], base: ['Sandalwood', 'Musk', 'Labdanum'] },
    tags: ['collector', 'limited', 'oud', 'luxury', 'rare'],
    isFeatured: true,
    ratings: 5.0, numReviews: 12,
  },
];

const sampleCoupons = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderAmount: 999, maxUses: 500, isActive: true },
  { code: 'LUXURY20', discountType: 'percentage', discountValue: 20, minOrderAmount: 2999, maxUses: 200, isActive: true },
  { code: 'FLAT500', discountType: 'flat', discountValue: 500, minOrderAmount: 3999, maxUses: 100, isActive: true },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Inerrancy Admin',
      email: 'admin@inerrancy.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👑 Admin created: admin@inerrancy.com / admin123');

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'user@inerrancy.com',
      password: 'user1234',
      role: 'user',
    });
    console.log('👤 User created: user@inerrancy.com / user1234');

    // Insert products
    await Product.insertMany(sampleProducts);
    console.log(`📦 ${sampleProducts.length} products created`);

    // Insert coupons
    await Coupon.insertMany(sampleCoupons);
    console.log(`🎟️  ${sampleCoupons.length} coupons created: WELCOME10, LUXURY20, FLAT500`);

    console.log('\n🏺 Seeding complete! Happy selling with Inerrancy.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
