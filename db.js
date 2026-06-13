const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL, {});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
})

db.on('error', (err) => {
    console.log('Error connecting to MongoDB', err);
})

db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
})

module.exports = db;