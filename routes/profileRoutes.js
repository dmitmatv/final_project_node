import express from 'express';
const router = express.Router();
import { User } from '../models/user.js';

// GET profile data
router.get('/:userId', async (req, res) => {
    try {
        let user;


        // Fetch the profile of the specified userId
        user = await User.findById(req.params.userId)
            .populate('readingList')
            .populate('writtenList')
            .populate('reviewList')
            .exec();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Customize the user object based on roles if needed
        //const userForClient = customizeUserForClient(user, user);
        res.json({ user: user });
    } catch (error) {
        console.error('Error fetching user profile', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE user account
router.delete('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the requester has permission to delete the account
        if (req.user.role === 'Admin' || req.user.id === userId) {
            const deletedUser = await User.deleteOne(userId);

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User account deleted successfully' });
        } else {
            res.status(403).json({ error: 'Permission denied' });
        }
    } catch (error) {
        console.error('Error deleting user account', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// PATCH update user profile
router.patch('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;



        const updatedUser = await User.findOneAndUpdate({_id: userId}, { $set: req.body.editedUser  }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        //const userForClient = customizeUserForClient(updatedUser, req.user);
        res.json({ user: updatedUser });
    } catch (error) {
        console.error('Error updating user profile', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH remove book from list (common for readingList and writtenList)
router.patch('/:userId/:listType/remove/:itemId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const listType = req.params.listType;
        const itemIdToRemove = req.params.itemId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

/*
        const filteredList = user[listType].filter(
            (item) => item._doc.book.toString() !== itemIdToRemove
        )

*/
//        const data = await user.updateOne(userId, {readingList: filteredList})

        // Check if the book exists in the specified list (readingList or writtenList)
        //const list = user[listType];

        /*if (!list || list.find((item) => item._id === "5") === -1) {
            return res.status(404).json({ error: 'Book not found in the list' });
        }*/

        // Remove the book from the specified list
        //user[listType].pull(itemIdToRemove);
        const updatedUser = await User.findByIdAndUpdate(userId, {$pull: { readingList:
                    { book: itemIdToRemove}}}
            , {new:true});
        //await user.save();


        res.json({ message: 'Book removed from list successfully' });
    } catch (error) {
        console.error('Error removing book from list', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Customize the user object based on roles if needed
const customizeUserForClient = (user, loggedInUser) => {
    if (!loggedInUser) {
        // If not logged in, only expose basic information
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            readingList: user.readingList,
        };
    }
    if (loggedInUser.role === 'Admin') {
        // If logged in as Admin, expose all information
        return user.toObject();
    }
    if (loggedInUser.id === user.id) {
        // If logged in as the same user, expose all information
        return user.toObject();
    }
    // For other cases, expose limited information
    return {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        readingList: user.readingList,
    };
};

export default router;