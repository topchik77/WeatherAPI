const Joi = require('joi');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validateRegisterData = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: JSON.stringify(error.details) });
  }
  next();

};

const validateLoginData = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    
    console.log('=== Auth Middleware ===');
    console.log('All cookies:', req.cookies);
    console.log('Access token:', token);

    if (!token) {
      console.log('Token is missing in request');
      return res.status(401).json({ 
        message: 'Unauthorized, no token provided',
        cookies: req.cookies,
        headers: req.headers
      });
    }
    console.log('Extracted token:', token);


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id);
    console.log('Found user:', user ? 'exists' : 'not found');

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    if (user.sessionId !== decoded.sessionId) {
      console.log('SessionId mismatch');
      console.log('User sessionId:', user.sessionId);
      console.log('Token sessionId:', decoded.sessionId);
      return res.status(401).json({ message: 'Unauthorized, session expired' });
    }

    req.user = user;
    console.log('Authentication successful for user:', user.email);
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      message: 'Unauthorized, token is invalid or expired',
      error: error.message 
    });
  }
};

const protectAPI = async (req, res, next) => {
  const apiKey = req.query.apiKey; // Get API key from query params

  if (!apiKey) {
    return res.status(401).json({ message: 'API key is required' });
  }

  try {
    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(403).json({ message: 'Invalid API key' });
    }

    req.user = user; // Attach user info to request
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
};

const checkApiKey = async (req, res, next) => {
  const apiKey = req.query.apiKey;
  console.log('Received API key:', apiKey);

  if (!apiKey) {
    console.log('API key is missing');
    return res.status(401).json({ message: 'API key is missing' });
  }

  const user = await User.findOne({ apiKeys: apiKey });
  if (!user) {
    console.log('Invalid API key');
    return res.status(401).json({ message: 'Invalid API key' });
  }

  console.log('API key is valid for user:', user.email);
  req.user = user;
  next();
};

module.exports = { validateRegisterData, validateLoginData, protect, protectAPI, checkApiKey };
