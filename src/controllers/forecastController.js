const Forecast = require('../models/forecastModel');

// Function to calculate rainfall prediction (same as before)
const calculateRainfallPrediction = (temperature, humidity, windSpeed) => {
  const baseRainfall = (humidity / 100) * 50;
  const temperatureFactor = temperature < 0 ? 10 : 20;
  const windFactor = windSpeed > 15 ? 10 : 5;

  return baseRainfall + temperatureFactor + windFactor;
};

// Function to categorize rainfall prediction (same as before)
const categorizeRainfall = (rainfall) => {
  if (rainfall > 50) {
    return "Heavy rainfall and thunderstorms";
  } else if (rainfall > 40) {
    return "Chance of rainfall";
  } else {
    return "Very low chance of rainfall or no chance of thunderstorms";
  }
};

// Get a forecast entry based on city
const getForecastByCity = async (req, res) => {
  const { city } = req.params;  // Get the city from the route parameter

  try {
    const forecast = await Forecast.findOne({ city });
    if (!forecast) {
      return res.status(404).json({ message: `No forecast data found for city: ${city}` });
    }

    const rainfall = calculateRainfallPrediction(
      forecast.temperature,
      forecast.humidity,
      forecast.windSpeed
    );

    const rainfallCategory = categorizeRainfall(rainfall);

    const prediction = {
      _id: forecast._id,
      city: forecast.city,
      temperature: forecast.temperature,
      humidity: forecast.humidity,
      windSpeed: forecast.windSpeed,
      description: forecast.description,
      date: forecast.date,
      atmosphericPressure: forecast.atmosphericPressure,
      predictedRainfall: rainfall,
      rainfallCategory: rainfallCategory,
    };

    res.status(200).json(prediction);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving forecast data', error: error.message });
  }
};

module.exports = { getForecastByCity };
