const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const companyRoutes = require('./companyRoutes');
const applicationRoutes = require('./applicationRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/companies', companyRoutes);
router.use('/', applicationRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'JobYatra Universal Aggregator Engine v1.0'
  });
});

module.exports = router;
