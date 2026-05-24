import User from '../models/User.model.js';
import cloudinary from '../config/cloudinary.js';

// GET /api/users (admin)
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const query = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/users/:id (admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('wishlist', 'name images price brand');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/users/password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/users/avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'inerrancy/avatars', transformation: [{ width: 300, height: 300, crop: 'fill' }] });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url }, { new: true });
    res.json({ success: true, avatar: result.secure_url, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/users/address
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
    user.addresses.push(req.body);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/users/address/:addressId
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
    if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
    Object.assign(addr, req.body);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/users/address/:addressId
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/users/wishlist/:productId
export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.productId;
    // Must use findIndex + toString() because user.wishlist contains ObjectId
    // objects, not strings — Array.indexOf() uses strict equality so it always
    // returns -1 when comparing ObjectId to a string.
    const idx = user.wishlist.findIndex(id => id.toString() === pid);
    if (idx > -1) user.wishlist.splice(idx, 1);
    else user.wishlist.push(pid);
    await user.save();
    // Return plain strings so the frontend can use Array.includes() reliably
    res.json({ success: true, wishlist: user.wishlist.map(id => id.toString()) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/users/wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/users/:id/role (admin)
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/users/:id (admin)
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
