const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { User } = require('../schema.js');

const verifyTokenMiddleware = require('../middleware/verify_token');

//! Signup
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password);
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const user = new User({
            username,
            email,
            password,
        });
        console.log(user);
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        res.send({ user, success: true, message: 'User Registered', token });
    } catch (error) {
        console.log(error, 'Server error occurred while creating a new user');
        res.status(500).json({ error: 'Server error occurred', success: false, message: 'Server under maintenance' });
    }
});

//! Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        if (user.password === password) {
            res.send({ user, success: true, message: 'Login successful', token });
        } else {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.log(error, 'Server error occurred while logging in');
        res.status(500).json({ error: 'Server error occurred', success: false, message: 'Server under maintenance' });
    }
});

//! Verify token
router.get('/verify_token', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ user, success: true, message: "User verified" });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error occurred', message: error.message });
    }
});

//! Upload avatar
router.post('/upload_avatar', verifyTokenMiddleware, async (req, res) => {
   try {
    const userId = req.userId;
    const { image } = req.body;

    const user = await User.findByIdAndUpdate(
        //1
        userId,
        //2: Fields to update
        {
            isAvatarSet: true,
            avatar: image,
        },
        //3: Returns the updated document instead of old one.
        { 
            new: true
        }
    )
    console.log(user)

    res.status(200).json({isSet: user.isAvatarSet, image: user.avatar, user});
   } catch (error) {
    res.status(500).json({message: "Error while uploading avatar"})
   }
})

//! Fetch contacts
router.get('/fetch_contacts', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId
        const contacts = await User.find({ _id: { $ne: userId } }).select('username email isAvatarSet avatar')
        console.log(contacts)
        res.status(200).json({ contacts, message: "Contacts fetched successfully." })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch Contacts." })
    }

})

module.exports = router;
