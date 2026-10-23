const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI;
  if (!connUri) {
    console.log('MONGODB_URI not provided. Running in resilient local JSON storage mode.');
    return null;
  }
  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`Connected to MongoDB successfully at ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return null;
  }
};

module.exports = connectDB;
