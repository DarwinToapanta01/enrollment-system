const router = require('express').Router();
const controller = require('../controllers/courseController');
const asyncHandler = require('../utils/asyncHandler');
router.get('/', asyncHandler(controller.list));
// Course creation is not public: this version only exposes student accounts.
module.exports = router;
