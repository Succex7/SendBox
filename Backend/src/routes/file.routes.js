import express from 'express';
import { sendFile, getFileHistory, deleteFile } from '../controllers/file.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use(protect);

router.post('/send/:recipientId', upload.single('file'), sendFile);
router.get('/history', getFileHistory);
router.delete('/:id', deleteFile);

export default router;