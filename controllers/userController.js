import { comparePassword, hashPassword } from "../helper/authhelper.js";
import UserModel from '../models/userModel.js';
import TutorModel from '../models/tutorModel.js';
import TuitionCenterModel from '../models/tuitioncenterModel.js';
import JWT from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
    const { name, email, password, role, photo } = req.body;
    if(!name || !email || !password ){ 
        return res.send({message:'All the fields are mandatory'})
    }
    const existinguser=await UserModel.findOne({email})
    if(existinguser){
        return res.status(200).send({
            success:false,
            message:'Already Register please login',
        })
    } 
    const hashedPassword=await hashPassword(password)
    const user =await new UserModel({ name, email, password:hashedPassword,photo:photo, role }).save();
    res.status(201).send({
        success:true,
        message:"User Register Successfully",
        user,
    })
  }   
   catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error in Registeration',
        error,
    });
}   
};

export const login= async (req, res) => {
    try {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).send({
            success:false,
            message:'Invalid email or password'
        });
    }
    let user = await UserModel.findOne({ email });
    let role = 'User';

    if (!user) {
      user = await TutorModel.findOne({ email });
      role = 'Tutor';
    }

    if (!user) {
      user = await TuitionCenterModel.findOne({ email });
      role = 'Tuition Center';
    }

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "The email is not registered"
      });
    }
    const match=await comparePassword(password,user.password)
    if(!match){
        return res.status(200).send({
            success:false,
            message:'Invalid credentials',
        });
    }
    const token= await JWT.sign({_id:user._id,role: user.role},process.env.JWT_SECERT,{expiresIn:"1d",});
    res.status(200).send({
        success:true,
        message:'login successfully',
        user:{
            name:user.name,
            email:user.email,
            role:user.role,
            id:user._id,
            photo:user.photo || "",
        },
        token,
    });
  } catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error In Login',
        error
    });
}
};

export const forgotPassword = async (req, res) => {
    try {
      const { email, newpassword } = req.body;
      if (!email || !newpassword) {
        return res.status(400).send({ message: 'All the fields are mandatory' });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong Email",
        });
      }
  
      const hashed = await hashPassword(newpassword);
      await UserModel.findByIdAndUpdate(user._id, { password: hashed });
  
      return res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: 'Something went wrong',
        error
      });
    }
};
  

export const updateUser = async (req, res) => {
  try {
      const { userId } = req.params;
      const { name, email, password, profileInfo } = req.body;

      const user = await UserModel.findById(userId);
      if (!user) {
          return res.status(404).send({ success: false, message: "User not found" });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = await hashPassword(password);
      if (profileInfo) user.profileInfo = profileInfo;
      if (req.file) user.photo = req.file.path;

      await user.save();

      res.status(200).send({
          success: true,
          message: "User updated successfully",
          user: {
              name: user.name,
              email: user.email,
              role: user.role,
              id: user._id,
              photo: user.photo,
          },
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: 'Error updating user details',
          error,
      });
  }
};
