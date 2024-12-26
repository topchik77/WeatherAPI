const express = require('express');
const router = express.Router();
const issController = require('../controllers/issController');

/**
 * @route GET /api/iss/location
 * @description Получить текущее местоположение МКС
 * @access Public
 */
router.get('/location', issController.getCurrentLocation);

/**
 * @route GET /api/iss/info
 * @description Получить информацию о МКС
 * @access Public
 */
router.get('/info', issController.getInfo);

module.exports = router;