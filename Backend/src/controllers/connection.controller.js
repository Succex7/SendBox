import Connection from '../models/connection.model.js';
import User from '../models/user.model.js';
import { createNotification } from '../services/notification.service.js';

// @route POST /api/connections/request
export const sendRequest = async (req, res) => {
  const { uniqueId } = req.body;

  const recipient = await User.findOne({ uniqueId });
  if (!recipient) return res.status(404).json({ message: 'User not found' });

  if (recipient._id.equals(req.user._id))
    return res.status(400).json({ message: 'You cannot connect with yourself' });

  const exists = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: recipient._id },
      { requester: recipient._id, recipient: req.user._id },
    ],
  });

  if (exists) return res.status(409).json({ message: 'Connection already exists' });

  const connection = await Connection.create({
    requester: req.user._id,
    recipient: recipient._id,
  });

  // Notify recipient via service
  await createNotification({
    recipient: recipient._id,
    sender: req.user._id,
    type: 'connection_request',
    refId: connection._id,
  });

  res.status(201).json({ message: 'Connection request sent', data: connection });
};

// @route PATCH /api/connections/:id/respond
export const respondToRequest = async (req, res) => {
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  const connection = await Connection.findById(req.params.id);
  if (!connection) return res.status(404).json({ message: 'Connection not found' });

  if (!connection.recipient.equals(req.user._id))
    return res.status(403).json({ message: 'Not authorized' });

  connection.status = status;
  await connection.save();

  res.status(200).json({ message: `Connection ${status}`, data: connection });
};

// @route GET /api/connections
export const getConnections = async (req, res) => {
  const connections = await Connection.find({
    $or: [{ requester: req.user._id }, { recipient: req.user._id }],
    status: 'accepted',
  })
    .populate('requester', 'username email uniqueId')
    .populate('recipient', 'username email uniqueId');

  res.status(200).json({ data: connections });
};

// @route GET /api/connections/requests
export const getPendingRequests = async (req, res) => {
  const requests = await Connection.find({
    recipient: req.user._id,
    status: 'pending',
  }).populate('requester', 'username email uniqueId');

  res.status(200).json({ data: requests });
};