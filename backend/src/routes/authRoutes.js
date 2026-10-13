const router = require('express').Router();
const controller = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/requireAuth');
const { rateLimit } = require('express-rate-limit');

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Demasiados intentos. Espere unos minutos y vuelva a intentarlo.' } });
router.post('/register', authLimiter, asyncHandler(controller.register));
router.post('/login', authLimiter, asyncHandler(controller.login));
router.get('/me', requireAuth, asyncHandler(controller.me));
router.post('/logout', controller.logout);
module.exports = router;
