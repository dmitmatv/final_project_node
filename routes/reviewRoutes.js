import express from 'express';
import {Review, User} from '../models/user.js';

const router = express.Router();

// GET route to fetch reviews for a specific book
router.get('/:bookName', async (req, res) => {
    try {
        const bookName = req.params.bookName;

        // Find reviews based on the bookName
        const reviews = await Review.find({ bookTitle: bookName });

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST route to save a book to the review list
router.post('/:userId/review-list/:reviewId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const reviewId = req.params.reviewId;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the book is already in the reading list
        const isReviewInReviewList = user.reviewList.some((item) => item.review === reviewId);

        if (isReviewInReviewList) {
            return res.status(400).json({ error: 'Book is already in the reading list' });
        }

        // Add the book to the reading list
        user.reviewList.push({ review: reviewId });
        await user.save();

        res.json({ message: 'Book added to reading list successfully' });
    } catch (error) {
        console.error('Error saving book to reading list', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const bookName = req.body.bookTitle;

        const review = await Review.create(req.body);

        res.json(review);
    } catch (error) {
        console.error('Error creating review', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:reviewId', async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.deleteOne({_id: reviewId});

        res.json(review);
    } catch (error) {
        console.error('Error deleting review', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default router;