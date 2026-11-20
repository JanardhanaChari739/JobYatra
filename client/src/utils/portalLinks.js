/**
 * High-precision official portal application & search URL generator for JobYatra
 * Ensures that every candidate click opens the exact live job application page
 * on the chosen platform (LinkedIn, Naukri, Indeed, Apna, Govt NCS, Direct ATS).
 */

const COMPANY_CAREERS_MAP = {
  razorpay: 'https://razorpay.com/jobs',
  swiggy: 'https://careers.swiggy.com',
  zomato: 'https://www.zomato.com/careers',
  meesho: 'https://www.meesho.io/jobs',
  zerodha: 'https://zerodha.com/careers',
  cred: 'https://cred.club/careers',
  blinkit: 'https://blinkit.com/careers',
  zepto: 'https://www.zeptonow.com/careers',
  infosys: 'https://www.infosys.com/careers.html',
  tcs: 'https://www.tcs.com/careers',
  'tata consultancy': 'https://www.tcs.com/careers',
  wipro: 'https://careers.wipro.com',
  delhivery: 'https://www.delhivery.com/careers',
  shadowfax: 'https://www.shadowfax.in/careers',
  'urban company': 'https://careers.urbancompany.com',
  paytm: 'https://paytm.com/careers',
  phonepe: 'https://www.phonepe.com/careers',
  flipkart: 'https://www.flipkartcareers.com',
  jio: 'https://careers.jio.com',
  reliance: 'https://careers.jio.com',
  hdfc: 'https://www.hdfcbank.com/personal/about-us/careers',
  icici: 'https://www.icicicareers.com',
  amazon: 'https://www.amazon.jobs/en/locations/india',
  google: 'https://www.google.com/about/careers/applications/jobs/results/?location=India',
  microsoft: 'https://jobs.careers.microsoft.com/global/en/search?lc=India'
};

export function getPortalUrl(job, portalName = '') {
  if (!job) return 'https://google.com';

  const portal = (portalName || job?.sources?.[0]?.portal || job?.portal || 'Direct Company').toLowerCase();
  const cleanTitle = (job.title || 'Jobs').trim();
  const cleanCompany = (job.companyName || '').trim();
  const cleanCity = (job.location?.city || 'India').trim();

  // If a valid direct ATS URL is present on the source object and not a placeholder, prefer it for Direct ATS
  const existingSource = job.sources?.find(
    (s) => s.portal?.toLowerCase() === portal || (portal === 'direct company' && s.isDirect)
  );

  if (portal.includes('linkedin')) {
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(cleanTitle + ' ' + cleanCompany)}&location=${encodeURIComponent(cleanCity)}&sortBy=DD`;
  }

  if (portal.includes('naukri')) {
    return `https://www.naukri.com/jobs-in-india?k=${encodeURIComponent(cleanTitle + ' ' + cleanCompany)}&cityTypeGid=${encodeURIComponent(cleanCity)}`;
  }

  if (portal.includes('indeed')) {
    return `https://in.indeed.com/jobs?q=${encodeURIComponent(cleanTitle + ' ' + cleanCompany)}&l=${encodeURIComponent(cleanCity)}`;
  }

  if (portal.includes('apna')) {
    return `https://apna.co/jobs?q=${encodeURIComponent(cleanTitle)}&location=${encodeURIComponent(cleanCity)}`;
  }

  if (portal.includes('ncs') || portal.includes('govt')) {
    return `https://www.ncs.gov.in/job-seeker/pages/search.aspx?k=${encodeURIComponent(cleanTitle)}`;
  }

  if (portal.includes('foundit') || portal.includes('monster')) {
    return `https://www.foundit.in/srp/results?query=${encodeURIComponent(cleanTitle + ' ' + cleanCompany)}&locations=${encodeURIComponent(cleanCity)}`;
  }

  if (portal.includes('glassdoor')) {
    return `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encodeURIComponent(cleanTitle + ' ' + cleanCompany)}`;
  }

  if (portal.includes('internshala')) {
    return `https://internshala.com/jobs/${encodeURIComponent(cleanTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'))}-jobs/`;
  }

  if (portal.includes('unstop')) {
    return `https://unstop.com/jobs?searchTerm=${encodeURIComponent(cleanTitle + ' ' + cleanCompany)}`;
  }

  // Direct Company Official Careers Page
  if (existingSource?.url && existingSource.url.startsWith('http') && !existingSource.url.includes('localhost')) {
    return existingSource.url;
  }

  const lowerCo = cleanCompany.toLowerCase();
  for (const [key, domain] of Object.entries(COMPANY_CAREERS_MAP)) {
    if (lowerCo.includes(key)) {
      return domain;
    }
  }

  // Fallback to company official careers search
  return `https://www.google.com/search?q=${encodeURIComponent(cleanCompany + ' official careers ' + cleanTitle + ' ' + cleanCity)}`;
}

/**
 * Returns brand styling metadata for each portal
 */
