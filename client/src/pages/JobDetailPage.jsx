import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Briefcase,
  Layers,
  ExternalLink,
  Bookmark,
  Share2,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import PortalBadge from '../components/common/PortalBadge';
import QualificationBadge from '../components/common/QualificationBadge';
import ApplyModal from '../components/jobs/ApplyModal';
import { formatSalary, timeAgo } from '../utils/formatters';
import { getPortalUrl, getPortalMeta } from '../utils/portalLinks';
import { useAuth } from '../context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res?.data?.job) {
          setJob(res.data.job);
          setRelatedJobs(res.data.relatedJobs || []);
          if (user?.savedJobs) {
            setIsSaved(user.savedJobs.includes(res.data.job._id));
          }
        }
      } catch (err) {
        console.warn('Error fetching job details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login?redirect=save');
      return;
    }
    try {
      const res = await api.post(`/jobs/${job._id}/save`);
      setIsSaved(res?.data?.isSaved);
    } catch (err) {
      console.warn('Failed to save job', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading opening details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-navy-950 mb-2">Job Opening Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm">This position may have expired or been filled.</p>
        <Link to="/jobs" className="bg-navy text-gold px-6 py-2.5 rounded-xl font-bold text-sm">
          Browse All Openings
        </Link>
      </div>
    );
  }

  const directSource = job.sources?.find((s) => s.portal === 'Direct Company' || s.isDirect);

  return (
    <div className="bg-surface-offwhite min-h-screen py-10 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Jobs</span>
        </Link>

        {/* Main Job Card Container */}
        <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-200 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-gold/15 text-navy-950 font-bold px-2.5 py-0.5 rounded-full border border-gold/40">
                  {job.jobType || 'Full-time'}
                </span>
                {job.sources && job.sources.length > 1 && (
                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                    Cross-posted on {job.sources.length} portals
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-navy-950">{job.title}</h1>
              <p className="text-base font-semibold text-slate-600 mt-1">
                {job.companyName}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className="bg-gold text-navy-950 font-extrabold text-base px-4 py-2 rounded-xl shadow-xs">
                {job.salaryDisplay || formatSalary(job.salaryMin, job.salaryMax)}
              </span>
              <button
                onClick={handleToggleSave}
                className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-gold/15 border-gold text-navy-950'
                    : 'border-slate-200 text-slate-500 hover:text-navy'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-gold-500 text-gold-700' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save Job'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">City</span>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-gold-700" />
                {job.location?.city}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-gold-700" />
                {job.experienceMin}-{job.experienceMax} Years
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Openings</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                {job.openingsCount} Vacancies
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Posted</span>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                {timeAgo(job.postedAt)}
              </span>
            </div>
          </div>

          {/* Multi-portal Provenance Box with Direct 1-Click Platform Application Links */}
          <div className="bg-surface-offwhite rounded-2xl p-5 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-gold-700" />
              Available Application Gateways Across Job Portals
            </h3>
            <div className="space-y-2.5">
              {job.sources?.map((s, idx) => {
                const targetUrl = getPortalUrl(job, s.portal);
                const isDirect = s.portal === 'Direct Company' || s.isDirect;
                const meta = getPortalMeta(s.portal);

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <PortalBadge portal={s.portal} isDirect={isDirect} />
                      <span className="text-xs text-slate-600 font-medium">
                        {isDirect ? 'Direct review by company recruiter' : `Aggregated opening on ${s.portal}`}
                      </span>
                    </div>

                    {isDirect ? (
                      <button
                        onClick={() => {
                          setSelectedSource(s);
                          setApplyModalOpen(true);
                        }}
                        className="text-xs font-bold bg-navy hover:bg-navy-900 text-gold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Apply Direct</span>
                      </button>
                    ) : (
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold bg-gold hover:bg-gold-400 text-navy-950 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Apply on {s.portal}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Eligibility & Qualifications */}
          <div>
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-2">
              Eligibility & Qualifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.qualification?.map((q, idx) => (
                <QualificationBadge key={idx} qualification={q} size="md" />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-2">
              Detailed Role Description
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
              {job.description}
            </div>
          </div>

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-2">
                Required Technical & Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply CTA Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
            {directSource ? (
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={getPortalUrl(job, 'Direct Company')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 w-full bg-gold hover:bg-gold-400 text-navy-950 font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-98 text-base text-center flex items-center justify-center gap-2"
                  title="Open official company careers page in new tab"
                >
                  <span>Apply on Official Careers Page</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSource(directSource);
                    setApplyModalOpen(true);
                  }}
                  className="w-full sm:w-auto bg-navy hover:bg-navy-900 text-gold font-bold py-3.5 px-5 rounded-xl transition-all shadow-md active:scale-98 text-sm text-center"
                >
                  Submit ATS Form
                </button>
              </div>
            ) : (
              <a
                href={getPortalUrl(job, job.sources?.[0]?.portal)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gold hover:bg-gold-400 text-navy-950 font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-98 text-base text-center flex items-center justify-center gap-2"
              >
                <span>Apply on {job.sources?.[0]?.portal || 'Portal'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

      </div>

      <ApplyModal
        job={job}
        selectedSource={selectedSource}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}
