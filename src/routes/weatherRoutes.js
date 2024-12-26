const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const validator = require('../middleware/validator');

/**
 * @route GET /api/weather/:city
 * @description Получить текущую погоду для указанного города
 */
router.get('/:city', validator.validateCity, weatherController.getCurrentWeather);

/**
 * @route GET /api/weather/forecast/:city
 * @description Получить прогноз погоды на несколько дней
 */
router.get('/forecast/:city', validator.validateCity, weatherController.getForecast);

module.exports = router;