const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator');

/**
 * @route GET /api/weather/:city
 * @description Получить текущую погоду для указанного города
 */
router.get('/:city', validator.validateCity, (req, res) => {
    const city = req.params.city;
    res.send(`Current weather data for ${city}`);
});

/**
 * @route GET /api/weather/forecast/:city
 * @description Получить прогноз погоды на несколько дней
 */
router.get('/forecast/:city', validator.validateCity, (req, res) => {
    const city = req.params.city;
    res.send(`Weather forecast for ${city}`);
});

module.exports = router;
