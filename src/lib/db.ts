import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/hackathon';

    if (!dbUrl) {
        throw new Error('DATABASE_URL is not defined');
    }

    return mongoose.connect(dbUrl);
};

export default connectDB;
