const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectToMongoDB = async (mongo_uri) => {
    try {
        await mongoose.connect(mongo_uri, {
            family: 4
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error, 'Error connecting to MongoDB');
    }
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        // required: true
    },
    uniqueId: {
        type: String,
    },
    friends: [{
        friend: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
    friendRequests: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    notifications: [{
        friendRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FriendRequest'
        },
        type: {
            type: String,
        },
        status: {
            type: String,
            enum: ['accepted', 'rejected', 'pending'],
            default: 'pending'
        },
        message: {
            type: String,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    profile: {
        displayName: {
            type: String,
            // required: true
        },
        bio: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        dob: {
            type: Date,
        },
        gender: {
            type: String,
            // enum: ['male', 'female', 'other'],
        },
        profilePicture: {
            type: String,
        },
        isProfilePictureSet: {
            type: Boolean,
            default: false
        }
    },
    email: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
        select: false,
    },
    type: {
        type: String,
        // required: true
    },
    isAvatarSet: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: "",
    },
    onlineStatus: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//! will run before the document is created.
userSchema.pre('save', function (next) {
    const email = this.email;
    const uniqueId = email.substring(0, email.indexOf('@'));
    this.uniqueId = uniqueId;
    next();
});

const messageSchema = new mongoose.Schema({
    message: {
        text: { type: String, required: true },
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
    {
        timestamps: true,
    });

const User = mongoose.model('User', userSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { User, Message, connectToMongoDB };
