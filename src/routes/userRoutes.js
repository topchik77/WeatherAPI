const express = require('express');
const { registerUser, loginUser, logoutUser, getUserDetails, protect } = require('../controllers/userController');
const { validateRegisterData, validateLoginData } = require('../middleware/validationMiddleware');

const router = express.Router();

// API routes
router.post('/register', validateRegisterData, registerUser); // Register user
router.post('/login', validateLoginData, loginUser); // Login user
router.get('/details', protect, getUserDetails); // Access user info
router.get('/logout', logoutUser); // Logout user

module.exports = router;

