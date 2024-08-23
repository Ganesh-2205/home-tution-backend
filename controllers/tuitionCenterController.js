import TuitionCenter from '../models/tuitioncenterModel.js';
import { hashPassword } from '../helper/authhelper.js';

export const createTuitionCenterProfile = async (req, res, next) => {
  try {
    const { name, email, password, location, contactNumber, courses, description, fees, photo } = req.body;
    if (!name || !email || !password || !location || !contactNumber || !courses || !description || !fees || !photo) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const courseArray = JSON.parse(courses);
    const feeObject = JSON.parse(fees);

    // Validate that fees include all courses
    const missingFees = courseArray.filter(course => !(course in feeObject));
    if (missingFees.length > 0) {
      return res.status(400).send({ message: `Missing fees for courses: ${missingFees.join(', ')}` });
    }

    const existingCenter = await TuitionCenter.findOne({ email });
    if (existingCenter) {
      return res.status(400).send({ message: 'Tuition center already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const tuitionCenter = await new TuitionCenter({ 
      name, 
      email, 
      password: hashedPassword, 
      location, 
      contactNumber, 
      courses: courseArray, 
      description,
      fees: feeObject,
      photo
    }).save();

    res.status(201).send({
      success: true,
      message: "Tuition center created successfully",
      tuitionCenter
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error creating tuition center',
      error,
    });
  }
};


export const getTuitionCenterProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tuitionCenter = await TuitionCenter.findById(id);
    if (!tuitionCenter) {
      return res.status(404).send({ message: 'Tuition center not found' });
    }
    res.status(200).json(tuitionCenter);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching tuition center profile',
      error,
    });
  }
};

export const updateTuitionCenterProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, location, contactNumber, courses, description,fees,photo} = req.body;
    const tuitionCenter = await TuitionCenter.findById(id);

    if (!tuitionCenter) {
      return res.status(404).send({ message: 'Tuition center not found' });
    }

    tuitionCenter.name = name || tuitionCenter.name;
    tuitionCenter.email = email || tuitionCenter.email;
    tuitionCenter.location = location || tuitionCenter.location;
    tuitionCenter.contactNumber = contactNumber || tuitionCenter.contactNumber;
    tuitionCenter.courses =  courses ? courses.split(',').map(course => course.trim()) : tuitionCenter.courses;
    tuitionCenter.description = description || tuitionCenter.description;
    tuitionCenter.photo = photo || tuitionCenter.photo;
    if (fees) {
      try {
        tuitionCenter.fees = JSON.parse(fees); 
      } catch (error) {
        return res.status(400).send({ message: 'Invalid fees format' });
      }
    }
    const updatedTuitionCenter = await tuitionCenter.save();

    res.status(200).json({
      success: true,
      message: "Tuition center updated successfully",
      updatedTuitionCenter
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error updating tuition center profile',
      error,
    });
  }
};

export const deleteTuitionCenterProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tuitionCenter = await TuitionCenter.findByIdAndDelete(id);
    if (!tuitionCenter) {
      return res.status(404).send({success:false, message: 'Tuition center not found' });
    }
    res.status(200).send({success:true, message: 'Tuition center profile deleted successfully' });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error deleting tuition center profile',
      error,
    });
  }
};

export const getLatestTuitionCenters = async (req, res, next) => {
  try {
    const latesttuitionCenters = await TuitionCenter.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({success:true,latesttuitionCenters});
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching latest tuition centers',
      error,
    });
  }
};

export const getAllTuitionCenters = async (req, res, next) => {
  try {
    const tuitionCenters = await TuitionCenter.find();
    res.status(200).json(tuitionCenters);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching all tuition centers',
      error,
    });
  }
};

export const searchTuitionCenters = async (req, res) => {
  try {
    const query = req.query.name || '';
    console.log("tuitioncenter", query);
    const tuitionCenters = await TuitionCenter.find({ name: new RegExp(query, 'i') });
    res.status(200).json(tuitionCenters);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error searching for tuition centers',
      error,
    });
  }
};
