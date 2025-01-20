const express = require('express');
const router = express.Router();
const { getForecastByCity } = require('../controllers/forecastController');

// Route to get forecast for a specific city
router.get('/:city', getForecastByCity);

module.exports = router;
