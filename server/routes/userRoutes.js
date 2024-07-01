const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { User } = require('../schema.js');

const verifyTokenMiddleware = require('../middleware/verify_token');

//! Signup
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const user = new User({
            username,
            email,
            password,
        });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        res.send({ user, success: true, message: 'User Registered', token });
    } catch (error) {
        res.status(500).json({ error: 'Server error occurred', success: false, message: 'Server under maintenance' });
    }
});

//! Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        let user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
       
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
       
        if (user.password === password) {
            let user = await User.findOne({ username });
            
            res.send({ user, success: true, message: 'Login successful', token });
        } else {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error occurred', success: false, message: 'Server under maintenance' });
    }
});

//! Upload Profile Picture
router.post('/upload_profile_picture', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        const { profilePicture } = req.body;

        // Update the user's profilePicture field
        user.profile.profilePicture = profilePicture;
        user.profile.isProfilePictureSet = true;
        await user.save();

        return res.status(200).json({isProfilePictureSet: true, message: 'Profile picture uploaded successfully', success: true });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});

//! Upload User Details
router.post('/upload_user_details', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { displayName, bio, dob, gender, avatar } = req.body;
        console.log(req.body)
        const updatedProfile = {
            'profile.displayName': displayName,
            'profile.bio': bio,
            'profile.gender': gender === "Select" ? "" : gender,
            'profile.profilePicture': avatar,
            'avatar': avatar,
            'isAvatarSet': avatar==="undefined" ? false : true,
        };

        if (dob !== '') {
            updatedProfile['profile.dob'] = new Date(dob);
        }
        
        const user = await User.findByIdAndUpdate({_id: userId}, updatedProfile, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        console.log("printing updated user",user)
        res.status(200).json({ user, success: true, message: 'User details updated successfully' });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ error: 'Server error occurred', success: false, message: 'Server under maintenance' });
    }
});

//! Update user profile
router.post('/update_user_info', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { profilePicture, username, displayName, gender, bio, dob } = req.body;

        // Convert dob from "xxxx-xx-xx" format to Date object
        const formattedDob = new Date(dob);

        const updatedProfile = {
            'profile.profilePicture': profilePicture,
            'username': username,
            'profile.displayName': displayName,
            'profile.gender': gender,
            'profile.bio': bio,
        };

        if (!isNaN(formattedDob.getTime())) {
            updatedProfile['profile.dob'] = formattedDob;
        }

        const user = await User.findByIdAndUpdate(userId, updatedProfile, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        res.status(200).json({ user, success: true, message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Server error occurred', success: false, message: 'Server under maintenance' });
    }
});



//! Verify token
router.get('/verify_token', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const token = req.token;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.status(200).json({ user, token, success: true, message: "User verified" });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error occurred', message: error.message });
    }
});

//! Fetch contacts
router.get('/fetch_contacts', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId
        const contacts = await User.find({ _id: { $ne: userId } }).select('username email isAvatarSet profile.profilePicture profile.isProfilePictureSet')
       
        res.status(200).json({ contacts, message: "Contacts fetched successfully." })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch Contacts." })
    }

})

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

    res.status(200).json({isSet: user.isAvatarSet, image: user.avatar, user});
   } catch (error) {
    res.status(500).json({message: "Error while uploading avatar"})
   }
})


module.exports = router;
