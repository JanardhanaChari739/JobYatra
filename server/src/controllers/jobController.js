const { z } = require('zod');
const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateJobHash } = require('../utils/hasher');
const { normalizeQualifications, formatSalaryDisplay } = require('../services/normalizer');

const createJobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  qualification: z.array(z.string()).min(1, 'Select at least one qualification'),
  experienceMin: z.number().min(0).default(0),
  experienceMax: z.number().min(0).default(3),
  salaryMin: z.number().min(0).default(0),
  salaryMax: z.number().min(0).default(0),
  city: z.string().min(2, 'City is required'),
  state: z.string().default('India'),
  isRemote: z.boolean().default(false),
  jobType: z.enum(['Full-time', 'Part-time', 'Internship', 'Contract']).default('Full-time'),
  openingsCount: z.number().min(1).default(1),
  skills: z.array(z.string()).default([]),
  description: z.string().min(20, 'Job description must be at least 20 characters'),
  directApplyUrl: z.string().optional()
});

const getJobs = asyncHandler(async (req, res) => {
  const {
    q,
    qualification,
    city,
    portalSource,
    jobType,
    salaryMin,
    isRemote,
    sort = 'latest',
    page = 1,
    limit = 12
  } = req.query;

  const filter = { status: 'ACTIVE' };

  // Search keyword in title, companyName, description, skills
  if (q && q.trim()) {
    const searchRegex = new RegExp(q.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { companyName: searchRegex },
      { skills: { $in: [searchRegex] } },
      { description: searchRegex }
    ];
  }

  // Qualification filter
  if (qualification && qualification !== 'all' && qualification !== 'All') {
    filter.qualification = qualification;
  }

  // City filter
  if (city && city !== 'all' && city !== 'All') {
    filter['location.city'] = new RegExp(`^${city.trim()}$`, 'i');
  }

  // Portal Source filter
  if (portalSource && portalSource !== 'all' && portalSource !== 'All') {
    filter['sources.portal'] = portalSource;
  }

  // Job Type filter
  if (jobType && jobType !== 'all' && jobType !== 'All') {
    filter.jobType = jobType;
  }

  // Remote filter
  if (isRemote === 'true' || isRemote === true) {
    filter['location.isRemote'] = true;
  }

  // Salary Min filter (annual INR)
  if (salaryMin && !isNaN(Number(salaryMin))) {
    filter.salaryMax = { $gte: Number(salaryMin) };
  }

  // Sorting
  let sortOption = { postedAt: -1 };
  if (sort === 'salary_high') {
    sortOption = { salaryMax: -1, postedAt: -1 };
  } else if (sort === 'openings_high') {
    sortOption = { openingsCount: -1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 12);
  const skip = (pageNum - 1) * limitNum;

  const [jobs, totalCount, facetAggregations] = await Promise.all([
    Job.find(filter)
      .populate('companyId', 'name slug logo industry headquarters isVerified')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Job.countDocuments(filter),
    Job.aggregate([
      { $match: { status: 'ACTIVE' } },
      {
        $facet: {
          qualifications: [
            { $unwind: '$qualification' },
            { $group: { _id: '$qualification', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          portals: [
            { $unwind: '$sources' },
            { $group: { _id: '$sources.portal', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          cities: [
            { $group: { _id: '$location.city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          jobTypes: [
            { $group: { _id: '$jobType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ]
        }
      }
    ])
  ]);

  const facets = facetAggregations[0] || {
    qualifications: [],
    portals: [],
    cities: [],
    jobTypes: []
  };

  res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum) || 1,
          hasMore: pageNum * limitNum < totalCount
        },
        facets
      },
      'Jobs retrieved successfully'
    )
  );
});

const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let job;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    job = await Job.findById(id).populate('companyId');
  } else {
    job = await Job.findOne({ slug: id }).populate('companyId');
  }

  if (!job) {
    throw new ApiError(404, 'Job opportunity not found');
  }

  // Increment views count asynchronously
  job.viewsCount += 1;
  await job.save();

  // Find related jobs
  const relatedJobs = await Job.find({
    _id: { $ne: job._id },
    status: 'ACTIVE',
    $or: [
      { qualification: { $in: job.qualification } },
      { 'location.city': job.location.city },
      { companyName: job.companyName }
    ]
  })
    .limit(4)
    .lean();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        job,
        relatedJobs
      },
      'Job details retrieved successfully'
    )
  );
});

const createJob = asyncHandler(async (req, res) => {
  const validation = createJobSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, 'Validation failed', validation.error.issues.map((i) => i.message));
  }

  const data = validation.data;
  const dedupHash = generateJobHash(data.companyName, data.title, data.city);

  // Check if existing job
  const existingJob = await Job.findOne({ dedupHash });
  if (existingJob) {
    throw new ApiError(409, 'An active job opening for this role and company already exists in this city.');
  }

  // Find or create company
  const companySlug = data.companyName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  let company = await Company.findOne({ slug: companySlug });
  if (!company) {
    company = await Company.create({
      name: data.companyName,
      slug: companySlug,
      headquarters: data.city,
      isVerified: true,
      createdBy: req.user._id
    });
  }

  const slug = `${data.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${data.companyName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${data.city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;

  const normalizedQuals = normalizeQualifications(data.qualification);
  const salaryDisplay = formatSalaryDisplay(data.salaryMin, data.salaryMax);

  const job = await Job.create({
    title: data.title,
    slug,
    companyName: data.companyName,
    companyId: company._id,
    qualification: normalizedQuals,
    experienceMin: data.experienceMin,
    experienceMax: data.experienceMax,
    salaryMin: data.salaryMin,
    salaryMax: data.salaryMax,
    salaryDisplay,
    location: {
      city: data.city,
      state: data.state,
      isRemote: data.isRemote
    },
    jobType: data.jobType,
    openingsCount: data.openingsCount,
    skills: data.skills,
    description: data.description,
    sources: [
      {
        portal: 'Direct Company',
        url: data.directApplyUrl || `/jobs/${slug}`,
        isDirect: true,
        postedAt: new Date()
      }
    ],
    dedupHash,
    status: 'ACTIVE'
  });

  res.status(201).json(new ApiResponse(201, job, 'Job posted successfully'));
});

const toggleSaveJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  const index = user.savedJobs.indexOf(job._id);
  let isSaved = false;

  if (index > -1) {
    user.savedJobs.splice(index, 1);
    isSaved = false;
  } else {
    user.savedJobs.push(job._id);
    isSaved = true;
  }

  await user.save();

  res.status(200).json(
    new ApiResponse(
      200,
      { isSaved, savedJobsCount: user.savedJobs.length },
      isSaved ? 'Job saved to your bookmarks' : 'Job removed from bookmarks'
    )
  );
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  toggleSaveJob
};
