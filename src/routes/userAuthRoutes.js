const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { validateRegisterData, validateLoginData } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegisterData, registerUser);
router.post('/login', validateLoginData, loginUser);

module.exports = router;
