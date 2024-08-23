import Review from '../models/reviewModel.js';
import Tutor from '../models/tutorModel.js';
import TuitionCenter from '../models/tuitioncenterModel.js';

// Create a new review
// Create or update a review
export const createOrUpdateReview = async (req, res) => {
  try {
    const { userId, reviewText, rating, reviewedEntityId, reviewedEntityType } = req.body;

    if (!userId || !reviewText || rating == null || !reviewedEntityId || !reviewedEntityType) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    if (reviewText.trim() === '') {
      return res.status(400).send({ message: 'Review text cannot be empty' });
    }

    let entity;
    if (reviewedEntityType === 'Tutor') {
      entity = await Tutor.findById(reviewedEntityId);
    } else if (reviewedEntityType === 'TuitionCenter') {
      entity = await TuitionCenter.findById(reviewedEntityId);
    }

    if (!entity) {
      return res.status(404).send({ message: `${reviewedEntityType} not found` });
    }

    // Check if a review already exists for this user and entity
    let review = await Review.findOne({ userId, reviewedEntityId, reviewedEntityType });

    if (review) {
      // Update existing review
      review.reviewText = reviewText;
      review.rating = rating;
      await review.save();
      return res.status(200).send({ message: 'Review updated successfully', review });
    } else {
      // Create new review
      review = await new Review({ userId, reviewText, rating, reviewedEntityId, reviewedEntityType }).save();
      entity.reviews.push(review._id);
      await entity.save();
      return res.status(201).send({ message: 'Review created successfully', review });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error processing review', error: error.message });
  }
};

// Get all reviews for a specific entity
export const getReviews = async (req, res) => {
  const { reviewedEntityId, reviewedEntityType } = req.query;

  if (!reviewedEntityId || !reviewedEntityType) {
    return res.status(400).send({ message: 'All the fields are required' });
  }

  try {
    const reviews = await Review.find({ reviewedEntityId, reviewedEntityType }).populate('userId');

    if (reviews.length === 0) {
      return res.status(404).send({ message: 'No reviews found for the specified entity' });
    }

    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error fetching reviews', error });
  }
};

// Delete a review by ID
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).send({ message: 'Review not found' });
    }

    let entity;
    if (review.reviewedEntityType === 'Tutor') {
      entity = await Tutor.findById(review.reviewedEntityId);
    } else if (review.reviewedEntityType === 'TuitionCenter') {
      entity = await TuitionCenter.findById(review.reviewedEntityId);
    }

    if (entity) {
      entity.reviews.pull(review._id);
      await entity.save();
    }

    await Review.deleteOne({ _id: id });

    res.status(200).send({ message: 'Review deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error deleting review', error });
  }
}

// Edit a review

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, reviewText, rating } = req.body;

    if (!id || !userId || !reviewText || rating == null) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).send({ message: 'Review not found' });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).send({ message: 'Not Authorized' });
    }

    review.reviewText = reviewText;
    review.rating = rating;
    await review.save();

    res.status(200).send({ message: 'Review Updated', review });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error Updating', error });
  }
};

