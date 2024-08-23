import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewText: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'reviewedEntityType'
  },
  reviewedEntityType: {
    type: String,
    required: true,
    enum: ['Tutor', 'TuitionCenter']
  }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
