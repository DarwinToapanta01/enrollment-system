const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
router.get('/me', requireAuth, asyncHandler(async (req, res) => res.json(await authService.getCurrentUser(req.auth.userId))));
module.exports = router;
