import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';

const router = express.Router();

// Message routes
router.post('/create', sendMessage);
router.get('/get', getMessages);

export default router;
