const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { User } = require('../schema.js');

const verifyTokenMiddleware = require('../middleware/verify_token');

//! sign up signup
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
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3600s' });

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

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3600s' });

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

//! Protected route
router.get('/verify_token', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ user, success: true, message: "User verified" });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error occurred', message: error.message });
    }
});

module.exports = router;
