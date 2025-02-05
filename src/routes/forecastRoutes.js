const express = require('express');
const { getForecastByCity } = require('../controllers/forecastController'); // Импорт контроллера

const router = express.Router();

router.get('/:city', getForecastByCity); // Используем контроллер

module.exports = router;
