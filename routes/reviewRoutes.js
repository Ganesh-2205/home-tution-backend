import express from 'express';
import { createOrUpdateReview, deleteReview, getReviews, updateReview } from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

// Review routes
router.post('/create',authMiddleware, createOrUpdateReview);
router.get('/getreviews', getReviews);
router.delete('/delete/:id', deleteReview);
router.put('/update/:id',authMiddleware,updateReview);

export default router;
