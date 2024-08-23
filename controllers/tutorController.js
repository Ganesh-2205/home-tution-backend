import Tutor from '../models/tutorModel.js';
import { hashPassword } from "../helper/authhelper.js";

export const createTutorProfile = async (req, res, next) => {
  try {
    const { name, email, password, subjects, bio, availability, fees, photo } = req.body;

    if (!name || !email || !password || !bio || !subjects || !availability || !fees || !photo) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const subjectArray = JSON.parse(subjects); // Parse subjects as an array
    const feeObject = JSON.parse(fees); // Parse fees as an object

    // Validate that fees include all subjects
    const missingFees = subjectArray.filter(subject => !(subject in feeObject));
    if (missingFees.length > 0) {
      return res.status(400).send({ message: `Missing fees for subjects: ${missingFees.join(', ')}` });
    }

    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
      return res.status(400).send({ message: 'Tutor profile already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const tutor = new Tutor({
      name,
      email,
      password: hashedPassword,
      subjects: subjectArray,
      bio,
      availability,
      fees: feeObject,
      photo
    });
    await tutor.save();

    res.status(201).send({
      success: true,
      message: "Tutor created successfully",
      tutor
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error creating tutor profile',
      error,
    });
  }
};

export const getTutorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tutor = await Tutor.findById(id);
    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found' });
    }
    res.json(tutor);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching tutor profile',
      error,
    });
  }
};

export const updateTutorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, subjects, bio, availability,fees , photo} = req.body;
    const tutor=await Tutor.findById(id);
    
    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found' });
    }
    if (subjects) {
      tutor.subjects = subjects.split(','); // Handle comma-separated subjects
    }
    
    if (fees) {
      try {
        tutor.fees = JSON.parse(fees); // Parse fees if provided
      } catch (error) {
        return res.status(400).send({ message: 'Invalid fees format' });
      }
    }
    
    tutor.name=name|| tutor.name;
    tutor.email=email||tutor.email;
    tutor.bio=bio||tutor.bio;
    tutor.availability=availability||tutor.availability;
    tutor.photo = photo || tutor.photo;
    const updateTutor=await tutor.save();
    res.status(200).json({
      success:true, message: 
      "Tutor updated successfully", 
      updateTutor 
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error updating tutor profile',
      error,
    });
  }
};

export const deleteTutorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tutor = await Tutor.findByIdAndDelete(id);
    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found' });
    }
    res.status(200).send({ message: 'Tutor profile deleted successfully' });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error deleting tutor profile',
      error,
    });
  }
};

export const getAllTutors = async (req, res, next) => {
  try {
    const tutors = await Tutor.find();
    res.status(200).send({success:true,tutors});
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching tutors',
      error,
    });
  }
};

export const getLatestTutors = async (req, res, next) => {
  try {
    const latestTutors = await Tutor.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).send({ success: true, latestTutors });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching latest tutors',
      error,
    });
  }
};

export const searchTutors = async (req, res) => {
  console.log("enterd in search tutors")
  try {
    const { name } = req.query; // Retrieve the 'name' query parameter
    if (!name) {
      return res.status(400).send({ message: 'Search query is required' });
    }

    const tutors = await Tutor.find({ name: { $regex: name, $options: 'i' } }); // Use regex for case-insensitive search

    if (tutors.length === 0) {
      return res.status(404).send({ message: 'No tutors found' });
    }

    res.status(200).json(tutors);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching search results',
      error,
    });
  }
};
