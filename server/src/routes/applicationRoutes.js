const express = require('express');
const router = express.Router();
const {
  getCandidateApplications,
  getCandidateSavedJobs,
  candidateUpdateStatus,
  candidateDeleteApplication,
  getEmployerJobs,
  getJobApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middlewares/auth');

// Candidate routes
router.get('/candidate/applications', authenticate, authorize('CANDIDATE', 'ADMIN'), getCandidateApplications);
router.get('/candidate/saved-jobs', authenticate, authorize('CANDIDATE', 'ADMIN'), getCandidateSavedJobs);
router.patch('/candidate/applications/:id/status', authenticate, authorize('CANDIDATE', 'ADMIN'), candidateUpdateStatus);
router.delete('/candidate/applications/:id', authenticate, authorize('CANDIDATE', 'ADMIN'), candidateDeleteApplication);

// Employer routes
router.get('/employer/jobs', authenticate, authorize('EMPLOYER', 'ADMIN'), getEmployerJobs);
router.get('/employer/jobs/:id/applicants', authenticate, authorize('EMPLOYER', 'ADMIN'), getJobApplicants);
router.patch('/employer/applications/:id/status', authenticate, authorize('EMPLOYER', 'ADMIN'), updateApplicationStatus);

module.exports = router;
