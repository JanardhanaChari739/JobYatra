import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, MapPin, Briefcase, CheckCircle2, ArrowRight, Globe, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { getCompanyWebsite } from '../utils/portalLinks';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await api.get('/companies', {
          params: {
            search: search.trim() || undefined,
            industry: industry !== 'all' ? industry : undefined
          }
        });
        if (res?.data) {
          setCompanies(res.data);
        }
      } catch (err) {
        console.warn('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [search, industry]);

  const industries = [
    'all',
    'Information Technology',
    'E-commerce & Logistics',
    'Fintech & Banking',
    'Manufacturing & Engineering'
  ];

  return (
    <div className="bg-surface-offwhite min-h-screen py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-700 bg-gold/15 px-3 py-1 rounded-full border border-gold/30">
            Employer Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-2">
            Verified Indian Employers & Enterprises
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Explore company profiles and discover all active openings aggregated across LinkedIn, Naukri, Indeed, and direct career portals.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company name (e.g. Swiggy, Razorpay, Tata Motors)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline">Industry:</span>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy-950 focus:outline-none cursor-pointer w-full md:w-auto"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === 'all' ? 'All Industries' : ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse space-y-4">
                <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
                <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-950">No Companies Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try modifying your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <Link
                key={comp._id}
                to={`/companies/${comp.slug}`}
                className="bg-white rounded-2xl p-6 shadow-elevated border border-slate-100 hover:border-gold/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-navy text-gold font-extrabold flex items-center justify-center text-lg flex-shrink-0">
                      {comp.name.charAt(0)}
                    </div>
                    {comp.isVerified && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        Verified Employer
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-navy-950 group-hover:text-gold-700 transition-colors">
                    {comp.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{comp.industry}</p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-3">
                    <MapPin className="w-3.5 h-3.5 text-gold-700" />
                    <span>{comp.headquarters || 'India'}</span>
                  </div>

                  {/* Direct Website Link Button */}
                  <div className="mt-3.5">
                    <a
                      href={getCompanyWebsite(comp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-gold hover:text-navy-950 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-xs"
                      title={`Open official website of ${comp.name} in new tab`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Official Website</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {comp.activeJobsCount || 1} Openings
                    </span>
                    <span className="text-[11px] text-slate-400">across portals</span>
                  </div>

                  <span className="text-xs font-bold text-navy group-hover:text-gold-700 flex items-center gap-1">
                    View Jobs <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
