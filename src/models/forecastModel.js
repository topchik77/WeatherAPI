const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    atmosphericPressure: { type: Number, required: true },
  },
  { timestamps: true }
);


forecastSchema.methods.calculateTemperature = function () {
  return (this.temperature * 5 - this.atmosphericPressure / 100) * this.humidity;
};

module.exports = mongoose.model('Forecast', forecastSchema);
