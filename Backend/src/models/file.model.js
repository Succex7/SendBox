import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true }, // in bytes
    fileType: { type: String, required: true }, // MIME type
    fileUrl: { type: String, required: true },  // Cloudinary URL
    publicId: { type: String, required: true }, // Cloudinary public_id (for deletion)

    // Optional: auto-delete after this date
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('File', fileSchema);