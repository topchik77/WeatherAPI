const express = require('express');
const path = require('path');

// Import the app.js file where routes are defined (from the 'src' folder)
const app = require('./src/app');

// Serve static files (like HTML, CSS, JS) from the 'src/frontend' folder
app.use(express.static(path.join(__dirname, 'src', 'frontend')));

// 404 Error handling for unknown routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src', 'frontend', '404.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
