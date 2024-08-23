import express from "express"
import dotenv from  "dotenv"
import cors from "cors"
import Stripe from "stripe";
import connectDB from "./config/db.js"
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import tuitionCenterRoutes from './routes/tuitioncenterRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();
connectDB();

const stripeKey = process.env.STRIPE_KEY || "";

export const stripe = new Stripe(stripeKey);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/tuition-centers', tuitionCenterRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
