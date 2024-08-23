import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  email: { 
    type: String,
    required: true, 
    unique: true
  },
  password: { 
    type: String,
    required: true 
  },
  photo: {
    type: String,
    default:process.env.DEFAULT_UPLOAD,
  },
  role: {
    type: String,
    enum: ['Student','Admin'],
    default:"Student"
  },
  profileInfo: { 
    type: String
  },
},{timestamps:true});


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
