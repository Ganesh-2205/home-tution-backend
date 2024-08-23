import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const tuitionCenterSchema = new mongoose.Schema({
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
  location: { 
    type: String, 
    required: true
  },
  courses: {
     type: [String], 
     required: true 
  },
  fees: {
    type: Map,
    of: Number,
    required: true
  },
  ratings: { 
    type: Number, 
    default: 0 
  },
  description:{
    type:String,
    required:true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }],
  contactNumber: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(v) {
        // Simple validation for a contact number (e.g., must be a 10-digit number)
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid contact number!`
    }
  }
});

const TuitionCenter = mongoose.model('TuitionCenter', tuitionCenterSchema);
export default TuitionCenter;
