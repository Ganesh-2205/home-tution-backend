import dotenv from 'dotenv';
dotenv.config();
import Payment from '../models/paymentModel.js';
import User from '../models/userModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createPayment = async (req, res) => {
  
  try {
    const {id}=req.params;
    const { amount } = req.body;
    if ( !amount) return res.status(400).send({
      success: false,
      message: 'All the filds are required',
    });
    const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
    });
    const payment =await new Payment({
      name:user.name,
      amount,
      paymentIntentId: paymentIntent.id,
    }).save();
    res.status(201).send({
      success:true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: 'Error creating payment', details: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const { paymentIntentId, status } = req.body;
  try {
    // Validate status
    const validStatuses = ['paid', 'pending', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const payment = await Payment.findOne({ paymentIntentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    payment.status = status;
    await payment.save();
    res.json({ message: 'Payment status updated successfully',payment });
  } catch (error) {
    res.status(500).json({ error: 'Error updating payment status' });
  }
};
