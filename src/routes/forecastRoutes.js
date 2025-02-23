const express = require('express');
const { getForecastByCity, checkApiKey, getForecastByCityHome } = require('../controllers/forecastController'); // Импорт контроллера
const { protect, protectAPI } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/:city', protect, protectAPI, checkApiKey, getForecastByCity);
router.get('/api/weather/:city', getForecastByCity);
router.get('/home/:city', getForecastByCityHome);

module.exports = router;
