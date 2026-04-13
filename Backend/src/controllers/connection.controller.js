import asyncHandler from 'express-async-handler';
import Connection from '../models/connection.model.js';
import User from '../models/user.model.js';
import { createNotification } from '../services/notification.service.js';

// @route POST /api/connections/request
export const sendRequest = asyncHandler(async (req, res) => {
  const { uniqueId } = req.body;

  if (!uniqueId) {
    res.status(400);
    throw new Error('uniqueId is required');
  }

  const recipient = await User.findOne({ uniqueId });
  if (!recipient) {
    res.status(404);
    throw new Error('User not found');
  }

  if (recipient._id.equals(req.user._id)) {
    res.status(400);
    throw new Error('You cannot connect with yourself');
  }

  const exists = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: recipient._id },
      { requester: recipient._id, recipient: req.user._id },
    ],
  });

  if (exists) {
    res.status(409);
    throw new Error('Connection already exists');
  }

  const connection = await Connection.create({
    requester: req.user._id,
    recipient: recipient._id,
  });

  // Notify recipient — refModel required since we updated notification.model.js
  await createNotification({
    recipient: recipient._id,
    sender: req.user._id,
    type: 'connection_request',
    refId: connection._id,
    refModel: 'Connection',
  });

  res.status(201).json({ message: 'Connection request sent', data: connection });
});

// @route PATCH /api/connections/:id/respond
export const respondToRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const connection = await Connection.findById(req.params.id);
  if (!connection) {
    res.status(404);
    throw new Error('Connection not found');
  }

  if (!connection.recipient.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Prevent re-responding to an already resolved connection
  if (connection.status !== 'pending') {
    res.status(400);
    throw new Error('This connection request has already been responded to');
  }

  connection.status = status;
  await connection.save();

  res.status(200).json({ message: `Connection ${status}`, data: connection });
});

// @route GET /api/connections
export const getConnections = asyncHandler(async (req, res) => {
  const connections = await Connection.find({
    $or: [{ requester: req.user._id }, { recipient: req.user._id }],
    status: 'accepted',
  })
    .populate('requester', 'username email uniqueId')
    .populate('recipient', 'username email uniqueId');

  res.status(200).json({ data: connections });
});

// @route GET /api/connections/requests
export const getPendingRequests = asyncHandler(async (req, res) => {
  const requests = await Connection.find({
    recipient: req.user._id,
    status: 'pending',
  }).populate('requester', 'username email uniqueId');

  res.status(200).json({ data: requests });
});