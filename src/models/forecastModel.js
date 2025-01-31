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
  const pressure = parseFloat(this.atmosphericPressure);
  if (isNaN(pressure)) {
    console.error(`Ошибка: atmosphericPressure (${this.atmosphericPressure}) не является числом`);
    return null;
  }
  return (this.temperature * 5 - pressure / 100) * this.humidity;
};



module.exports = mongoose.model('Forecast', forecastSchema);
