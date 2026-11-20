const Company = require('../models/Company');
const Job = require('../models/Job');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getCompanies = asyncHandler(async (req, res) => {
  const { search, industry } = req.query;

  const query = {};
  if (search) {
    query.name = new RegExp(search, 'i');
  }
  if (industry && industry !== 'all') {
    query.industry = industry;
  }

  const companies = await Company.find(query).sort({ isVerified: -1, name: 1 }).lean();

  // Aggregate job counts per company
  const jobCounts = await Job.aggregate([
    { $match: { status: 'ACTIVE' } },
    { $group: { _id: '$companyName', totalJobs: { $sum: 1 }, totalOpenings: { $sum: '$openingsCount' } } }
  ]);

  const countMap = {};
  jobCounts.forEach((c) => {
    countMap[c._id.toLowerCase()] = {
      jobs: c.totalJobs,
      openings: c.totalOpenings
    };
  });

  const enrichedCompanies = companies.map((comp) => {
    const stats = countMap[comp.name.toLowerCase()] || { jobs: 0, openings: 0 };
    return {
      ...comp,
      activeJobsCount: stats.jobs,
      totalOpeningsCount: stats.openings
    };
  });

  res.status(200).json(
    new ApiResponse(200, enrichedCompanies, 'Companies retrieved successfully')
  );
});

const getCompanyBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const company = await Company.findOne({ slug });
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  // Get all active jobs for this company across all portals
  const jobs = await Job.find({
    status: 'ACTIVE',
    $or: [
      { companyId: company._id },
      { companyName: new RegExp(`^${company.name}$`, 'i') }
    ]
  }).sort({ postedAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        company,
        jobs,
        stats: {
          totalJobs: jobs.length,
          totalOpenings: jobs.reduce((acc, curr) => acc + (curr.openingsCount || 1), 0)
        }
      },
      'Company details and active openings retrieved successfully'
    )
  );
});

module.exports = {
  getCompanies,
  getCompanyBySlug
};
