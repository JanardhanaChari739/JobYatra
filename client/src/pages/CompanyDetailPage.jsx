import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Globe, CheckCircle2, ArrowLeft, Briefcase, ExternalLink } from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/jobs/JobCard';
import JobDrawer from '../components/jobs/JobDrawer';
import ApplyModal from '../components/jobs/ApplyModal';
import { useAuth } from '../context/AuthContext';
import { getCompanyWebsite } from '../utils/portalLinks';

export default function CompanyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalOpenings: 0 });
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState(new Set(user?.savedJobs || []));

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies/${slug}/jobs`);
        if (res?.data) {
          setCompany(res.data.company);
          setJobs(res.data.jobs || []);
          setStats(res.data.stats || { totalJobs: 0, totalOpenings: 0 });
        }
      } catch (err) {
        console.warn('Error fetching company details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleToggleSave = async (job) => {
    if (!user) {
      navigate('/login?redirect=save');
      return;
    }
    try {
      const res = await api.post(`/jobs/${job._id}/save`);
      const nextSaved = new Set(savedJobIds);
      if (res?.data?.isSaved) {
        nextSaved.add(job._id);
      } else {
        nextSaved.delete(job._id);
      }
      setSavedJobIds(nextSaved);
    } catch (err) {
      console.warn('Failed to save job', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading company profile...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-navy-950 mb-2">Company Not Found</h2>
        <Link to="/companies" className="bg-navy text-gold px-6 py-2.5 rounded-xl font-bold text-sm">
          Browse Companies Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-offwhite min-h-screen py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Companies</span>
        </Link>

        {/* Company Overview Banner */}
        <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-200 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-navy text-gold font-extrabold flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
              {company.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                  {company.name}
                </h1>
                {company.isVerified && (
                  <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Verified Employer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-2 flex-wrap">
                <span>{company.industry}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gold-700" />
                  {company.headquarters || 'India'}
                </span>
                <span>•</span>
                <a
                  href={getCompanyWebsite(company)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold hover:bg-gold-400 text-navy-950 px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all shadow-xs"
                  title={`Open official corporate website of ${company.name}`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Official Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-surface-cream px-6 py-4 rounded-2xl border border-gold/30 text-center self-stretch sm:self-auto flex sm:flex-col justify-around">
            <div>
              <span className="text-2xl font-extrabold text-navy-950 block">
                {stats.totalJobs}
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Live Openings
              </span>
            </div>
            <div className="sm:mt-2">
              <span className="text-sm font-bold text-emerald-700 block">
                {stats.totalOpenings} Vacancies
              </span>
            </div>
          </div>
        </div>

        {/* Company Jobs Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-navy-950">
              Active Openings at {company.name} Across All Portals
            </h2>
            <span className="text-xs text-slate-500">
              Aggregated from LinkedIn, Naukri, Indeed & Direct ATS
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <p className="text-slate-500 text-sm">No active job openings currently listed for this company.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onSelect={(j) => {
                    setSelectedJob(j);
                    setDrawerOpen(true);
                  }}
                  onApply={(j, source) => {
                    setSelectedJob(j);
                    setSelectedSource(source);
                    setApplyModalOpen(true);
                  }}
                  onToggleSave={handleToggleSave}
                  isSaved={savedJobIds.has(job._id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      <JobDrawer
        job={selectedJob}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={(j, s) => {
          setDrawerOpen(false);
          setSelectedJob(j);
          setSelectedSource(s);
          setApplyModalOpen(true);
        }}
        onToggleSave={handleToggleSave}
        isSaved={selectedJob ? savedJobIds.has(selectedJob._id) : false}
      />

      <ApplyModal
        job={selectedJob}
        selectedSource={selectedSource}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}