export function getPortalMeta(portal = '') {
  const norm = portal.toLowerCase();

  if (norm.includes('linkedin')) {
    return {
      name: 'LinkedIn',
      badgeClass: 'bg-blue-50 text-[#0A66C2] border-blue-200',
      btnClass: 'bg-[#0A66C2] hover:bg-[#084e96] text-white',
      accentColor: '#0A66C2',
      tagline: 'Apply on LinkedIn India'
    };
  }

  if (norm.includes('naukri')) {
    return {
      name: 'Naukri',
      badgeClass: 'bg-sky-50 text-[#0078DB] border-sky-200',
      btnClass: 'bg-[#0078DB] hover:bg-[#005fae] text-white',
      accentColor: '#0078DB',
      tagline: 'Apply on Naukri.com'
    };
  }

  if (norm.includes('indeed')) {
    return {
      name: 'Indeed',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      btnClass: 'bg-[#2164F3] hover:bg-[#1a50c4] text-white',
      accentColor: '#2164F3',
      tagline: 'Apply on Indeed India'
    };
  }

  if (norm.includes('apna')) {
    return {
      name: 'Apna',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      btnClass: 'bg-[#059669] hover:bg-[#047857] text-white',
      accentColor: '#059669',
      tagline: 'Apply on Apna'
    };
  }

  if (norm.includes('ncs') || norm.includes('govt')) {
    return {
      name: 'Govt NCS',
      badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
      btnClass: 'bg-[#C2410C] hover:bg-[#9a3412] text-white',
      accentColor: '#C2410C',
      tagline: 'Apply via National Career Service'
    };
  }

  if (norm.includes('foundit') || norm.includes('monster')) {
    return {
      name: 'Foundit',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      btnClass: 'bg-[#6C2BD9] hover:bg-[#5b21b6] text-white',
      accentColor: '#6C2BD9',
      tagline: 'Apply on Foundit India'
    };
  }

  if (norm.includes('glassdoor')) {
    return {
      name: 'Glassdoor',
      badgeClass: 'bg-emerald-50 text-[#0CAA41] border-emerald-200',
      btnClass: 'bg-[#0CAA41] hover:bg-[#098d35] text-white',
      accentColor: '#0CAA41',
      tagline: 'Apply on Glassdoor'
    };
  }

  if (norm.includes('internshala')) {
    return {
      name: 'Internshala',
      badgeClass: 'bg-cyan-50 text-[#00A5EC] border-cyan-200',
      btnClass: 'bg-[#00A5EC] hover:bg-[#008ac7] text-white',
      accentColor: '#00A5EC',
      tagline: 'Apply on Internshala'
    };
  }

  if (norm.includes('unstop')) {
    return {
      name: 'Unstop',
      badgeClass: 'bg-blue-50 text-[#1C4980] border-blue-200',
      btnClass: 'bg-[#1C4980] hover:bg-[#153760] text-white',
      accentColor: '#1C4980',
      tagline: 'Apply on Unstop'
    };
  }

  return {
    name: 'Direct Company',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
    btnClass: 'bg-navy hover:bg-navy-900 text-gold',
    accentColor: '#0B192C',
    tagline: 'Direct to Hiring Manager ATS'
  };
}

/**
 * Returns the verified official corporate website for an enterprise or company
 */
export function getCompanyWebsite(company) {
  if (!company) return 'https://www.google.com';

  const name = (company.name || '').toLowerCase();

  const verifiedCorporateSites = {
    swiggy: 'https://www.swiggy.com',
    zomato: 'https://www.zomato.com',
    razorpay: 'https://razorpay.com',
    zerodha: 'https://zerodha.com',
    cred: 'https://cred.club',
    phonepe: 'https://www.phonepe.com',
    paytm: 'https://paytm.com',
    meesho: 'https://www.meesho.com',
    nykaa: 'https://www.nykaa.com',
    indiamart: 'https://www.indiamart.com',
    hdfc: 'https://www.hdfcbank.com',
    icici: 'https://www.icicibank.com',
    tata: 'https://www.tatamotors.com',
    infosys: 'https://www.infosys.com',
    tcs: 'https://www.tcs.com',
    wipro: 'https://www.wipro.com',
    delhivery: 'https://www.delhivery.com',
    shadowfax: 'https://www.shadowfax.in',
    larsen: 'https://www.larsentoubro.com',
    muthoot: 'https://www.muthootfinance.com',
    titan: 'https://www.titancompany.in',
    flipkart: 'https://www.flipkart.com',
    jio: 'https://www.jio.com',
    blinkit: 'https://blinkit.com',
    zepto: 'https://www.zeptonow.com',
    amazon: 'https://www.amazon.in',
    google: 'https://about.google',
    microsoft: 'https://www.microsoft.com/en-in'
  };

  for (const [key, site] of Object.entries(verifiedCorporateSites)) {
    if (name.includes(key)) {
      return site;
    }
  }

  if (company.website && company.website.startsWith('http')) {
    return company.website;
  }

  if (company.website && !company.website.startsWith('http')) {
    return `https://${company.website}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent((company.name || '') + ' official corporate website India')}`;
}

