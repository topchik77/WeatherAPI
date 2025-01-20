const express = require('express');
const router = express.Router();
const validator = require('./middleware/validator');
const auth = require('./middleware/auth');

/**
 * @route POST /api/subscriptions
 * @description Подписаться на рассылку прогноза погоды
 */
router.post('/', validator.validateEmail, (req, res) => {
    const { email } = req.body;
    res.send(`Subscribed to weather updates with email: ${email}`);
});

/**
 * @route DELETE /api/subscriptions
 * @description Отписаться от рассылки
 * @access Private
 */
router.delete('/', auth, (req, res) => {
    const { email } = req.user; // Assuming `auth` middleware adds the user object
    res.send(`Unsubscribed weather updates for email: ${email}`);
});

module.exports = router;
