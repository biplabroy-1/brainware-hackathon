import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    clerkId?: string;
    email: string;
    username:string,
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    _id: { type: String, required: true },
    clerkId: { type: String, unique: true },
    username:{
        type:String,
        unique:true
    },
    email: { type: String, unique: true, required: true },
    firstName: { type: String },
    lastName: { type: String },
    profileImageUrl: { type: String }
},
{
    timestamps:true
});

// Check if the model already exists before defining it
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 