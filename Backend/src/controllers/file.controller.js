import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import File from '../models/file.model.js';
import Connection from '../models/connection.model.js';
import User from '../models/user.model.js';
import { deleteFromCloudinary, getResourceType } from '../services/cloudinary.service.js';
import { createNotification } from '../services/notification.service.js';

// Max file size allowed: 100MB (safety net on top of Multer)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// @route POST /api/files/send/:recipientId
export const sendFile = asyncHandler(async (req, res) => {
  const { recipientId } = req.params;

  // Validate recipientId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(recipientId)) {
    res.status(400);
    throw new Error('Invalid recipient ID');
  }

  // Confirm recipient actually exists
  const recipientExists = await User.findById(recipientId);
  if (!recipientExists) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  // Ensure users are connected
  const connection = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: recipientId },
      { requester: recipientId, recipient: req.user._id },
    ],
    status: 'accepted',
  });

  if (!connection) {
    res.status(403);
    throw new Error('You are not connected with this user');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Controller-level file size safety net
  if (req.file.size > MAX_FILE_SIZE) {
    res.status(400);
    throw new Error('File size exceeds the 100MB limit');
  }

  const file = await File.create({
    sender: req.user._id,
    recipient: recipientId,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileType: req.file.mimetype,
    fileUrl: req.file.path,       // Cloudinary URL
    publicId: req.file.filename,  // Cloudinary public_id
  });

  // Notify recipient — refModel required
  await createNotification({
    recipient: recipientId,
    sender: req.user._id,
    type: 'file_received',
    refId: file._id,
    refModel: 'File',
  });

  res.status(201).json({ message: 'File sent successfully', data: file });
});

// @route GET /api/files/history
export const getFileHistory = asyncHandler(async (req, res) => {
  const files = await File.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  })
    .populate('sender', 'username uniqueId')
    .populate('recipient', 'username uniqueId')
    .sort({ createdAt: -1 });

  res.status(200).json({ data: files });
});

// @route DELETE /api/files/:id
export const deleteFile = asyncHandler(async (req, res) => {
  // Validate file ID format first
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid file ID');
  }

  const file = await File.findById(req.params.id);
  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  if (!file.sender.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to delete this file');
  }

  // Delete from Cloudinary first — if this fails, we keep the DB record intact
  // This prevents orphaned files on Cloudinary with no DB reference
  try {
    const resourceType = getResourceType(file.fileType);
    await deleteFromCloudinary(file.publicId, resourceType);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to delete file from storage. Please try again.');
  }

  // Only delete DB record after Cloudinary deletion succeeds
  await file.deleteOne();
  res.status(200).json({ message: 'File deleted successfully' });
});