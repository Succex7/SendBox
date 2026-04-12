import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    type: {
      type: String,
      enum: ['connection_request', 'file_received'],
      required: true,
    },

    // refModel tells Mongoose which collection refId points to
    // This enables proper .populate('refId') later
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },
    refModel: {
      type: String,
      enum: ['Connection', 'File'],
      required: true,
    },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);