import express from 'express';
import { register, login, forgotPassword,updateUser } from '../controllers/userController.js';
import {singleUpload } from "../middleware/multer.js"

const router = express.Router();

// Auth routes
router.post('/register',singleUpload, register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/update/:userId', singleUpload, updateUser);

export default router;
