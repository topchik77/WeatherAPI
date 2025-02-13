const Forecast = require('../models/forecastModel');
const User = require('../models/userModel'); // Import User model to check API keys

const checkApiKey = async (req, res, next) => {
  const apiKey = req.query.apiKey; // API key from query parameters

  if (!apiKey) {
    return res.status(401).json({ message: 'API key is required' });
  }

  try {
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(403).json({ message: 'Invalid API key' });
    }

    req.user = user; // Store user info for further use
    next(); // Proceed to the actual request handler
  } catch (error) {
    res.status(500).json({ message: 'API key validation failed', error: error.message });
  }
};

const calculateRainfallPrediction = (temperature, humidity, windSpeed) => {
  const baseRainfall = (humidity / 100) * 50;
  const temperatureFactor = temperature < 0 ? 10 : 20;
  const windFactor = windSpeed > 15 ? 10 : 5;

  return baseRainfall + temperatureFactor + windFactor;
};

const categorizeRainfall = (rainfall) => {
  if (rainfall > 50) {
    return "Heavy rainfall and thunderstorms";
  } else if (rainfall > 40) {
    return "Chance of rainfall";
  } else {
    return "Very low chance of rainfall or no chance of thunderstorms";
  }
};

const getForecastByCity = async (req, res) => {
  const { city } = req.params;

  try {
    const forecast = await Forecast.findOne({ city });
    if (!forecast) {
      return res.status(404).json({ message: `No forecast data found for city: ${city}` });
    }

    const predictedRainfall = calculateRainfallPrediction(
      forecast.temperature,
      forecast.humidity,
      forecast.windSpeed
    );

    const rainfallCategory = categorizeRainfall(predictedRainfall);

    res.status(200).json({
      city: forecast.city,
      temperature: forecast.temperature,
      humidity: forecast.humidity,
      windSpeed: forecast.windSpeed,
      description: forecast.description,
      date: forecast.date,
      atmosphericPressure: forecast.atmosphericPressure,
      predictedRainfall: predictedRainfall.toFixed(2),
      rainfallCategory: rainfallCategory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving forecast data', error: error.message });
  }
};

module.exports = { getForecastByCity, checkApiKey };
