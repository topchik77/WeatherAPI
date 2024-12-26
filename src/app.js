const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import route files
const weatherRoutes = require('./routes/weatherRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const issRoutes = require('./routes/issRoutes');
const infoRoutes = require('./routes/infoRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/weather', weatherRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/iss', issRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
