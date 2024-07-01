const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

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
app.use('/auth', require('./routes/userRoutes.js')); //! 1: User Route  
app.use('/message', require('./routes/messageRoutes.js')); //! 2: Message Route 

//! Environment variables
const port = process.env.PORT
const mongo_uri = process.env.MONGO_URI

connectToMongoDB(mongo_uri);


const server = app.listen(port, () => {
    console.log("Server running on port: ", port)
})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "DELETE", "UPDATE"],
        credentials: true
    }
})

global.onlineUsers = new Map();


io.on('connection', async (socket) => {
    const data = JSON.parse(socket.handshake.query.data);
    onlineUsers.set(socket.id, [{ socketId: socket.id, userId: data._id, username: data.username }])
    console.log(onlineUsers)
    const userId = data._id;
    await User.findOneAndUpdate({ _id: userId }, { onlineStatus: true })
    console.log("user connected:", data.username, " | ", socket.id)

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

    //! handle user logout
    socket.on("set_status_to_ofline", async (userId) => {
        const user = await User.findOneAndUpdate({ _id: userId }, { onlineStatus: false }, { new: true }).select('username email onlineStatus')

        // for (let [key, value] of onlineUsers.entries()) {
        //     if (value.some(user => user.userId === userId)) {
        //         // Remove the user from the map
        //         onlineUsers.delete(key);
        //         break; // Exit the loop once the user is found and removed
        //     }
        // }
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

