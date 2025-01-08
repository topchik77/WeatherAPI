const express = require('express');
const path = require('path');
const connectDB = require('@config/db');

const routes = require('@routes/routes');
const userAuthRoutes = require('@routes/userAuthRoutes');
const userCrudRoutes = require('@routes/userCrudRoutes');

const app = express();
connectDB();
// Middleware to parse JSON bodies in incoming requests
app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'frontend')));
app.use('/', routes);
app.use('/api/auth', userAuthRoutes);
app.use('/api/users', userCrudRoutes);

module.exports = app;
