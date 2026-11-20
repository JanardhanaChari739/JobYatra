const { generateJobHash } = require('../utils/hasher');
const { normalizeQualifications, normalizeJobType, formatSalaryDisplay } = require('./normalizer');

/**
 * Deduplicate and merge an array of raw jobs into a list of master job records
 * or upsert them into MongoDB.
 */
class JobDeduplicator {
  /**
   * Process a list of raw incoming jobs from various adapters
   * @param {Array} rawJobs - list of jobs from portal adapters
   * @param {Model} JobModel - Mongoose Job model
   * @returns {Object} statistics { created, merged, total }
   */
  static async deduplicateAndIngest(rawJobs, JobModel) {
    let created = 0;
    let merged = 0;

    for (const raw of rawJobs) {
      const city = raw.location?.city || raw.city || 'Pan-India';
      const companyName = raw.companyName || raw.company || 'Unknown Company';
      const title = raw.title || 'Untitled Opening';

      // 1. Compute SHA-256 Deduplication Hash
      const dedupHash = raw.dedupHash || generateJobHash(companyName, title, city);

      // 2. Normalize qualifications
      const qualifications = normalizeQualifications(raw.qualification || raw.qualifications);
      const jobType = normalizeJobType(raw.jobType);

      // 3. Normalize salary
      const salaryMin = raw.salaryMin || 0;
      const salaryMax = raw.salaryMax || 0;
      const salaryDisplay = raw.salaryDisplay || formatSalaryDisplay(salaryMin, salaryMax);

      // Prepare portal source entry
      const sourceEntry = {
        portal: raw.portal || 'Direct Company',
        url: raw.portalUrl || raw.url || `https://${(raw.portal || 'direct').toLowerCase().replace(/\s+/g, '')}.com/jobs`,
        externalJobId: raw.externalJobId || null,
        postedAt: raw.postedAt ? new Date(raw.postedAt) : new Date(),
        isDirect: raw.portal === 'Direct Company' || raw.isDirect === true
      };

      // 4. Check if Master Job with dedupHash already exists in database
      const existingJob = await JobModel.findOne({ dedupHash });

      if (existingJob) {
        // Merge into existing Master Job
        const portalExists = existingJob.sources.some(
          (s) => s.portal.toLowerCase() === sourceEntry.portal.toLowerCase()
        );

        if (!portalExists) {
          existingJob.sources.push(sourceEntry);
        }

        // Merge skills
        if (Array.isArray(raw.skills) && raw.skills.length > 0) {
          const combinedSkills = new Set([...existingJob.skills, ...raw.skills]);
          existingJob.skills = Array.from(combinedSkills);
        }

        // Merge qualifications
        const combinedQuals = new Set([...existingJob.qualification, ...qualifications]);
        existingJob.qualification = Array.from(combinedQuals);

        // Update salary bounds if better values found
        if (salaryMax > existingJob.salaryMax) {
          existingJob.salaryMax = salaryMax;
          existingJob.salaryMin = Math.min(existingJob.salaryMin, salaryMin || existingJob.salaryMin);
          existingJob.salaryDisplay = formatSalaryDisplay(existingJob.salaryMin, existingJob.salaryMax);
        }

        await existingJob.save();
        merged++;
      } else {
        // Create new Master Job
        const slug = `${title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${companyName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;

        const newJob = new JobModel({
          title,
          slug,
          companyName,
          companyId: raw.companyId || null,
          qualification: qualifications,
          experienceMin: raw.experienceMin !== undefined ? raw.experienceMin : 0,
          experienceMax: raw.experienceMax !== undefined ? raw.experienceMax : 3,
          salaryMin,
          salaryMax,
          salaryDisplay,
          location: {
            city: city.trim(),
            state: raw.location?.state || raw.state || 'India',
            isRemote: raw.location?.isRemote || raw.isRemote || false
          },
          jobType,
          openingsCount: raw.openingsCount || raw.openings || 1,
          skills: raw.skills || ['Communication', 'Teamwork'],
          description: raw.description || `Exciting career opportunity for ${title} at ${companyName}.`,
          sources: [sourceEntry],
          dedupHash,
          status: 'ACTIVE',
          postedAt: raw.postedAt ? new Date(raw.postedAt) : new Date()
        });

        await newJob.save();
        created++;
      }
    }

    return { created, merged, total: rawJobs.length };
  }
}

module.exports = JobDeduplicator;
