const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator');

/**
 * @route POST /api/auth/register
 * @description Регистрация нового пользователя
 * @access Public
 */
router.post('/register', validator.validateUser, (req, res) => {
    const { username, email } = req.body;
    res.json({ message: 'User registered successfully', username, email });
});

/**
 * @route POST /api/auth/login
 * @description Вход в систему
 * @access Public
 */
router.post('/login', validator.validateUser, (req, res) => {
    const { username } = req.body;
    const token = 'fake-jwt-token'; // Example token
    res.json({ message: 'Login successful', username, token });
});

module.exports = router;
