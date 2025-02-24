const express = require('express');
const { getForecastByCity, getForecastByCityHome } = require('../controllers/forecastController'); // Импорт контроллера
const { checkApiKey } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/:city', checkApiKey, getForecastByCity);
router.get('/api/weather/:city', getForecastByCity);
router.get('/home/:city', getForecastByCityHome);

module.exports = router;
