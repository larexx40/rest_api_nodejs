import mongoose, { Document } from 'mongoose';
import { User } from '../types';

export interface IUser extends User, Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
});

const  UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;