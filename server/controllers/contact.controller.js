import Contact from '../models/Contact.model.js';

// POST /api/contacts
export const createInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Inquiry received successfully', contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/contacts/admin (Admin only)
export const getInquiries = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/contacts/admin/:id/status (Admin only)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['pending', 'read'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
