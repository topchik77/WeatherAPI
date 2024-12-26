const express = require('express');
const router = express.Router();

/**
 * @route GET /api/iss/location
 * @description Получить текущее местоположение МКС
 * @access Public
 */
router.get('/location', (req, res) => {
    const location = { latitude: 51.6, longitude: -0.1 }; // Example data
    res.json({ message: 'Current ISS location', location });
});

/**
 * @route GET /api/iss/info
 * @description Получить информацию о МКС
 * @access Public
 */
router.get('/info', (req, res) => {
    const info = { name: 'International Space Station', launchDate: '1998-11-20' }; // Example data
    res.json({ message: 'ISS information', info });
});

module.exports = router;
