import mockJobsData from './mockJobs.json';

const MOCK_JOBS = [...mockJobsData];

// Pre-seed unique companies from the 46 jobs
const uniqueCompanyNames = Array.from(new Set(MOCK_JOBS.map((j) => j.companyName)));
const MOCK_COMPANIES = uniqueCompanyNames.map((name, i) => {
  const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  let industry = 'Information Technology';
  const lower = name.toLowerCase();
  if (lower.includes('zomato') || lower.includes('swiggy') || lower.includes('blinkit') || lower.includes('meesho') || lower.includes('flipkart') || lower.includes('nykaa') || lower.includes('delhivery')) {
    industry = 'E-commerce & Logistics';
  } else if (lower.includes('razorpay') || lower.includes('zerodha') || lower.includes('phonepe') || lower.includes('cred') || lower.includes('hdfc') || lower.includes('icici') || lower.includes('paytm')) {
    industry = 'Fintech & Banking';
  } else if (lower.includes('tata') || lower.includes('larsen') || lower.includes('ecil') || lower.includes('bhel') || lower.includes('bel') || lower.includes('railway') || lower.includes('sail')) {
    industry = 'Manufacturing & Engineering';
  }

  return {
    _id: 'comp-' + (i + 1),
    name,
    slug,
    industry,
    headquarters: 'India',
    isVerified: true,
    website: `https://${name.toLowerCase().replace(/[^\w]/g, '')}.com`
  };
});

// Demo accounts
const CANDIDATE_USER = {
  _id: 'user-cand-1',
  name: 'Aarav Sharma',
  email: 'candidate@jobyatra.in',
  phone: '+91 98765 43210',
  role: 'CANDIDATE',
  qualification: 'B.Tech / B.E',
  city: 'Bengaluru',
  skills: ['React', 'Node.js', 'TypeScript', 'SQL', 'Python'],
  savedJobs: ['job-1', 'job-3']
};

const EMPLOYER_USER = {
  _id: 'user-emp-1',
  name: 'Pooja Verma (HR Lead)',
  email: 'employer@jobyatra.in',
  phone: '+91 91234 56789',
  role: 'EMPLOYER',
  qualification: 'Post Graduate',
  city: 'Bengaluru',
  skills: ['Talent Sourcing', 'Technical Recruitment', 'HR Operations'],
  savedJobs: []
};

