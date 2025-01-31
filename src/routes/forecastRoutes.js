const express = require('express');
const Forecast = require('../models/forecastModel');

const router = express.Router();


router.get('/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const forecast = await Forecast.findOne({ city });

    if (!forecast) {
      return res.status(404).json({ error: 'City could not find' });
    }

    const calculatedTemperature = forecast.calculateTemperature();

    res.json({
      city: forecast.city,
      temperature: forecast.temperature,
      calculatedTemperature: calculatedTemperature.toFixed(2),
      humidity: forecast.humidity,
      windSpeed: forecast.windSpeed,
      description: forecast.description,
      date: forecast.date,
      atmosphericPressure: forecast.atmosphericPressure,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
