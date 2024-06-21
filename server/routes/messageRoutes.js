const express = require('express');
const router = express.Router();

const { User } = require('../schema.js');
const { Message } = require('../schema.js');

const verifyTokenMiddleware = require('../middleware/verify_token');

router.get('/', async (req, res) => {
    res.send("hello")
})

router.post('/send_message', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
       
        const { from, to, message } = req.body

        const data = await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        })

        return res.status(200).json({ message: "Message sent successfully.", data })

    } catch (error) {
        return res.status(500).json({ message: "Server error occured." })
    }
})

router.get('/fetch_all_messages', verifyTokenMiddleware, async (req, res) => {
    try {
        const { from, to } = req.query;
        const messages = await Message.find({
            users: {
              $all: [from, to],
            },
          }).sort({ updatedAt: 1 });
        
        const projectedMessages = messages.map(msg => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                timeStamp: msg.updatedAt,
            }
        });
        res.status(200).json({ projectedMessages })
    } catch (error) {
        res.status(500).json({ message: "Server error: Could not fetch messages" })
    }
})

module.exports = router