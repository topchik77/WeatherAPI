const express = require('express');
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserDetails, 
  protect, 
  verifyEmail
} = require('../controllers/userController');
const { validateRegisterData, validateLoginData } = require('../middleware/validationMiddleware');

const router = express.Router();

// Роуты
router.post('/register', validateRegisterData, registerUser);
router.get('/verify/:token', verifyEmail); // Подтверждение email
router.post('/login', validateLoginData, loginUser);
router.get('/details', protect, getUserDetails);
router.get('/logout', logoutUser);

module.exports = router;
