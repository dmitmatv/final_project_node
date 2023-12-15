import {User} from '../models/user.js';

const authService = {
    authenticateUser: async (email, password) => {
        // Find the user in the database
        const user = await User.findOne({ email, password });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        return user._doc._id;
    },

    generateToken: (user) => {
        const token = 'dummy_token';

        return token;
    },

    registerUser: async ({ firstName, lastName, email, password, role }) => {
        // Create a new user in the database
        const newUser = new User({
                                     firstName,
                                     lastName,
                                     email,
                                     password,
                                     role,
                                 });

        await newUser.create();

        return newUser;
    },

    getCurrentUser: async(userId) => {
        try {
            const currentUser = User.findById(userId);

            if (!currentUser) {
                throw new Error('User not found');
            }

            return currentUser;
        } catch (error) {
            console.error('Error fetching current user', error);
            throw new Error('Internal Server Error');
        }

    }
};

export default authService;