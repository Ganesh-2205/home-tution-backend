import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const tutorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    index : true
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
  bio:{
    type:String,
    required:true
  },
  subjects: { 
    type: [String],
    required: true 
  },
  availability: {
    type: String, 
    required: true
  },
  ratings: { 
    type: Number, 
    default: 0 
  },
  reviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }],
  fees: { 
    type: Map,
    of: Number, // Key: subject name, Value: fee for that subject
    required: true
  }
});

const Tutor = mongoose.model('Tutor', tutorSchema);
export default Tutor;
