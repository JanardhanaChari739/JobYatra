const express = require('express');
const router = express.Router();
const { triggerAggregation, getSystemStats } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/aggregate/run', authenticate, authorize('ADMIN', 'EMPLOYER'), triggerAggregation);
router.get('/stats', getSystemStats);

module.exports = router;
