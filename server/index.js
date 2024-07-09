const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const { connectToMongoDB, User } = require('./schema.js')

const { Server } = require('socket.io')


const app = express();
require('dotenv').config()

// Increase the limit for JSON payloads
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed

// Increase the limit for URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cors())

//! Routes
app.use('/auth', require('./routes/userRoutes.js')); 
app.use('/message', require('./routes/messageRoutes.js')); 

//! Serve static files from the 'uploads/profile_pictures' directory
app.use('/uploads/profile_pictures', express.static(path.join(__dirname, 'uploads/profile_pictures')));

//! Environment variables
const port = process.env.PORT
const mongo_uri = process.env.MONGO_URI

connectToMongoDB(mongo_uri);


const server = app.listen(port, () => {
    console.log("Server running on port: ", port)
})

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "DELETE", "UPDATE"],
        credentials: true
    }
})

global.onlineUsers = new Map();


io.on('connection', async (socket) => {
    const data = JSON.parse(socket.handshake.query.data);
    onlineUsers.set(socket.id, [{ socketId: socket.id, userId: data._id, username: data.username }])
    // console.log(onlineUsers)
    const userId = data._id;
    await User.findOneAndUpdate({ _id: userId }, { onlineStatus: true })
    console.log("user connected:", data.username, " | ", socket.id)
    console.log(onlineUsers)

    //! handle send message & recieve message
    socket.on("send_message", (data) => {
        let sendUserSocket;
        for (let [key, value] of onlineUsers.entries()) {
            if (value.some(user => user.userId === data.to)) {
                sendUserSocket = key

                break; // Exit the loop once the user is found and removed
            }
        }
        if (sendUserSocket) {
            const message = data.message;
            const date = data.date
            socket.to(sendUserSocket).emit('message_recieve', message, date)
        }
    })

    //! handle send friend request
    socket.on("send_friend_request", (receiverObj) => {
        console.log(receiverObj)
        let sendUserSocket;
        for (let [key, value] of onlineUsers.entries()) {
            if (value.some(user => user.userId === receiverObj.receiverId)) {
                sendUserSocket = key

                break; // Exit the loop once the user is found and removed
            }
        }
        console.log(sendUserSocket)
        socket.to(sendUserSocket).emit('request_receive', receiverObj)
    })

    //! handle update friend request notification
    socket.on('update_friend_request_notification', (data) => {
        const {status, friendRequestObj} = data;
        let sendUserSocket;
        for (let [key, value] of onlineUsers.entries()) {
            if (value.some(user => user.userId === friendRequestObj.sender)) {
                sendUserSocket = key
                break; // Exit the loop once the user is found and removed
            }
        }   
        console.log("running 0: ", data)
        socket.to(sendUserSocket).emit('update_friend_request_notification_receive', {status, friendRequestObj})


    })
    //! handle user logout
    socket.on("set_status_to_ofline", async (userId) => {
        const user = await User.findOneAndUpdate({ _id: userId }, { onlineStatus: false }, { new: true }).select('username email onlineStatus')
        socket.disconnect(true);
    })

    //! Handle disconnections
    socket.on('disconnect', async () => {

        const sendUserSocket = onlineUsers.get(socket.id)[0];
        const disconnectedUserId = sendUserSocket.userId;
        await User.findOneAndUpdate({ _id: disconnectedUserId }, { onlineStatus: false })
        onlineUsers.delete(sendUserSocket.socketId)
        console.log("user disconnect:", sendUserSocket.username, " | ", socket.id)


    });

    //! Handle errors
    socket.on('error', (error) => {
        console.error(`Error occurred: ${error}`);
    });
});

