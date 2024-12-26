const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validator = require('../middleware/validator');

/**
 * @route POST /api/auth/register
 * @description Регистрация нового пользователя
 * @access Public
 */
router.post('/register', validator.validateUser, authController.register);

/**
 * @route POST /api/auth/login
 * @description Вход в систему
 * @access Public
 */
router.post('/login', validator.validateUser, authController.login);

module.exports = router;