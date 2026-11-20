const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const applyForJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    appliedViaPortal = 'Direct Company',
    applyType = 'DIRECT',
    coverNote = '',
    resumeUrl = '',
    candidateName,
    candidatePhone,
    candidateQualification
  } = req.body;

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(404, 'Job opening not found');
  }

  const candidateId = req.user._id;

  // Application submission should only be recorded with status 'APPLIED' when user submits
  const initialStatus = req.body.status || 'APPLIED';

  // Check for existing application/visit record for this job
  const existing = await Application.findOne({
    jobId: job._id,
    candidateId
  });

  if (existing) {
    // If existing record was a visit and user is now explicitly submitting direct or confirming application
    if (applyType === 'DIRECT' || req.body.status === 'APPLIED') {
      existing.applyType = applyType;
      existing.appliedViaPortal = appliedViaPortal;
      existing.status = 'APPLIED';
      existing.coverNote = coverNote || existing.coverNote;
      existing.resumeUrl = resumeUrl || existing.resumeUrl || req.user.resumeUrl;
      existing.appliedAt = new Date();
      await existing.save();

      return res.status(200).json(
        new ApiResponse(200, existing, 'Application confirmed and recorded successfully')
      );
    }

    if (existing.applyType === 'DIRECT' && applyType === 'DIRECT') {
      throw new ApiError(400, 'You have already submitted a direct application for this position.');
    }

    // Existing visit record re-opened
    return res.status(200).json(
      new ApiResponse(200, existing, 'Job portal visit recorded')
    );
  }

  const application = await Application.create({
    jobId: job._id,
    candidateId,
    appliedViaPortal,
    applyType,
    coverNote,
    resumeUrl: resumeUrl || req.user.resumeUrl || '',
    candidateName: candidateName || req.user.name,
    candidateEmail: req.user.email,
    candidatePhone: candidatePhone || req.user.phone || '',
    candidateQualification: candidateQualification || req.user.qualification || 'Any Graduate',
    status: initialStatus,
    appliedAt: new Date()
  });

  res.status(201).json(
    new ApiResponse(
      201,
      application,
      initialStatus === 'APPLIED'
        ? 'Application submitted successfully to employer'
        : `Visited opening on ${appliedViaPortal}`
    )
  );
});

const candidateUpdateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['VISITED', 'APPLIED', 'IN_PROGRESS', 'SHORTLISTED', 'SELECTED', 'REJECTED'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const application = await Application.findById(id);
  if (!application) {
    throw new ApiError(404, 'Application record not found');
  }

  if (application.candidateId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Unauthorized to update this application');
  }

  application.status = status;
  if (status === 'APPLIED') {
    application.appliedAt = new Date();
  }
  await application.save();

  res.status(200).json(
    new ApiResponse(200, application, `Application status updated to ${status}`)
  );
});

const candidateDeleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await Application.findById(id);
  if (!application) {
    throw new ApiError(404, 'Application record not found');
  }

  if (application.candidateId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Unauthorized to remove this application');
  }

  await Application.findByIdAndDelete(id);

  res.status(200).json(
    new ApiResponse(200, null, 'Application record removed from dashboard')
  );
});

const getCandidateApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    candidateId: req.user._id,
    status: { $ne: 'VISITED' }
  })
    .populate({
      path: 'jobId',
      select: 'title companyName location salaryDisplay qualification jobType sources status'
    })
    .sort({ appliedAt: -1 });

  res.status(200).json(
    new ApiResponse(200, applications, 'Candidate application history retrieved')
  );
});

const getCandidateSavedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedJobs',
    match: { status: 'ACTIVE' },
    select: 'title companyName location salaryDisplay qualification jobType sources openingsCount postedAt'
  });

  res.status(200).json(
    new ApiResponse(200, user.savedJobs || [], 'Candidate saved jobs retrieved')
  );
});

const getEmployerJobs = asyncHandler(async (req, res) => {
  const employerName = req.user.name;

  // Find jobs posted by this employer or associated with their company
  const jobs = await Job.find({
    $or: [
      { companyName: new RegExp(employerName, 'i') },
      { 'sources.isDirect': true }
    ]
  }).sort({ postedAt: -1 }).lean();

  // Get application counts per job
  const jobIds = jobs.map((j) => j._id);
  const applicationCounts = await Application.aggregate([
    { $match: { jobId: { $in: jobIds } } },
    { $group: { _id: '$jobId', count: { $sum: 1 } } }
  ]);

  const countMap = {};
  applicationCounts.forEach((c) => {
    countMap[c._id.toString()] = c.count;
  });

  const enrichedJobs = jobs.map((j) => ({
    ...j,
    applicantCount: countMap[j._id.toString()] || 0
  }));

  res.status(200).json(
    new ApiResponse(200, enrichedJobs, 'Employer jobs retrieved successfully')
  );
});

const getJobApplicants = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  const applications = await Application.find({ jobId: id })
    .populate('candidateId', 'name email phone qualification city skills resumeUrl')
    .sort({ appliedAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      { job, applicants: applications },
      'Applicants retrieved successfully'
    )
  );
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['APPLIED', 'IN_PROGRESS', 'SHORTLISTED', 'SELECTED', 'REJECTED'].includes(status)) {
    throw new ApiError(400, 'Invalid status update value');
  }

  const application = await Application.findById(id);
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  application.status = status;
  await application.save();

  res.status(200).json(
    new ApiResponse(200, application, `Application status updated to ${status}`)
  );
});

module.exports = {
  applyForJob,
  candidateUpdateStatus,
  candidateDeleteApplication,
  getCandidateApplications,
  getCandidateSavedJobs,
  getEmployerJobs,
  getJobApplicants,
  updateApplicationStatus
};
