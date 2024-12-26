const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');

/**
 * @route GET /api/info/weather-facts
 * @description Получить интересные факты о погоде
 * @access Public
 */
router.get('/weather-facts', infoController.getWeatherFacts);

/**
 * @route GET /api/info/weather-tips
 * @description Получить советы по определению погоды
 * @access Public
 */
router.get('/weather-tips', infoController.getWeatherTips);

module.exports = router;