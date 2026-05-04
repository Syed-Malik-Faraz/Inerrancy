import Blog from '../models/Blog.model.js';

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/blog
export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const query = { isPublished: true };
    if (tag) query.tags = tag;
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-content');
    res.json({ success: true, blogs, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/blog/all (admin - includes unpublished)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/blog/:slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, blog });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/blog (admin)
export const createBlog = async (req, res) => {
  try {
    const slug = req.body.slug || slugify(req.body.title);
    const blog = await Blog.create({ ...req.body, slug, author: req.user._id });
    res.status(201).json({ success: true, blog });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/blog/:id (admin)
export const updateBlog = async (req, res) => {
  try {
    if (req.body.title && !req.body.slug) req.body.slug = slugify(req.body.title);
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, blog });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/blog/:id (admin)
export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
