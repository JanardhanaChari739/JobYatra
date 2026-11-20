require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const universalAggregator = require('../services/aggregator');

async function seedInitialData() {
  console.log('[JobYatra Seed] Seeding demo users...');

  const salt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash('Pass@1234', salt);

  // 1. Seed Candidate Demo User
  let candidate = await User.findOne({ email: 'candidate@jobyatra.in' });
  if (!candidate) {
    candidate = await User.create({
      name: 'Aarav Sharma',
      email: 'candidate@jobyatra.in',
      phone: '+91 98765 43210',
      passwordHash: commonPasswordHash,
      role: 'CANDIDATE',
      qualification: 'B.Tech / B.E',
      city: 'Bengaluru',
      skills: ['React', 'Node.js', 'TypeScript', 'SQL', 'Python'],
      resumeUrl: 'https://jobyatra.in/resumes/aarav-sharma-senior-dev.pdf'
    });
    console.log('[JobYatra Seed] Candidate demo created: candidate@jobyatra.in / Pass@1234');
  }

  // 2. Seed Employer Demo User
  let employer = await User.findOne({ email: 'employer@jobyatra.in' });
  if (!employer) {
    employer = await User.create({
      name: 'Pooja Verma (HR Lead)',
      email: 'employer@jobyatra.in',
      phone: '+91 91234 56789',
      passwordHash: commonPasswordHash,
      role: 'EMPLOYER',
      qualification: 'Post Graduate',
      city: 'Bengaluru',
      skills: ['Talent Sourcing', 'Technical Recruitment', 'HR Operations']
    });
    console.log('[JobYatra Seed] Employer demo created: employer@jobyatra.in / Pass@1234');
  }

  // 3. Seed Admin Demo User
  let admin = await User.findOne({ email: 'admin@jobyatra.in' });
  if (!admin) {
    admin = await User.create({
      name: 'JobYatra Administrator',
      email: 'admin@jobyatra.in',
      phone: '+91 99999 88888',
      passwordHash: commonPasswordHash,
      role: 'ADMIN',
      qualification: 'Post Graduate',
      city: 'New Delhi'
    });
    console.log('[JobYatra Seed] Admin demo created: admin@jobyatra.in / Pass@1234');
  }

  // 4. Ingest and Deduplicate Jobs via Multi-Portal Aggregator
  console.log('[JobYatra Seed] Running universal multi-portal job aggregation & deduplication pipeline...');
  const stats = await universalAggregator.runSyncCycle();
  console.log(`[JobYatra Seed] Multi-Portal Aggregator finished: ${stats.created} new jobs created, ${stats.merged} duplicates merged!`);

  // 5. Seed sample applications across all 4 pipeline categories (Applied, In Progress, Shortlisted, Selected)
  const sampleJobs = await Job.find({ status: 'ACTIVE' }).limit(5);
  if (sampleJobs.length > 0 && candidate) {
    // Clear old applications to seed fresh 4-category pipeline
    await Application.deleteMany({ candidateId: candidate._id });

    // Category 1: APPLIED (Genuinely submitted application)
    if (sampleJobs[0]) {
      await Application.create({
        jobId: sampleJobs[0]._id,
        candidateId: candidate._id,
        appliedViaPortal: 'Direct Company',
        applyType: 'DIRECT',
        status: 'APPLIED',
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        candidatePhone: candidate.phone,
        candidateQualification: candidate.qualification,
        coverNote: 'Application submitted directly to hiring team via JobYatra ATS.',
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      });
    }

    // Category 2: IN_PROGRESS
    if (sampleJobs[1]) {
      await Application.create({
        jobId: sampleJobs[1]._id,
        candidateId: candidate._id,
        appliedViaPortal: 'Direct Company',
        applyType: 'DIRECT',
        status: 'IN_PROGRESS',
        coverNote: 'Application under review with engineering hiring manager.',
        resumeUrl: candidate.resumeUrl,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        candidatePhone: candidate.phone,
        candidateQualification: candidate.qualification,
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      });
    }

    // Category 3: SHORTLISTED
    if (sampleJobs[2]) {
      await Application.create({
        jobId: sampleJobs[2]._id,
        candidateId: candidate._id,
        appliedViaPortal: 'Direct Company',
        applyType: 'DIRECT',
        status: 'SHORTLISTED',
        coverNote: 'Profile shortlisted for technical architecture interview.',
        resumeUrl: candidate.resumeUrl,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        candidatePhone: candidate.phone,
        candidateQualification: candidate.qualification,
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      });
    }

    // Category 4: SELECTED
    if (sampleJobs[3]) {
      await Application.create({
        jobId: sampleJobs[3]._id,
        candidateId: candidate._id,
        appliedViaPortal: 'LinkedIn',
        applyType: 'EXTERNAL_REDIRECT',
        status: 'SELECTED',
        coverNote: 'Final offer letter extended. Verification in progress.',
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        candidatePhone: candidate.phone,
        candidateQualification: candidate.qualification,
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      });
    }

    // Also bookmark a job for the candidate
    candidate.savedJobs = [sampleJobs[0]._id];
    await candidate.save();

    console.log('[JobYatra Seed] Sample candidate applications across all 4 categories (Applied, In Progress, Shortlisted, Selected) seeded.');
  }

  console.log('[JobYatra Seed] Database successfully seeded with 100% realistic Indian job data!');
}

// Standalone execution handler
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedInitialData();
      await disconnectDB();
      console.log('[JobYatra Seed] Script completed cleanly.');
      process.exit(0);
    } catch (err) {
      console.error('[JobYatra Seed] Error executing seed:', err);
      process.exit(1);
    }
  })();
}

module.exports = { seedInitialData };
