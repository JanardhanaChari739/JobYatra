import React from 'react';
import {
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Layers,
  ExternalLink,
  Building2,
  CheckCircle2,
  Bookmark,
  Share2
} from 'lucide-react';
import PortalBadge from '../common/PortalBadge';
import QualificationBadge from '../common/QualificationBadge';
import { formatSalary, timeAgo } from '../../utils/formatters';
import { getPortalUrl } from '../../utils/portalLinks';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function JobDrawer({
  job,
  isOpen,
  onClose,
  onApply,
  onToggleSave,
  isSaved = false
}) {
  const { user, isAuthenticated } = useAuth();
  if (!isOpen || !job) return null;

  const directSource = job.sources?.find((s) => s.portal === 'Direct Company' || s.isDirect);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-left">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          {/* Top Bar */}
          <div className="px-6 py-4 bg-navy text-white flex items-center justify-between border-b border-navy-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gold-accent uppercase tracking-wider">
                Job Opportunity Specification
              </span>
              {job.sources && job.sources.length > 1 && (
                <span className="text-[10px] bg-navy-800 border border-gold/30 text-gold px-2 py-0.5 rounded-full font-bold">
                  {job.sources.length} Portals Merged
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave(job)}
                className={`p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition-colors ${
                  isSaved ? 'text-gold fill-gold' : ''
                }`}
                title="Save Job"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-gold text-gold' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Header Box */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-navy-950 leading-tight">
                    {job.title}
                  </h2>
                  <p className="text-base font-semibold text-slate-700 mt-1 flex items-center gap-2">
                    <span>{job.companyName}</span>
                    {job.companyId?.isVerified && (
                      <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                        ✓ Verified Employer
                      </span>
                    )}
                  </p>
                </div>

                <span className="bg-gold text-navy-950 font-extrabold text-sm px-4 py-1.5 rounded-lg whitespace-nowrap shadow-xs">
                  {job.salaryDisplay || formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-700" />
                    {job.location?.city}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-gold-700" />
                    {job.experienceMin || 0} - {job.experienceMax || 3} Yrs
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Job Type</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-gold-700" />
                    {job.jobType || 'Full-time'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Openings</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    {job.openingsCount || 1} Vacancies
                  </span>
                </div>
              </div>
            </div>

            {/* Multi-Portal Provenance Section with DIRECT 1-Click External Links */}
            <div className="bg-surface-offwhite rounded-2xl p-5 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gold-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950">
                    Unified Multi-Portal Application Routes
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Opens directly</span>
              </div>

              <div className="space-y-2">
                {job.sources?.map((s, idx) => {
                  const targetUrl = getPortalUrl(job, s.portal);
                  const isDirect = s.portal === 'Direct Company' || s.isDirect;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/60 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <PortalBadge portal={s.portal} isDirect={isDirect} />
                        <span className="text-xs text-slate-600 font-medium">
                          {isDirect ? 'Direct employer review' : `Cross-posted on ${s.portal}`}
                        </span>
                      </div>

                      {isDirect ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gold hover:bg-gold-400 text-navy-950 transition-colors flex items-center gap-1 shadow-xs"
                            title="Open official company careers page"
                          >
                            <span>Official Careers</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => onApply(job, s)}
                            className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-navy text-gold hover:bg-navy-900 transition-colors"
                          >
                            <span>ATS Form</span>
                          </button>
                        </div>
                      ) : (
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-gold hover:bg-gold-400 text-navy-950 transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Open on {s.portal}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Qualifications Accepted */}
            <div>
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-2.5">
                Eligibility & Qualifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.qualification?.map((q, idx) => (
                  <QualificationBadge key={idx} qualification={q} size="md" />
                ))}
              </div>
            </div>

            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-2.5">
                  Required Competencies & Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-2.5">
                Job Description & Scope
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {job.description}
              </div>
            </div>

          </div>

          {/* Drawer Footer CTA */}
          <div className="p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            {directSource ? (
              <>
                <a
                  href={getPortalUrl(job, 'Direct Company')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 w-full bg-gold hover:bg-gold-400 text-navy-950 font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-98 text-base flex items-center justify-center gap-2"
                  title="Open official company careers page in new tab"
                >
                  <span>Apply on Official Careers Page</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => onApply(job, directSource)}
                  className="w-full sm:w-auto bg-navy hover:bg-navy-900 text-gold font-bold py-3.5 px-5 rounded-xl transition-all shadow-md active:scale-98 text-sm"
                >
                  ATS Form
                </button>
              </>
            ) : (
              <a
                href={getPortalUrl(job, job.sources?.[0]?.portal)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 w-full bg-gold hover:bg-gold-400 text-navy-950 font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-98 text-base flex items-center justify-center gap-2 text-center"
              >
                <span>Apply on {job.sources?.[0]?.portal || 'Portal'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
