import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Choose the appropriate database URI based on the environment
const dbUri = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST_URI : process.env.MONGO_URI;
console.log("DB: ", dbUri);

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri!);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;
