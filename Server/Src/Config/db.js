require('dotenv').config()  // Ensure this is at the top
const mongoose = require('mongoose')

//Function to connect with MongoDB
//---------------------------------

const connectDB = async () => {
    try {
        //Debugging log to confirm MONGODB_URI id loaded
        console.log("MONGODB_URI",process.env.MONGODB_URI)

        //Connect to MongoDB using the URI from .env
        await mongoose.connect(process.env.MONGODB_URI)

        console.log("MongoDB connected successfully...")
    } catch (error) {
        console.error ("Error connecting to MongoDb:", error.message)
        process.exit(1) // Exit the process on error
    }
}

module.exports = connectDB

