const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const { sendVerificationEmail } = require('../services/emailService');


const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      apiKey: crypto.randomBytes(32).toString('hex'), // Generate API key
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'Check your email to verify your account.' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};


const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed.', error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = req.user; // Retrieved from middleware

    res.status(200).json({
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      apiKey: user.apiKey, // Exposing API key to the user
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user details', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate session ID
    const sessionId = crypto.randomBytes(32).toString('hex');

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id, sessionId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id, sessionId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Save session to user model (invalidate old sessions)
    user.sessionId = sessionId;
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no refresh token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token || user.sessionId !== decoded.sessionId) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ id: user._id, sessionId: user.sessionId }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, invalid refresh token' });
  }
};

const logoutUser = async (req, res) => {
  const user = await User.findOne({ refreshToken: req.cookies.refreshToken });

  if (user) {
    user.sessionId = null;
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  refreshToken,
  logoutUser,
  getUserDetails
};
