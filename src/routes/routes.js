const express = require('express');
const path = require('path');
const router = express.Router();
const frontendPath = path.resolve(__dirname, '@frontend')


// Page routes
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: frontendPath });
});

router.get('/about', (req, res) => {
    res.sendFile('about.html', { root: frontendPath });
});

router.get('/contact', (req, res) => {
    res.sendFile('contact.html', { root: frontendPath });
});

module.exports = router;
