const router = require('express').Router();
const controller = require('../controllers/courseController');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/requireAuth');
router.get('/', requireAuth, asyncHandler(controller.list));
// Course creation is not public: this version only exposes student accounts.
module.exports = router;
