import React from 'react';
import { Settings, ShoppingBag, Briefcase, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import PortalBadge from '../common/PortalBadge';
import { getPortalUrl } from '../../utils/portalLinks';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function FeaturedOpportunities({ jobs = [], onSelectJob, onApply }) {
  const { user, isAuthenticated } = useAuth();

  // Reference jobs matching the exact design
  const defaultFeatured = [
    {
      _id: 'featured-operations',
      title: 'Operations Executive',
      companyName: 'Zomato Logistics Ltd',
      location: { city: 'Hyderabad', state: 'Telangana' },
      qualification: ['Any Graduate'],
      jobType: 'Full-time',
      category: 'Any Graduate',
      salaryDisplay: 'INR 3.5-5 LPA',
      portal: 'Naukri',
      icon: Settings,
      sources: [
        {
          portal: 'Naukri',
          url: 'https://www.naukri.com/jobs-in-india?k=Operations%20Executive%20Zomato&cityTypeGid=Hyderabad',
          isDirect: false
        }
      ]
    },
    {
      _id: 'featured-data',
      title: 'Data Analyst',
      companyName: 'Meesho Technologies',
      location: { city: 'Mumbai', state: 'Maharashtra' },
      qualification: ['Any Graduate', 'B.Tech / B.E'],
      jobType: 'Full-time',
      industryTag: 'E-commerce',
      salaryDisplay: 'INR 12-16 LPA',
      portal: 'LinkedIn',
      icon: ShoppingBag,
      sources: [
        {
          portal: 'LinkedIn',
          url: 'https://www.linkedin.com/jobs/search/?keywords=Data%20Analyst%20Meesho&location=Mumbai',
          isDirect: false
        }
      ]
    },
    {
      _id: 'featured-product',
      title: 'Product Manager',
      companyName: 'Razorpay Software',
      location: { city: 'Bengaluru', state: 'Karnataka' },
      qualification: ['Post Graduate', 'B.Tech / B.E'],
      jobType: 'Full-time',
      industryTag: 'Fintech',
      salaryDisplay: 'INR 20-28 LPA',
      portal: 'Direct Company',
      icon: Briefcase,
      sources: [
        {
          portal: 'Direct Company',
          url: 'https://razorpay.com/jobs',
          isDirect: true
        },
        {
          portal: 'LinkedIn',
          url: 'https://www.linkedin.com/jobs/search/?keywords=Product%20Manager%20Razorpay&location=Bengaluru',
          isDirect: false
        }
      ]
    }
  ];

  // Try to match database jobs with these exact reference titles first
  const displayJobs = defaultFeatured.map((def) => {
    const matched = jobs.find((j) =>
      j.title?.toLowerCase().includes(def.title.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(def.companyName.toLowerCase().split(' ')[0])
    );
    if (matched) {
      return {
        ...matched,
        icon: def.icon,
        industryTag: def.industryTag,
        salaryDisplay: def.salaryDisplay || matched.salaryDisplay
      };
    }
    return def;
  });

  return (
    <section className="bg-surface-cream py-16 sm:py-20 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching exact style */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Featured Opportunities
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Hand-picked verified openings with direct employer applications and multi-portal options.
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayJobs.map((job, idx) => {
            const Icon = job.icon || Briefcase;
            const primaryPortal = job.sources?.[0]?.portal || job.portal || 'Direct Company';
            const isDirect = primaryPortal === 'Direct Company' || job.sources?.[0]?.isDirect;
            const externalUrl = getPortalUrl(job, primaryPortal);

            return (
              <div
                key={job._id || idx}
                onClick={() => onSelectJob && onSelectJob(job)}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-elevated border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-gold/40 text-left group cursor-pointer"
              >
                <div>
                  {/* Top Header: Icon + Title */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold-700 flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:text-navy-950 transition-colors">
                      <Icon className="w-6 h-6 text-[#A16207] group-hover:text-navy-950 transition-colors" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-navy-950 truncate leading-snug group-hover:text-navy-700 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">
                        {job.companyName}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Row: City • Qualification / Industry • JobType */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium my-3 flex-wrap">
                    <span className="flex items-center text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                      {job.location?.city || 'Bengaluru'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>
                      {job.industryTag || (job.qualification && job.qualification[0]) || 'Any Graduate'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{job.jobType || 'Full-time'}</span>
                  </div>

                  {/* Badges Row: Salary Badge + Portal Badge */}
                  <div className="flex items-center gap-2.5 my-4 flex-wrap">
                    <span className="inline-flex items-center bg-gold text-navy-950 font-bold text-xs px-3 py-1 rounded-md shadow-xs">
                      {job.salaryDisplay || 'INR 10-15 LPA'}
                    </span>

                    <PortalBadge portal={primaryPortal} isDirect={isDirect} size="sm" />

                    {job.sources && job.sources.length > 1 && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                        +{job.sources.length - 1} portals
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom CTA: Direct Native Link to Official Careers Page or Via Platform */}
                <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gold hover:bg-gold-400 text-navy-950 font-bold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-gold active:scale-98 flex items-center justify-center gap-2 text-sm text-center"
                    title={isDirect ? 'Open official company careers page in new tab' : `Apply directly on ${primaryPortal}`}
                  >
                    <span>{isDirect ? 'Apply Direct (Official Careers)' : `Apply on ${primaryPortal}`}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-navy-950" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
