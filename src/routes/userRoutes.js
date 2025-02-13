const express = require('express');
const { 
  registerUser, 
  loginUser, 
  logoutUser,
  verifyEmail,
  getUserDetails
} = require('../controllers/userController');


const { validateRegisterData, validateLoginData, protect } = require('../middleware/validationMiddleware');

const router = express.Router();


router.post('/signup', validateRegisterData, registerUser);
router.get('/verify/:token', verifyEmail);
router.post('/login', validateLoginData, loginUser);
router.get('/logout', protect, logoutUser);
router.get('/getUserDetails', protect, getUserDetails);
module.exports = router;
