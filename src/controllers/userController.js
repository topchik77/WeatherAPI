const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register a new user
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Encrypt password
    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // !
      maxAge: 3600000,
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout a user
const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get user details (Protected route)
const getUserDetails = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protect middleware to restrict access to authenticated users
const protect = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Check both cookies and headers

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user; // Attach user to the request object for further use
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, token is invalid or expired' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  protect,
};
