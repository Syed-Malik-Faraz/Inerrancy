import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['new_order', 'new_user'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
