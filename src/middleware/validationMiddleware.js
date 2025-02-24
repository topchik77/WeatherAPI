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
    console.log('Все куки:', req.cookies);
    console.log('Токен доступа:', token);

    if (!token) {
      console.log('Токен отсутствует в запросе');
      return res.status(401).json({ 
        message: 'Unauthorized, no token provided',
        cookies: req.cookies,
        headers: req.headers
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Декодированный токен:', decoded);

    const user = await User.findById(decoded.id);
    console.log('Найденный пользователь:', user ? 'существует' : 'не найден');

    if (!user) {
      console.log('Пользователь не найден в базе данных');
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    if (user.sessionId !== decoded.sessionId) {
      console.log('Несоответствие sessionId');
      console.log('User sessionId:', user.sessionId);
      console.log('Token sessionId:', decoded.sessionId);
      return res.status(401).json({ message: 'Unauthorized, session expired' });
    }

    req.user = user;
    console.log('Аутентификация успешна для пользователя:', user.email);
    next();
  } catch (error) {
    console.error('Ошибка проверки токена:', error);
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
  console.log('Полученный API ключ:', apiKey);

  if (!apiKey) {
    console.log('API ключ отсутствует');
    return res.status(401).json({ message: 'API key is missing' });
  }

  const user = await User.findOne({ apiKeys: apiKey });
  if (!user) {
    console.log('Неверный API ключ');
    return res.status(401).json({ message: 'Invalid API key' });
  }

  console.log('API ключ действителен для пользователя:', user.email);
  req.user = user;
  next();
};

module.exports = { validateRegisterData, validateLoginData, protect, protectAPI, checkApiKey };
