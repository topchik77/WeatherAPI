const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const weatherRoutes = require('./routes/weatherRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const infoRoutes = require('./routes/infoRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/weather', weatherRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/iss', issRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Middleware error');
});

module.exports = app;
