const express = require('express');
const morgan = require('morgan');
const weatherRoutes = require('./routes/weatherRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const issRoutes = require('./routes/issRoutes');
const infoRoutes = require('./routes/infoRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/iss', issRoutes);
app.use('/api/info', infoRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;