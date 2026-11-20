const universalAggregator = require('../services/aggregator');
const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');
const Application = require('../models/Application');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const triggerAggregation = asyncHandler(async (req, res) => {
  const stats = await universalAggregator.runSyncCycle();

  res.status(200).json(
    new ApiResponse(
      200,
      stats,
      `Sync successfully processed: ${stats.total} total items, ${stats.created} created, ${stats.merged} duplicates merged`
    )
  );
});

const getSystemStats = asyncHandler(async (req, res) => {
  const [totalJobs, totalCompanies, totalCandidates, totalEmployers, totalApplications, duplicateMerged] = await Promise.all([
    Job.countDocuments({ status: 'ACTIVE' }),
    Company.countDocuments(),
    User.countDocuments({ role: 'CANDIDATE' }),
    User.countDocuments({ role: 'EMPLOYER' }),
    Application.countDocuments(),
    Job.countDocuments({ 'sources.1': { $exists: true } }) // Jobs with 2+ merged sources
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalJobs,
        totalCompanies,
        totalCandidates,
        totalEmployers,
        totalApplications,
        duplicateMergedCount: duplicateMerged
      },
      'Platform statistics retrieved'
    )
  );
});

module.exports = {
  triggerAggregation,
  getSystemStats
};
