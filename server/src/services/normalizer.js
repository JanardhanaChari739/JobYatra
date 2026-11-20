/**
 * Qualification Normalizer for JobYatra
 * Standard buckets:
 * - '10th Pass'
 * - '12th / Inter'
 * - 'Diploma / ITI'
 * - 'Any Graduate'
 * - 'B.Tech / B.E'
 * - 'Post Graduate'
 */

const QUALIFICATION_BUCKETS = {
  TENTH: '10th Pass',
  TWELFTH: '12th / Inter',
  DIPLOMA_ITI: 'Diploma / ITI',
  ANY_GRADUATE: 'Any Graduate',
  BTECH_BE: 'B.Tech / B.E',
  POST_GRADUATE: 'Post Graduate'
};

const QUALIFICATION_PATTERNS = [
  {
    bucket: QUALIFICATION_BUCKETS.TENTH,
    patterns: [
      /\b(10th|tenth|ssc|matric|matriculation|secondary school|high school|10 pass)\b/i
    ]
  },
  {
    bucket: QUALIFICATION_BUCKETS.TWELFTH,
    patterns: [
      /\b(12th|twelfth|inter|intermediate|higher secondary|hsc|10\+2|puc|plus two)\b/i
    ]
  },
  {
    bucket: QUALIFICATION_BUCKETS.DIPLOMA_ITI,
    patterns: [
      /\b(iti|diploma|polytechnic|vocational|apprentice|ncvt|scvt)\b/i
    ]
  },
  {
    bucket: QUALIFICATION_BUCKETS.BTECH_BE,
    patterns: [
      /\b(b\.?tech|b\.?e\.?|bachelor of technology|bachelor of engineering|bca|bsc cs|bsc it)\b/i
    ]
  },
  {
    bucket: QUALIFICATION_BUCKETS.POST_GRADUATE,
    patterns: [
      /\b(post graduate|m\.?tech|m\.?e\.?|m\.?b\.?a|mca|m\.?sc|m\.?com|master|ph\.?d|post graduation)\b/i
    ]
  },
  {
    bucket: QUALIFICATION_BUCKETS.ANY_GRADUATE,
    patterns: [
      /\b(graduate|any graduate|bachelor|degree|b\.?com|b\.?a|b\.?sc|bba|bbm)\b/i
    ]
  }
];

/**
 * Normalize an input string or array of qualification tags into standard buckets
 * Returns an array of standard qualification strings
 */
function normalizeQualifications(input) {
  if (!input) return [QUALIFICATION_BUCKETS.ANY_GRADUATE];

  const textsToScan = Array.isArray(input) ? input : [String(input)];
  const matched = new Set();

  for (const text of textsToScan) {
    if (!text || typeof text !== 'string') continue;
    const cleanText = text.trim();

    // Direct check if it already matches one of the canonical buckets
    for (const canonical of Object.values(QUALIFICATION_BUCKETS)) {
      if (cleanText.toLowerCase() === canonical.toLowerCase()) {
        matched.add(canonical);
      }
    }

    // Pattern matching
    for (const rule of QUALIFICATION_PATTERNS) {
      for (const pattern of rule.patterns) {
        if (pattern.test(cleanText)) {
          matched.add(rule.bucket);
          break;
        }
      }
    }
  }

  if (matched.size === 0) {
    return [QUALIFICATION_BUCKETS.ANY_GRADUATE];
  }

  return Array.from(matched);
}

/**
 * Standardize Indian job types
 */
function normalizeJobType(rawType) {
  if (!rawType) return 'Full-time';
  const t = rawType.toLowerCase().trim();
  if (t.includes('intern')) return 'Internship';
  if (t.includes('part')) return 'Part-time';
  if (t.includes('contract') || t.includes('freelance') || t.includes('temp')) return 'Contract';
  return 'Full-time';
}

/**
 * Format Indian salary display string cleanly (LPA or ₹/month)
 */
function formatSalaryDisplay(min, max, currency = 'INR', period = 'yearly') {
  if (!min && !max) return 'Best in Industry';

  if (period === 'monthly' || (min < 100000 && min > 5000)) {
    if (min && max && min !== max) {
      return `₹${(min).toLocaleString('en-IN')} - ₹${(max).toLocaleString('en-IN')}/mo`;
    }
    return `₹${(min || max).toLocaleString('en-IN')}/mo`;
  }

  // Yearly in LPA
  const minLPA = min ? (min >= 100000 ? (min / 100000).toFixed(1) : min) : null;
  const maxLPA = max ? (max >= 100000 ? (max / 100000).toFixed(1) : max) : null;

  if (minLPA && maxLPA) {
    return `₹${minLPA} - ₹${maxLPA} LPA`;
  } else if (minLPA) {
    return `From ₹${minLPA} LPA`;
  } else {
    return `Up to ₹${maxLPA} LPA`;
  }
}

module.exports = {
  QUALIFICATION_BUCKETS,
  normalizeQualifications,
  normalizeJobType,
  formatSalaryDisplay
};
