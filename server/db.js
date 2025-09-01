const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL;
// const mongoUrlLocal= process.env.MONGODB_URL_Local


mongoose.connect(mongoURL);

const db=mongoose.connection;
db.on('connected',()=>{
    console.log("Connected to MongoDB");
});
db.on('error', (error) => {
    console.error("MongoDB connection error:", error);
});
db.on('disconnected', () => {
    console.log("Disconnected from MongoDB");
});