import mongoose from 'mongoose';

const connectDB = () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/asset-management';
  
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('📦 MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
};

export default connectDB;