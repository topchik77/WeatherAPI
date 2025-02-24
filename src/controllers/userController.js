const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const { sendVerificationEmail } = require('../services/emailService');

function generateRandomApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      username,
      email,
      password: password,
      verificationToken,
      apiKey: crypto.randomBytes(32).toString('hex'), // Generate API key
    });

    await newUser.save();
    await sendVerificationEmail(email, newUser.verificationToken);

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
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Пользователь не найден:', email);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Неверный пароль для пользователя:', email);
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    if (!user.isVerified) {
      console.log('Неверифицированный пользователь:', email);
      return res.status(401).json({ message: 'Пожалуйста, подтвердите email перед входом.' });
    }

    // Создаем токен с дополнительными данными
    const token = jwt.sign(
      { 
        id: user._id, 
        sessionId: user.sessionId,
        email: user.email,
        isVerified: user.isVerified 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Токен создан для пользователя:', email);

    // Устанавливаем токен в куки с расширенными опциями
    res.cookie('accessToken', token, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'Lax',
      // maxAge: 3600000, // 1 час
      // path: '/'
    });

    console.log('Кука установлена для пользователя:', email);

    res.status(200).json({
      message: 'Вход выполнен успешно',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ message: error.message });
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
  try {
    const user = req.user;
    user.refreshToken = null; 
    await user.save();

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to logout', error: error.message });
  }
};


const generateUserApiKey = async (req, res) => {
  try {
    const user = req.user;
    if (user.apiKeys.length >= 2) {
      return res.status(403).json({ message: 'To create more than two API keys, please purchase a subscription.' });
    }

    const newApiKey = generateRandomApiKey(); // Функция для генерации случайного API ключа
    user.apiKeys.push(newApiKey);
    await user.save();

    res.status(201).json({ message: 'New API key generated', apiKey: newApiKey });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate API key', error: error.message });
  }
};

const getUserApiKeys = async (req, res) => {
  try {
    const user = req.user; // Получаем пользователя из middleware
    res.status(200).json({ apiKeys: user.apiKeys }); // Возвращаем массив API ключей
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve API keys', error: error.message });
  }
};

const deleteUserApiKey = async (req, res) => {
  try {
    const user = req.user;
    const apiKeyToDelete = req.params.apiKey;

    const updatedApiKeys = user.apiKeys.filter(key => key !== apiKeyToDelete);
    if (updatedApiKeys.length === user.apiKeys.length) {
      return res.status(404).json({ message: 'API key not found' });
    }

    user.apiKeys = updatedApiKeys;
    await user.save();

    res.status(200).json({ message: 'API key successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete API key', error: error.message });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  refreshToken,
  logoutUser,
  getUserDetails,
  generateUserApiKey,
  getUserApiKeys,
  deleteUserApiKey
};
