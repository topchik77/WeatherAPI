const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    atmosphericPressure: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Forecast', forecastSchema);
