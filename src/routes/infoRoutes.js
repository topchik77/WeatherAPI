const express = require('express');
const router = express.Router();

/**
 * @route GET /api/info/weather-facts
 * @description Получить интересные факты о погоде
 * @access Public
 */
router.get('/weather-facts', (req, res) => {
    const facts = [
        'The highest temperature ever recorded on Earth was 56.7°C.',
        'Snow can sometimes appear pink due to algae.'
    ];
    res.json({ message: 'Weather facts', facts });
});

/**
 * @route GET /api/info/weather-tips
 * @description Получить советы по определению погоды
 * @access Public
 */
router.get('/weather-tips', (req, res) => {
    const tips = [
        'Red sky at night, sailor’s delight; red sky in morning, sailor’s warning.',
        'Check for ring around the moon; it often predicts rain.'
    ];
    res.json({ message: 'Weather tips', tips });
});

module.exports = router;
