import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';

// Validate Cloudinary credentials at startup — fail loudly, not silently
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error('❌ Missing Cloudinary environment variables. Check your .env file.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Allowed File Types
// Covers all popular image, video, document, archive and audio formats
// Blocks executables and potentially dangerous files
const ALLOWED_MIME_TYPES = new Set([
  // Images — all popular formats including modern ones
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
  'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff',
  'image/heic', 'image/heif', 'image/avif', 'image/x-icon',

  // Videos — all major formats
  'video/mp4', 'video/quicktime', 'video/x-msvideo',
  'video/webm', 'video/x-matroska', 'video/3gpp', 'video/3gpp2',
  'video/x-flv', 'video/mpeg', 'video/ogg', 'video/x-ms-wmv',

  // Documents
  'application/pdf',
  'application/msword',                                                           // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',      // .docx
  'application/vnd.ms-excel',                                                     // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',            // .xlsx
  'application/vnd.ms-powerpoint',                                                // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',    // .pptx
  'application/vnd.oasis.opendocument.text',                                      // .odt
  'application/vnd.oasis.opendocument.spreadsheet',                               // .ods
  'application/xml', 'text/xml',                                                  // .xml

  // Archives & Compressed
  'application/zip',
  'application/x-rar-compressed', 'application/vnd.rar',
  'application/x-7z-compressed',
  'application/x-tar',
  'application/gzip',

  // Text & Data
  'text/plain',        // .txt
  'text/csv',          // .csv
  'text/html',         // .html
  'text/markdown',     // .md
  'application/json',  // .json

  // Audio
  'audio/mpeg',        // .mp3
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/aac',
  'audio/x-ms-wma',
  'audio/flac',
]);

// Cloudinary Storage 
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Strip extension and sanitize filename to avoid Cloudinary double-extension bugs
    const nameWithoutExt = path.parse(file.originalname).name;
    const safeName = nameWithoutExt
      .replace(/\s+/g, '_')           // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_-]/g, '') // Remove any special characters
      .substring(0, 80);              // Cap name length

    return {
      folder: 'sendbox/files',
      resource_type: 'auto', // Cloudinary auto-detects image/video/raw
      public_id: `${Date.now()}-${safeName}`,
    };
  },
});

// File Filter 
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    // Reject with a clear error — don't silently drop the file
    cb(
      new Error(`File type '${file.mimetype}' is not supported. Please upload a valid file.`),
      false
    );
  }
};

// Multer Export 
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max size
  },
});

export { cloudinary };