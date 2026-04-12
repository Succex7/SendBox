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

    // null = never expires (free plan default)
    // Set a date to enable auto-deletion via MongoDB TTL index
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// TTL index — MongoDB auto-deletes documents when expiresAt date is reached
// Documents with expiresAt: null are ignored by this index
fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('File', fileSchema);