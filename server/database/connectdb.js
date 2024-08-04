const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const url = process.env.mongodb_url;

const connectdb = () => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((error) => {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    });
}

module.exports = connectdb;
