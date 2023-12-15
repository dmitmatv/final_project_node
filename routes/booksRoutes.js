import express from 'express';
import {Review, User, Book} from '../models/user.js';

const router = express.Router();

// POST route to save a book to the reading list
router.post('/:userId/reading-list/:title', async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookTitle = req.params.title;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the book is already in the reading list
        const isBookInReadingList = user.readingList.some((book) => book.book === bookTitle);

        if (isBookInReadingList) {
            return res.status(400).json({ error: 'Book is already in the reading list' });
        }

        // Add the book to the reading list
        user.readingList.push({ book: bookTitle });
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

        const book = await Book.create(req.body);

        res.json(book);
    } catch (error) {
        console.error('Error creating book', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;