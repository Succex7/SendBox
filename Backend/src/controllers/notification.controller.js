import asyncHandler from 'express-async-handler';
import Notification from '../models/notification.model.js';

// @route GET /api/notifications
// Get all notifications for logged in user
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'username uniqueId')
    // refPath tells Mongoose to read the 'refModel' field value from each
    // document to know which collection to populate from — 'Connection' or 'File'
    .populate({ path: 'refId', refPath: 'refModel' })
    .sort({ createdAt: -1 });

  res.status(200).json({ data: notifications });
});

// @route PATCH /api/notifications/:id/read
// Mark a single notification as read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (!notification.recipient.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ message: 'Marked as read', data: notification });
});

// @route PATCH /api/notifications/read-all
// Mark all notifications as read
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({ message: 'All notifications marked as read' });
});