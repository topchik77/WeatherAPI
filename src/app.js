const express = require('express');
const path = require('path');
const connectDB = require('@config/db');

const axios = require('axios');
const app = express();
const PORT = 3000;

const routes = require('@routes/routes');
const userAuthRoutes = require('@routes/userAuthRoutes');
const userCrudRoutes = require('@routes/userCrudRoutes');


connectDB();

const API_KEY = '735c38398d81f931cdf9800b3ee7ff18';


app.use(express.json());


app.get('/weather', async (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: location,
                appid: API_KEY,
                units: 'metric',
            },
        });

        const weatherData = {
            location: response.data.name,
            temperature: response.data.main.temp,
            weather: response.data.weather[0].description,
            date: new Date().toISOString(),
        };

        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/weather/sync', async (req, res) => {
    const { location } = req.body;

    try {
        // Логика синхронизации с OpenWeather API
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: location,
                appid: API_KEY,
                units: 'metric',
            },
        });

        res.json({ message: 'Weather data synchronized', data: response.data });
    } catch (error) {
        res.status(500).json({ error: 'Sync failed', details: error.message });
    }
});




app.use(express.static(path.resolve(__dirname, 'frontend')));
app.use('/', routes);
app.use('/api/auth', userAuthRoutes);
app.use('/api/users', userCrudRoutes);

module.exports = app;




