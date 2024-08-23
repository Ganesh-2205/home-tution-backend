import express from 'express';
import { createPayment, updatePaymentStatus } from '../controllers/paymentController.js';

const router = express.Router();

// Payment routes
router.post('/create/:id', createPayment);
router.post('/update-status', updatePaymentStatus);

export default router;
