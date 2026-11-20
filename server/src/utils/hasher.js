const crypto = require('crypto');

/**
 * Clean & normalize text for deduplication matching
 */
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\b(private|pvt|ltd|limited|inc|technologies|solutions|corp|corporation|services|infotech)\b/gi, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Standardize Indian cities (e.g., Bangalore -> Bengaluru, Gurgaon -> Gurugram)
 */
function normalizeCity(city) {
  if (!city) return 'pan-india';
  const c = city.toLowerCase().trim();
  if (c.includes('bangalore') || c.includes('bengaluru')) return 'bengaluru';
  if (c.includes('gurgaon') || c.includes('gurugram')) return 'gurugram';
  if (c.includes('bombay') || c.includes('mumbai')) return 'mumbai';
  if (c.includes('calcutta') || c.includes('kolkata')) return 'kolkata';
  if (c.includes('madras') || c.includes('chennai')) return 'chennai';
  if (c.includes('delhi') || c.includes('noida') || c.includes('ncr')) return 'delhi-ncr';
  if (c.includes('hyderabad') || c.includes('secunderabad')) return 'hyderabad';
  if (c.includes('pune')) return 'pune';
  if (c.includes('remote') || c.includes('work from home')) return 'remote';
  return c.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
}

/**
 * Generate SHA-256 deduplication hash from normalized company, title, and location
 */
function generateJobHash(companyName, title, city) {
  const normCompany = normalizeString(companyName);
  const normTitle = normalizeString(title);
  const normCity = normalizeCity(city);
  const compositeString = `${normCompany}::${normTitle}::${normCity}`;
  return crypto.createHash('sha256').update(compositeString).digest('hex');
}

module.exports = {
  normalizeString,
  normalizeCity,
  generateJobHash
};
