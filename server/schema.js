const mongoose = require('mongoose')
const {Schema} = mongoose;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
    },
    type: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User};