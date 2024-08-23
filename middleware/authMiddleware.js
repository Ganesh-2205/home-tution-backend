import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const secret = process.env.JWT_SECRET;
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Extract the token from the "Bearer " prefix
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  try {
    
    const verified = JWT.verify(token, "NSGAAAP638");
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};
