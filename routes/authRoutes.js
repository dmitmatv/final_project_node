import express from 'express';
const router = express.Router();
import authService from '../services/authService.js';
import {User} from "../models/user.js";

// POST /login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate credentials
        const userId = await authService.authenticateUser(email, password);

        //const token = authService.generateToken(user);

        // Send the user in the response
        res.json({ userId });
    } catch (error) {
        console.error('Login failed', error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// POST /signup
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        // Create a new user
        const newUser = await authService.registerUser({ firstName, lastName, email, password, role });

        // Token from backend
        const token = authService.generateToken(newUser);

        // Send the token in the response
        res.json({ token });
    } catch (error) {
        console.error('Signup failed', error);
        res.status(400).json({ error: 'Registration failed' });
    }
});

// GET /getCurrentUser
router.get('/CurrentUser/:userId', async(req, res) => {
    // Return the current user from the session
    const userId = req.params.userId;

    const currentUser = await authService.getCurrentUser(userId);

    res.json({ user: req.session.user });
});


export default router;