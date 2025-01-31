const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Forecast = require('../models/forecastModel'); // Импорт модели
const connectDB = require('../config/db'); // Импорт подключения к БД

dotenv.config(); // Загружаем переменные окружения
connectDB(); // Подключаемся к базе

const fixPressureData = async () => {
  try {
    // Обновляем все строки с атмосферным давлением в тип float (double)
    const result = await Forecast.updateMany(
      { atmosphericPressure: { $type: "string" } }, 
      [{ $set: { atmosphericPressure: { $toDouble: "$atmosphericPressure" } } }]
    );

    console.log(`Обновлено документов: ${result.modifiedCount}`);
    process.exit(); // Завершаем скрипт
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
    process.exit(1);
  }
};

// Запускаем функцию
fixPressureData();
