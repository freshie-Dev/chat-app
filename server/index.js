const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
require('dotenv').config()

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
  };

app.use(bodyParser.json())
app.use(cors())

//! 1: User Route 
app.use('/auth', require('./routes/userRoutes.js'));


const port = process.env.PORT
const mongo_uri = process.env.MONGO_URI

const options = {
    family: 4 // Use IPv4, skip trying IPv6
};

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongo_uri, options);
        console.log('Connected to MongoDB')

    } catch (error) {
        console.log(error, 'Error connecting to MongoDB')
    }
}
connectToMongoDB();


const server = app.listen(port, () => {
    console.log("Server running on port: ", port)
})