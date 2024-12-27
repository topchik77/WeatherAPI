const express = require('express');
const router = express.Router();

// Page routes
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'src/frontend' });
});

router.get('/about', (req, res) => {
    res.sendFile('about.html', { root: 'src/frontend' });
});

router.get('/contact', (req, res) => {
    res.sendFile('contact.html', { root: 'src/frontend' });
});

module.exports = router;
