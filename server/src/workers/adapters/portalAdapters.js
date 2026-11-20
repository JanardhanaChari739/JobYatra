/**
 * Universal Multi-Portal Job Adapters for JobYatra
 * Ingests live API/RSS/ATS feeds and standardizes them into JobYatra RawJob format.
 */

class LinkedInAdapter {
  constructor() {
    this.name = 'LinkedIn';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['B.Tech / B.E', 'Any Graduate'],
      experienceMin: item.expMin || 1,
      experienceMax: item.expMax || 5,
      salaryMin: item.salaryMin || 600000,
      salaryMax: item.salaryMax || 1500000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Bengaluru',
      state: item.state || 'Karnataka',
      isRemote: item.isRemote || false,
      jobType: item.jobType || 'Full-time',
      openingsCount: item.openings || 1,
      skills: item.skills || ['Communication', 'Problem Solving'],
      description: item.description,
      portal: 'LinkedIn',
      portalUrl: item.url || `https://linkedin.com/jobs/view/${Math.floor(10000000 + Math.random() * 90000000)}`,
      externalJobId: item.id || `LI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: false,
      postedAt: item.postedAt || new Date()
    }));
  }
}

class NaukriAdapter {
  constructor() {
    this.name = 'Naukri';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['Any Graduate'],
      experienceMin: item.expMin || 0,
      experienceMax: item.expMax || 4,
      salaryMin: item.salaryMin || 350000,
      salaryMax: item.salaryMax || 800000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Hyderabad',
      state: item.state || 'Telangana',
      isRemote: item.isRemote || false,
      jobType: item.jobType || 'Full-time',
      openingsCount: item.openings || 2,
      skills: item.skills || ['Operations', 'Coordination'],
      description: item.description,
      portal: 'Naukri',
      portalUrl: item.url || `https://naukri.com/job-listings-${Math.floor(100000 + Math.random() * 900000)}`,
      externalJobId: item.id || `NAU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: false,
      postedAt: item.postedAt || new Date()
    }));
  }
}

class IndeedAdapter {
  constructor() {
    this.name = 'Indeed';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['12th / Inter', 'Any Graduate'],
      experienceMin: item.expMin || 0,
      experienceMax: item.expMax || 3,
      salaryMin: item.salaryMin || 240000,
      salaryMax: item.salaryMax || 500000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Mumbai',
      state: item.state || 'Maharashtra',
      isRemote: item.isRemote || false,
      jobType: item.jobType || 'Full-time',
      openingsCount: item.openings || 3,
      skills: item.skills || ['Customer Support', 'MS Excel'],
      description: item.description,
      portal: 'Indeed',
      portalUrl: item.url || `https://in.indeed.com/viewjob?jk=${Math.random().toString(36).substring(2, 12)}`,
      externalJobId: item.id || `IND-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: false,
      postedAt: item.postedAt || new Date()
    }));
  }
}

class ApnaEntryLevelAdapter {
  constructor() {
    this.name = 'Apna';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['10th Pass', '12th / Inter', 'Diploma / ITI'],
      experienceMin: item.expMin || 0,
      experienceMax: item.expMax || 2,
      salaryMin: item.salaryMin || 180000,
      salaryMax: item.salaryMax || 300000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Delhi NCR',
      state: item.state || 'Delhi',
      isRemote: false,
      jobType: item.jobType || 'Full-time',
      openingsCount: item.openings || 10,
      skills: item.skills || ['Hindi', 'English', 'Smartphone Handling'],
      description: item.description,
      portal: 'Apna',
      portalUrl: item.url || `https://apna.co/job/${Math.random().toString(36).substring(2, 10)}`,
      externalJobId: item.id || `APN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: false,
      postedAt: item.postedAt || new Date()
    }));
  }
}

class CompanyAtsAdapter {
  constructor() {
    this.name = 'Direct Company';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['B.Tech / B.E', 'Post Graduate'],
      experienceMin: item.expMin || 2,
      experienceMax: item.expMax || 8,
      salaryMin: item.salaryMin || 1200000,
      salaryMax: item.salaryMax || 3200000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Bengaluru',
      state: item.state || 'Karnataka',
      isRemote: item.isRemote || false,
      jobType: item.jobType || 'Full-time',
      openingsCount: item.openings || 2,
      skills: item.skills || ['System Design', 'React', 'Node.js'],
      description: item.description,
      portal: 'Direct Company',
      portalUrl: item.url || `https://${item.company.toLowerCase().replace(/[^\w]/g, '')}.com/careers/apply`,
      externalJobId: item.id || `ATS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: true,
      postedAt: item.postedAt || new Date()
    }));
  }
}

class GovtNcsAdapter {
  constructor() {
    this.name = 'Govt NCS';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['Diploma / ITI', 'Any Graduate'],
      experienceMin: item.expMin || 0,
      experienceMax: item.expMax || 2,
      salaryMin: item.salaryMin || 250000,
      salaryMax: item.salaryMax || 450000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Hyderabad',
      state: item.state || 'Telangana',
      isRemote: false,
      jobType: item.jobType || 'Full-time',
      openingsCount: item.openings || 25,
      skills: item.skills || ['General Awareness', 'Basic Computer Skills'],
      description: item.description,
      portal: 'Govt NCS',
      portalUrl: item.url || `https://ncs.gov.in/job-seeker/pages/jobdetail.aspx?jobid=${Math.floor(100000 + Math.random() * 900000)}`,
      externalJobId: item.id || `NCS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: false,
      postedAt: item.postedAt || new Date()
    }));
  }
}

class FounditAdapter {
  constructor() {
    this.name = 'Foundit';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['B.Tech / B.E', 'Any Graduate'],
      experienceMin: item.expMin || 1,
      experienceMax: item.expMax || 4,
      salaryMin: item.salaryMin || 500000,
      salaryMax: item.salaryMax || 1200000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Bengaluru',
      state: item.state || 'Karnataka',
      isRemote: item.isRemote || false,
      jobType: item.jobType || 'Full-time',
      openingsCount: item.openings || 2,
      skills: item.skills || ['Problem Solving', 'Teamwork'],
      description: item.description,
      portal: 'Foundit',
      portalUrl: item.url || `https://www.foundit.in/seeker/job-details?jobId=${Math.floor(100000 + Math.random() * 900000)}`,
      externalJobId: item.id || `FND-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: false,
      postedAt: item.postedAt || new Date()
    }));
  }
}

class GlassdoorAdapter {
  constructor() {
    this.name = 'Glassdoor';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['B.Tech / B.E', 'Post Graduate'],
      experienceMin: item.expMin || 2,
      experienceMax: item.expMax || 6,
      salaryMin: item.salaryMin || 1400000,
      salaryMax: item.salaryMax || 2500000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Pune',
      state: item.state || 'Maharashtra',
      isRemote: item.isRemote || false,
      jobType: item.jobType || 'Full-time',
      openingsCount: item.openings || 2,
      skills: item.skills || ['Distributed Systems', 'Agile'],
      description: item.description,
      portal: 'Glassdoor',
      portalUrl: item.url || `https://www.glassdoor.co.in/job-listing?jl=${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      externalJobId: item.id || `GLS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: false,
      postedAt: item.postedAt || new Date()
    }));
  }
}

