import User from "../models/userModel.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Admins only' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
