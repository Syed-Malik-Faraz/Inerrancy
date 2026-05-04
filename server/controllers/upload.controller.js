import cloudinary from '../config/cloudinary.js';

// POST /api/upload - single image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'inerrancy',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });
    res.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (err) { 
    console.error('Cloudinary Single Upload Error:', err);
    res.status(500).json({ success: false, message: err.message }); 
  }
};

// POST /api/upload/multiple - multiple images
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files uploaded' });
    const uploads = req.files.map(file => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      return cloudinary.uploader.upload(dataURI, { folder: 'inerrancy/products', transformation: [{ width: 800, height: 800, crop: 'fill', quality: 'auto' }] });
    });
    const results = await Promise.all(uploads);
    const urls = results.map(r => r.secure_url);
    res.json({ success: true, urls });
  } catch (err) { 
    console.error('Cloudinary Multiple Upload Error:', err);
    res.status(500).json({ success: false, message: err.message }); 
  }
};
