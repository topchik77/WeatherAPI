const express = require('express');
const { 
  registerUser, 
  loginUser, 
  logoutUser,
  verifyEmail,
  getUserDetails,
  generateUserApiKey,
  getUserApiKeys,
  deleteUserApiKey,
} = require('../controllers/userController');

const { validateRegisterData, validateLoginData, protect } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/signup', validateRegisterData, registerUser);
router.get('/verify/:token', verifyEmail);
router.post('/login', validateLoginData, loginUser);
router.get('/logout', protect, logoutUser);
router.get('/getUserDetails', protect, getUserDetails);
router.post('/generate-api-key', protect, generateUserApiKey);
router.get('/api-keys', protect, getUserApiKeys);
router.delete('/api-keys/:apiKey', protect, deleteUserApiKey);

module.exports = router;
