const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DB = process.env.DB || "mongodb+srv://Hicham9Move:Hicham9Move@cluster0.uhlqzxs.mongodb.net/?retryWrites=true&w=majority";
const database = async () => {

    try {
        // Connect to MongoDB with the appropriate connection string
await mongoose.connect(DB, {
            useNewUrlParser: true, // Use the new URL parser
            useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('error mongodb', error)

        // console.log(error)
        // console.error(error)
        // console.error('Error connecting to MongoDB:', error);
    }
};

// Call the database function to connect
module.exports = database;
