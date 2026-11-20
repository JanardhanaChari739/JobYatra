const {
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
} = require('../workers/adapters/portalAdapters');
const RAW_PORTAL_FEEDS = require('../workers/rawJobFeeds');
const JobDeduplicator = require('./deduplicator');
const Job = require('../models/Job');
const Company = require('../models/Company');

class UniversalAggregatorService {
  constructor() {
    this.adapters = {
      linkedin: new LinkedInAdapter(),
      naukri: new NaukriAdapter(),
      indeed: new IndeedAdapter(),
      apna: new ApnaEntryLevelAdapter(),
      directAts: new CompanyAtsAdapter(),
      govtNcs: new GovtNcsAdapter(),
      foundit: new FounditAdapter(),
      glassdoor: new GlassdoorAdapter(),
      internshala: new InternshalaAdapter(),
      unstop: new UnstopAdapter()
    };
  }

  /**
   * Run a full sync cycle across all portals
   */
  async runSyncCycle() {
    console.log('[JobYatra Aggregator] Starting Universal Aggregation & Deduplication Sync across all portals...');

    const allRawJobs = [];

    // Ingest all raw portal feed categories dynamically
    for (const key of Object.keys(RAW_PORTAL_FEEDS)) {
      if (Array.isArray(RAW_PORTAL_FEEDS[key])) {
        allRawJobs.push(...RAW_PORTAL_FEEDS[key]);
      }
    }

    // Deduplicate & Ingest into MongoDB
    const stats = await JobDeduplicator.deduplicateAndIngest(allRawJobs, Job);

    // Auto-link or create company records
    await this.linkCompanies();

    console.log(`[JobYatra Aggregator] Sync Complete! Ingested: ${stats.total}, Created: ${stats.created}, Merged Duplicates: ${stats.merged}`);
    return stats;
  }

  /**
   * Ensure companies mentioned in jobs exist in the Company directory
   */
  async linkCompanies() {
    const uniqueCompanyNames = await Job.distinct('companyName');

    for (const name of uniqueCompanyNames) {
      const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      let company = await Company.findOne({ slug });

      if (!company) {
        // Create verified company record
        company = await Company.create({
          name,
          slug,
          industry: this.inferIndustry(name),
          headquarters: 'India',
          isVerified: true,
          website: `https://${name.toLowerCase().replace(/[^\w]/g, '')}.com`
        });
      }

      // Link companyId in jobs
      await Job.updateMany({ companyName: name, companyId: null }, { companyId: company._id });
    }
  }

  inferIndustry(companyName) {
    const c = companyName.toLowerCase();
    if (c.includes('zomato') || c.includes('swiggy') || c.includes('blinkit') || c.includes('meesho') || c.includes('flipkart') || c.includes('nykaa') || c.includes('amazon') || c.includes('delhivery') || c.includes('shadowfax')) {
      return 'E-commerce & Logistics';
    }
    if (c.includes('razorpay') || c.includes('zerodha') || c.includes('phonepe') || c.includes('cred') || c.includes('hdfc') || c.includes('icici') || c.includes('muthoot') || c.includes('paytm') || c.includes('axis')) {
      return 'Fintech & Banking';
    }
    if (c.includes('tata') || c.includes('larsen') || c.includes('ecil') || c.includes('bhel') || c.includes('bel') || c.includes('railway') || c.includes('ongc') || c.includes('sail')) {
      return 'Manufacturing & Engineering';
    }
    return 'Information Technology';
  }
}

const universalAggregator = new UniversalAggregatorService();
module.exports = universalAggregator;
