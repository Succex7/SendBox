import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage config — stores all file types as raw (no transformation)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'sendbox/files',
    resource_type: 'auto',
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`,
  }),
});

export const upload = multer({ storage });
export { cloudinary };