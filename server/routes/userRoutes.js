const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path')

const { User } = require('../schema.js');
const verifyTokenMiddleware = require('../middleware/verify_token');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_pictures');
    },
    filename: (req, file, cb) => {
        const userId = req.userId;
        cb(null, `${userId}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });


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
router.post('/upload_profile_picture', verifyTokenMiddleware, upload.single('profilePicture'), async (req, res) => {
    const profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/profile_pictures/${req.file.filename}`;

    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Update the user's profilePicture field
        user.profile.profilePicture = profilePictureUrl;
        user.profile.isProfilePictureSet = true;
        await user.save();

        return res.status(200).json({ profilePictureUrl, isProfilePictureSet: true, message: 'Profile picture uploaded successfully', success: true });
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
            'isAvatarSet': avatar === "undefined" ? false : true,
        };

        if (dob !== '') {
            updatedProfile['profile.dob'] = new Date(dob);
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, updatedProfile, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        console.log("printing updated user", user)
        res.status(200).json({ user, success: true, message: 'User details updated successfully' });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ error: 'Server error occurred', success: false, message: 'Server under maintenance' });
    }
});

//! Update user profile
router.post('/update_user_info', verifyTokenMiddleware, upload.single('profilePicture'), async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    try {
        const userId = req.userId;
        const { username, displayName, gender, bio, dob } = req.body;

        // Convert dob from "xxxx-xx-xx" format to Date object
        const formattedDob = new Date(dob);

        const updatedProfile = {
            'username': username,
            'profile.displayName': displayName,
            'profile.gender': gender,
            'profile.bio': bio,
        };

        if (req.file) {
            const profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/profile_pictures/${req.file.filename}`;
            updatedProfile['profile.profilePicture'] = profilePictureUrl;
        }

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
        const userId = req.userId;

        // Find the user and populate the friends field
        const user = await User.findById(userId).populate({
            path: 'friends.friend',
            select: 'username email profile.profilePicture profile.isProfilePictureSet displayName'
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract only the friend information
        const contacts = user.friends.map(f => f.friend);

        res.status(200).json({ contacts, message: "Contacts fetched successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch Contacts." });
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

        res.status(200).json({ isSet: user.isAvatarSet, image: user.avatar, user });
    } catch (error) {
        res.status(500).json({ message: "Error while uploading avatar" })
    }
})

const createFriendRequestObject = (sender) => ({
    sender: sender._id,
    username: sender.username,
    profilePicture: sender.profile.profilePicture,
    status: 'pending',
    createdAt: Date.now(),
});

const createNotificationObject = (message, profilePicture, friendRequestId) => ({
    type: 'friend_request',
    status: 'pending',
    message,
    profilePicture,
    friendRequestId,
    createdAt: Date.now(),
});

//! Send friend request
router.post('/send_friend_request', verifyTokenMiddleware, async (req, res) => {
    try {
        const senderId = req.userId;
        const { receiverUniqueId } = req.body;

        const sender = await User.findById(senderId);
        const receiver = await User.findOne({ uniqueId: receiverUniqueId });

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        if (sender.friends.includes(receiver._id)) {
            return res.status(400).json({ message: "You are already friends" });
        }

        // Check if a friend request already exists
        const existingRequest = receiver.friendRequests.find(request => request.sender.toString() === senderId);

        if (existingRequest && existingRequest.status === "pending") {
            return res.status(400).json({ message: "Friend request already pending" });
        }

        // Add sender to receiver's friend requests list
        const friendRequestObj = createFriendRequestObject(sender);
        receiver.friendRequests.push(friendRequestObj);
        await receiver.save();

        const friendRequestId = receiver.friendRequests[receiver.friendRequests.length - 1]._id;

        // Add notification for the sender
        const notificationMessage = `Friend request sent to ${receiver.username}`;
        const notificationObj = createNotificationObject(notificationMessage, receiver.profile.profilePicture, friendRequestId);
        sender.notifications.push(notificationObj);
        await sender.save();

        const receiverObj = {
            receiverId: receiver._id,
            sender: senderId,
            friendRequestId,
        };

        res.status(200).json({ message: `Friend request sent to ${receiver.uniqueId}`, receiverObj, notificationObj });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while adding user" });
    }
});


//! Fetch friend request by id
router.get('/fetch_friend_request', verifyTokenMiddleware, async (req, res) => {
    try {
        const { senderId, friendRequestId, receiverId } = req.query; // Use query instead of body
        console.log(senderId, receiverId, friendRequestId)
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        const friendRequest = receiver.friendRequests.id(friendRequestId);
        if (!friendRequest) {
            return res.status(404).json({ error: "Friend request not found" });
        }
        res.status(200).json({ friendRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch friend request" });
    }
});

//! Respond to friend request
router.post('/response_friend_request', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { status, friendRequestId } = req.body;
        console.log(status, friendRequestId);

        // Find the friend request
        const friendRequest = user.friendRequests.id(friendRequestId);
        if (!friendRequest) return res.status(404).json({ message: 'Friend request not found' });

        if (status === 'accept') {
            // Accept the friend request
            user.friends.push({
                friend: friendRequest.sender,
                createdAt: Date.now()
            });

            // Update friend request status
            friendRequest.status = 'accepted';

            // Update the sender's friend list and notification
            const sender = await User.findById(friendRequest.sender);
            sender.friends.push({
                friend: userId,
                createdAt: Date.now()
            })

            // Update existing notification
            const notification = sender.notifications.find(
                notif => notif.friendRequestId.toString() === friendRequestId
            );
            if (notification) {
                notification.status = 'accepted';
            }

            await sender.save();
        } else if (status === 'reject') {
            // Reject the friend request
            friendRequest.status = 'rejected';

            // Update the sender's notification
            const sender = await User.findById(friendRequest.sender);

            const notification = sender.notifications.find(
                notif => notif.friendRequestId.toString() === friendRequestId
            );
            if (notification) {
                notification.status = 'rejected';
            }

            await sender.save();
        } else {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await user.save();
        res.status(200).json({ status: `${status}ed` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while responding to friend request' });
    }
});
//! Fetch latest contact
router.get('/fetch_latest_contact', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate({
            path: 'friends.friend',
            select: 'username email  profile.profilePicture profile.isProfilePictureSet profile.displayName'
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const latestFriend = user.friends.length > 0 ? user.friends[user.friends.length - 1] : null;

        if (!latestFriend) {
            return res.status(404).json({ message: 'No friends found' });
        }
        console.log(latestFriend)

        res.status(200).json({latestFriend: latestFriend.friend});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch latest contact' });
    }
});

//! Fetch contact profile data
router.get('/fetch_contact_data/:contactProfileId', verifyTokenMiddleware, async (req, res) => {
    try {
        const contactProfileId = req.params.contactProfileId;
        const contactProfile = await User.findById(contactProfileId).select('-password');

        if (!contactProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(contactProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//! Delete a friend
router.delete('/delete_contact/:friendId', verifyTokenMiddleware, async (req, res) => {
    try {
      const { friendId } = req.params;
      const userId = req.userId; // Assuming userId is extracted from JWT token
  
      // Find the user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Find the index of the friend to delete
      console.log(friendId)
      const friendIndex = user.friends.findIndex(friend => friend.friend.toString() === friendId);
      console.log(friendIndex)
      if (friendIndex === -1) {
        return res.status(404).json({ message: "Friend not found" });
      }
  
      // Remove the friend from the array
      user.friends.splice(friendIndex, 1);
      await user.save();
  
      // Now remove the current user from the friend's friends list
      const friendUser = await User.findById(friendId);
      if (!friendUser) {
        return res.status(404).json({ message: "Friend user not found" });
      }
  
      const currentUserIndex = friendUser.friends.findIndex(friend => friend.friend.toString() === userId);
      if (currentUserIndex !== -1) {
        friendUser.friends.splice(currentUserIndex, 1);
        await friendUser.save();
      }
  
      res.status(200).json({ message: "Friend deleted successfully", deletedFriendId: friendId });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting friend" });
    }
  });
  


module.exports = router;
