const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  toggleSaveJob
} = require('../controllers/jobController');
const { applyForJob } = require('../controllers/applicationController');
const { authenticate, authorize, optionalAuth } = require('../middlewares/auth');

// Public search & view
router.get('/', optionalAuth, getJobs);
router.get('/:id', optionalAuth, getJobById);

// Employer create job
router.post('/', authenticate, authorize('EMPLOYER', 'ADMIN'), createJob);

// Candidate apply & save
router.post('/:id/apply', authenticate, authorize('CANDIDATE', 'ADMIN'), applyForJob);
router.post('/:id/save', authenticate, authorize('CANDIDATE', 'ADMIN'), toggleSaveJob);

module.exports = router;
