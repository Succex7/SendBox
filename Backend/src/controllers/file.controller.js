import File from '../models/file.model.js';
import Connection from '../models/connection.model.js';
import { deleteFromCloudinary, getResourceType } from '../services/cloudinary.service.js';
import { createNotification } from '../services/notification.service.js';

// @route POST /api/files/send/:recipientId
export const sendFile = async (req, res) => {
  const { recipientId } = req.params;

  // Ensure users are connected
  const connection = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: recipientId },
      { requester: recipientId, recipient: req.user._id },
    ],
    status: 'accepted',
  });

  if (!connection)
    return res.status(403).json({ message: 'You are not connected with this user' });

  if (!req.file)
    return res.status(400).json({ message: 'No file uploaded' });

  const file = await File.create({
    sender: req.user._id,
    recipient: recipientId,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileType: req.file.mimetype,
    fileUrl: req.file.path,       // Cloudinary URL
    publicId: req.file.filename,  // Cloudinary public_id
  });

  // Notify recipient via service
  await createNotification({
    recipient: recipientId,
    sender: req.user._id,
    type: 'file_received',
    refId: file._id,
  });

  res.status(201).json({ message: 'File sent successfully', data: file });
};

// @route GET /api/files/history
export const getFileHistory = async (req, res) => {
  const files = await File.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  })
    .populate('sender', 'username uniqueId')
    .populate('recipient', 'username uniqueId')
    .sort({ createdAt: -1 });

  res.status(200).json({ data: files });
};

// @route DELETE /api/files/:id
export const deleteFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: 'File not found' });

  if (!file.sender.equals(req.user._id))
    return res.status(403).json({ message: 'Not authorized to delete this file' });

  // Determine resource type from MIME type before deleting from Cloudinary
  const resourceType = getResourceType(file.fileType);
  await deleteFromCloudinary(file.publicId, resourceType);

  await file.deleteOne();
  res.status(200).json({ message: 'File deleted successfully' });
};