// 4-category application pipeline
const MOCK_APPLICATIONS = [
  {
    _id: 'app-1',
    jobId: MOCK_JOBS[0],
    candidateId: 'user-cand-1',
    appliedViaPortal: 'Direct Company',
    applyType: 'DIRECT',
    status: 'APPLIED',
    candidateName: 'Aarav Sharma',
    candidateEmail: 'candidate@jobyatra.in',
    candidateQualification: 'B.Tech / B.E',
    appliedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    _id: 'app-2',
    jobId: MOCK_JOBS[1] || MOCK_JOBS[0],
    candidateId: 'user-cand-1',
    appliedViaPortal: 'LinkedIn',
    applyType: 'DIRECT',
    status: 'IN_PROGRESS',
    candidateName: 'Aarav Sharma',
    candidateEmail: 'candidate@jobyatra.in',
    candidateQualification: 'B.Tech / B.E',
    appliedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    _id: 'app-3',
    jobId: MOCK_JOBS[2] || MOCK_JOBS[0],
    candidateId: 'user-cand-1',
    appliedViaPortal: 'Direct Company',
    applyType: 'DIRECT',
    status: 'SHORTLISTED',
    candidateName: 'Aarav Sharma',
    candidateEmail: 'candidate@jobyatra.in',
    candidateQualification: 'B.Tech / B.E',
    appliedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: 'app-4',
    jobId: MOCK_JOBS[3] || MOCK_JOBS[0],
    candidateId: 'user-cand-1',
    appliedViaPortal: 'Naukri',
    applyType: 'DIRECT',
    status: 'SELECTED',
    candidateName: 'Aarav Sharma',
    candidateEmail: 'candidate@jobyatra.in',
    candidateQualification: 'B.Tech / B.E',
    appliedAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

export function handleMockRequest(method, url, data, params) {
  const cleanUrl = url.replace(/^\/?api\/v1/, '').split('?')[0];
  const query = params || {};

  // 1. Auth check: /auth/me
  if (cleanUrl === '/auth/me') {
    const savedUser = localStorage.getItem('jobyatra_user');
    const user = savedUser ? JSON.parse(savedUser) : CANDIDATE_USER;
    return { success: true, data: { user } };
  }

  // 2. Auth login: /auth/login
  if (cleanUrl === '/auth/login') {
    const email = data?.email || 'candidate@jobyatra.in';
    let user = CANDIDATE_USER;
    if (email.includes('employer')) user = EMPLOYER_USER;
    else if (email) {
      user = { ...CANDIDATE_USER, email, name: email.split('@')[0].replace(/[._]/g, ' ') };
    }
    return {
      success: true,
      data: {
        user,
        token: 'mock-jwt-token-' + Date.now()
      }
    };
  }

  // 3. Auth register: /auth/register
  if (cleanUrl === '/auth/register') {
    const newUser = {
      _id: 'user-' + Date.now(),
      name: data?.name || 'New Candidate',
      email: data?.email || 'candidate@jobyatra.in',
      phone: data?.phone || '+91 98765 00000',
      role: data?.role || 'CANDIDATE',
      qualification: data?.qualification || 'Any Graduate',
      city: data?.city || 'Bengaluru',
      skills: ['Communication', 'Problem Solving'],
      savedJobs: []
    };
    return { success: true, data: { user: newUser } };
  }

  // 4. Social login: /auth/social
  if (cleanUrl === '/auth/social') {
    const user = {
      _id: 'user-social-' + Date.now(),
      name: data?.name || 'Aarav Sharma',
      email: data?.email || 'aarav.sharma@gmail.com',
      avatar: data?.avatar,
      role: data?.role || 'CANDIDATE',
      qualification: 'B.Tech / B.E',
      city: 'Bengaluru',
      skills: ['React', 'Node.js', 'Python'],
      savedJobs: []
    };
    return {
      success: true,
      data: {
        user,
        token: 'mock-jwt-token-social-' + Date.now()
      }
    };
  }

  // 5. Jobs list: /jobs
  if (cleanUrl === '/jobs') {
    let filtered = [...MOCK_JOBS];

    if (query.q && query.q.trim()) {
      const q = query.q.toLowerCase().trim();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          (j.skills && j.skills.some((s) => s.toLowerCase().includes(q))) ||
          (j.description && j.description.toLowerCase().includes(q))
      );
    }

    if (query.qualification && query.qualification !== 'all') {
      filtered = filtered.filter(
        (j) => j.qualification && j.qualification.includes(query.qualification)
      );
    }

    if (query.portalSource && query.portalSource !== 'all') {
      filtered = filtered.filter(
        (j) => j.sources && j.sources.some((s) => s.portal.toLowerCase() === query.portalSource.toLowerCase())
      );
    }

    if (query.city && query.city !== 'all') {
      filtered = filtered.filter(
        (j) => j.location && j.location.city.toLowerCase() === query.city.toLowerCase()
      );
    }

    if (query.jobType && query.jobType !== 'all') {
      filtered = filtered.filter((j) => j.jobType === query.jobType);
    }

    if (query.isRemote === 'true' || query.isRemote === true) {
      filtered = filtered.filter((j) => j.location && j.location.isRemote === true);
    }

    // Sort
    if (query.sort === 'salary_high') {
      filtered.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (query.sort === 'openings_high') {
      filtered.sort((a, b) => (b.openingsCount || 1) - (a.openingsCount || 1));
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, parseInt(query.limit, 10) || 12);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        jobs: paginatedJobs,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        facets: {
          qualifications: [],
          portals: [],
          cities: [],
          jobTypes: []
        }
      }
    };
  }

  // 6. Single Job detail: /jobs/:id
  if (cleanUrl.startsWith('/jobs/') && !cleanUrl.endsWith('/apply') && !cleanUrl.endsWith('/save')) {
    const id = cleanUrl.replace('/jobs/', '');
    const job = MOCK_JOBS.find((j) => j._id === id || j.slug === id) || MOCK_JOBS[0];
    return { success: true, data: { job } };
  }

  // 7. Apply to job: /jobs/:id/apply
  if (cleanUrl.endsWith('/apply')) {
    const id = cleanUrl.replace('/jobs/', '').replace('/apply', '');
    const job = MOCK_JOBS.find((j) => j._id === id) || MOCK_JOBS[0];
    const newApp = {
      _id: 'app-' + Date.now(),
      jobId: job,
      candidateId: 'user-cand-1',
      appliedViaPortal: data?.portal || 'Direct Company',
      applyType: 'DIRECT',
      status: 'APPLIED',
      candidateName: data?.candidateName || 'Aarav Sharma',
      candidateEmail: data?.candidateEmail || 'candidate@jobyatra.in',
      appliedAt: new Date().toISOString()
    };
    MOCK_APPLICATIONS.unshift(newApp);
    return { success: true, data: { application: newApp } };
  }

  // 8. Toggle save job: /jobs/:id/save
  if (cleanUrl.endsWith('/save')) {
    return { success: true, data: { isSaved: true } };
  }

  // 9. Companies list: /companies
  if (cleanUrl === '/companies') {
    let comps = [...MOCK_COMPANIES];
    if (query.search) {
      comps = comps.filter((c) => c.name.toLowerCase().includes(query.search.toLowerCase()));
    }
    if (query.industry && query.industry !== 'all') {
      comps = comps.filter((c) => c.industry.toLowerCase() === query.industry.toLowerCase());
    }
    return { success: true, data: comps };
  }

  // 10. Company detail: /companies/:slug
  if (cleanUrl.startsWith('/companies/') && !cleanUrl.endsWith('/jobs')) {
    const slug = cleanUrl.replace('/companies/', '');
    const comp = MOCK_COMPANIES.find((c) => c.slug === slug) || MOCK_COMPANIES[0];
    return { success: true, data: comp };
  }

  // 11. Company jobs: /companies/:slug/jobs
  if (cleanUrl.startsWith('/companies/') && cleanUrl.endsWith('/jobs')) {
    const slug = cleanUrl.replace('/companies/', '').replace('/jobs', '');
    const comp = MOCK_COMPANIES.find((c) => c.slug === slug) || MOCK_COMPANIES[0];
    const companyJobs = MOCK_JOBS.filter(
      (j) => j.companyName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') === slug
    );
    return { success: true, data: companyJobs.length > 0 ? companyJobs : [MOCK_JOBS[0]] };
  }

  // 12. Candidate applications: /applications/my-applications
  if (cleanUrl === '/applications/my-applications') {
    return { success: true, data: { applications: MOCK_APPLICATIONS } };
  }

  // 13. Admin stats: /admin/stats
  if (cleanUrl === '/admin/stats') {
    return {
      success: true,
      data: {
        totalJobs: 46,
        totalCompanies: MOCK_COMPANIES.length,
        totalApplications: MOCK_APPLICATIONS.length,
        totalUsers: 1420
      }
    };
  }

  return { success: true, data: {} };
}
