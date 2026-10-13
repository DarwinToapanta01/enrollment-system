const router = require('express').Router();
const controller = require('../controllers/enrollmentController');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/requireAuth');

router.get('/mis-matriculas', requireAuth, asyncHandler(controller.listMine));
router.post('/', requireAuth, asyncHandler(controller.createMine));
// The all-students list and global report are intentionally not exposed to student accounts.
module.exports = router;
