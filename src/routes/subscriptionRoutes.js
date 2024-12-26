const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

/**
 * @route POST /api/subscriptions
 * @description Подписаться на рассылку прогноза погоды
 */
router.post('/', validator.validateEmail, subscriptionController.subscribe);

/**
 * @route DELETE /api/subscriptions
 * @description Отписаться от рассылки
 * @access Private
 */
router.delete('/', auth, subscriptionController.unsubscribe);

module.exports = router;