const express = require('express');
const { getForecastByCity, checkApiKey } = require('../controllers/forecastController'); // Импорт контроллера
const { protect, protectAPI } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/:city', protect, protectAPI, checkApiKey, getForecastByCity);

module.exports = router;
