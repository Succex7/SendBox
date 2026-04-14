import { cloudinary } from '../config/cloudinary.js';

/**
 * Delete a file from Cloudinary by its public_id
 * Handles both raw files (docs, pdfs) and images
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resourceType - 'raw' | 'image' | 'video' (default: 'raw')
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

/**
 * Get file resource type based on MIME type
 * Cloudinary needs to know the resource type for proper handling
 * @param {string} mimeType - file MIME type e.g. 'image/png'
 * @returns {string} - 'image' | 'video' | 'raw'
 */
export const getResourceType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'raw'; // documents, pdfs, zips, etc.
};

/**
 * Generate a Cloudinary download URL that forces download on the browser
 * instead of previewing inline
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resourceType - 'raw' | 'image' | 'video'
 * @returns {string} - Force-download URL
 */
export const generateDownloadUrl = (publicId, resourceType = 'raw') => {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    flags: 'attachment', // forces browser download
  });
};