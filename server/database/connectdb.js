const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// Build MongoDB URI dynamically
const {
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_NAME,
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_AUTH_SOURCE,
} = process.env;

const mongoURI = `mongodb://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASS)}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}?authSource=${MONGODB_AUTH_SOURCE}`;

// Connect function
const connectDB = async () => {
  try {
    console.log(`🔌 Connecting to MongoDB at ${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME} ...`);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Handle unexpected disconnections
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Retrying...');
});

module.exports = connectDB;