import Notification from '../models/notification.model.js';

/**
 * Create a new notification
 * Centralized so any controller can call this without duplicating logic
 * @param {Object} options
 * @param {string} options.recipient - recipient user ID
 * @param {string} options.sender   - sender user ID
 * @param {string} options.type     - 'connection_request' | 'file_received'
 * @param {string} options.refId    - ID of the related document (connection or file)
 * @param {string} options.refModel - Model the refId points to: 'Connection' | 'File'
 */
export const createNotification = async ({ recipient, sender, type, refId, refModel }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      refId,
      refModel, // Added: required for proper .populate('refId') on the frontend later
    });
    return notification;
  } catch (error) {
    // Notifications failing shouldn't crash the main operation
    // so we log but don't throw
    console.error(`⚠️ Failed to create notification: ${error.message}`);
  }
};

/**
 * Get unread notification count for a user
 * Useful for showing a badge on the frontend
 * @param {string} userId
 * @returns {number}
 */
export const getUnreadCount = async (userId) => {
  try {
    return await Notification.countDocuments({ recipient: userId, isRead: false });
  } catch (error) {
    console.error(`⚠️ Failed to get unread count: ${error.message}`);
    return 0;
  }
};