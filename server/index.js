const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const {connectToMongoDB, User} = require('./schema.js')

const  {Server} = require('socket.io')


const app = express();
require('dotenv').config()

app.use(bodyParser.json())
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

global.count = new Map();

count.set("count", []);

global.onlineUsers = new Map();

io.on('connection', (socket) => {



    
    console.log(`User connected: ${socket.id}`);

    
    global.chatSocket = socket;


    socket.on("add_user", async (data) => {
        console.log("add user running")
            onlineUsers.set(socket.id, [{userId: data.userId, socketId: socket.id, username: data.username, loginStatus: true}])
            const userId = data.userId;
            await User.findOneAndUpdate({_id: userId}, {onlineStatus: true})
        
    })

    socket.on("set_status_to_ofline", async (userId) => {
        const user = await User.findOneAndUpdate({_id: userId}, {onlineStatus: false}, {new: true}).select('username email onlineStatus')
        
        for (let [key, value] of onlineUsers.entries()) {
            if (value.some(user => user.userId === userId)) {
                // Remove the user from the map
                onlineUsers.delete(key);
                console.log(`Removed user with userId: ${userId} from onlineUsers map`);
                break; // Exit the loop once the user is found and removed
            }
        }
        socket.disconnect(true);
    })
    
    socket.on("send_message", (data)=> {
        let sendUserSocket;
        for (let [key, value] of onlineUsers.entries()) {
            if (value.some(user => user.userId === data.to)) {
                sendUserSocket = key
                
                break; // Exit the loop once the user is found and removed
            }
        }
        if(sendUserSocket) {
            console.log("Sent message ",data)
            const message = data.message;
            const date = data.date
            socket.to(sendUserSocket).emit('message_recieve', message, date)
        }
    })

    // Handle disconnections
    socket.on('disconnect',  async() => {

        const sendUserSocket = onlineUsers.get(socket.id);
        if(sendUserSocket) {
            console.log(sendUserSocket)
            const disconnectedUserId = sendUserSocket[0].userId;
            await User.findOneAndUpdate({_id: disconnectedUserId}, {onlineStatus: false})
            onlineUsers.delete(sendUserSocket[0].socketId)
        }

      console.log(`User disconnected: ${socket.id}`);

    });
  
    // Handle errors
    socket.on('error', (error) => {
      console.error(`Error occurred: ${error}`);
    });
  });

//   io.on('connection', (socket) => {

//     const currentArray = count.get("count");
//     currentArray.push(1);
//     count.set("count", currentArray);
//     console.log(count)


//     console.log("**************************start*************************")
    
//     console.log(`User connected: ${socket.id}`);
//     console.log(count)

    
//     global.chatSocket = socket;

//     socket.on('login_user', async (userId) => {
//         console.log("loggin in user ID", userId)
//         const sendUserSocket = onlineUsers.get(userId);
//         console.log("his socket id ", sendUserSocket)
//         await User.findOneAndUpdate({userId}, {status: true})

//     })

//     socket.on("add_user", data => {
//         onlineUsers.set(data.userId, socket.id)
//         onlineUsers.set("username", data.username)
//         onlineUsers.set("loginStatus", true)
        
//     })
    
//     socket.on("send_message", (data)=> {
//         // console.log("Sent message ",data)
//         const sendUserSocket = onlineUsers.get(data.to);
//         const message = data.message;
//         const date = data.date
//         // console.log(message)
//         if(sendUserSocket) {
//             socket.to(sendUserSocket).emit('message_recieve', message, date)
//         }
//     })


//     // Handle disconnections
//     socket.on('disconnect', () => {
//       console.log(`User disconnected: ${socket.id}`);

//     });
  
//     // Handle errors
//     socket.on('error', (error) => {
//       console.error(`Error occurred: ${error}`);
//     });
//   });