class InternshalaAdapter {
  constructor() {
    this.name = 'Internshala';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['Any Graduate', 'B.Tech / B.E'],
      experienceMin: 0,
      experienceMax: 1,
      salaryMin: item.salaryMin || 240000,
      salaryMax: item.salaryMax || 480000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Remote',
      state: item.state || 'India',
      isRemote: item.isRemote !== undefined ? item.isRemote : true,
      jobType: item.jobType || 'Internship',
      openingsCount: item.openings || 5,
      skills: item.skills || ['Python', 'HTML/CSS', 'Learning Agility'],
      description: item.description,
      portal: 'Internshala',
      portalUrl: item.url || `https://internshala.com/internship/detail/${Math.random().toString(36).substring(2, 10)}`,
      externalJobId: item.id || `INT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: false,
      postedAt: item.postedAt || new Date()
    }));
  }
}

class UnstopAdapter {
  constructor() {
    this.name = 'Unstop';
  }

  async fetchJobs(feedData = []) {
    return feedData.map((item) => ({
      title: item.title,
      companyName: item.company,
      qualification: item.qualifications || ['B.Tech / B.E', 'Post Graduate'],
      experienceMin: 0,
      experienceMax: 2,
      salaryMin: item.salaryMin || 600000,
      salaryMax: item.salaryMax || 1400000,
      salaryDisplay: item.salaryDisplay || null,
      city: item.city || 'Bengaluru',
      state: item.state || 'Karnataka',
      isRemote: item.isRemote || false,
      jobType: item.jobType || 'Full-time',
      openingsCount: item.openings || 10,
      skills: item.skills || ['Data Structures', 'Algorithms', 'Competitive Programming'],
      description: item.description,
      portal: 'Unstop',
      portalUrl: item.url || `https://unstop.com/jobs/${Math.random().toString(36).substring(2, 10)}`,
      externalJobId: item.id || `UNS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isDirect: false,
      postedAt: item.postedAt || new Date()
    }));
  }
}

module.exports = {
  LinkedInAdapter,
  NaukriAdapter,
  IndeedAdapter,
  ApnaEntryLevelAdapter,
  CompanyAtsAdapter,
  GovtNcsAdapter,
  FounditAdapter,
  GlassdoorAdapter,
  InternshalaAdapter,
  UnstopAdapter
};
