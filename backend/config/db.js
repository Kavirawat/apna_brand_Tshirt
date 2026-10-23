const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apna_brand_db';
    const conn = await mongoose.connect(connUri);
    console.log(`🍃 Connected to MongoDB successfully at ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('⚠️ MongoDB connection error:', error.message);

  }
};

module.exports = connectDB;
