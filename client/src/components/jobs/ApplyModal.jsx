import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Send,
  ExternalLink,
  CheckCircle2,
  FileText,
  User,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import PortalBadge from '../common/PortalBadge';
import { getPortalUrl, getPortalMeta } from '../../utils/portalLinks';

export default function ApplyModal({
  job,
  selectedSource,
  isOpen,
  onClose,
  onSuccess
}) {
  const navigate = useNavigate();
  const { user, isAuthenticated, quickDemoLogin } = useAuth();
  
  // All hooks must be called unconditionally at top of component (Rules of Hooks)
  const [coverNote, setCoverNote] = useState('');
  const [candidateName, setCandidateName] = useState(user?.name || '');
  const [candidatePhone, setCandidatePhone] = useState(user?.phone || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [candidateQualification, setCandidateQualification] = useState(
    user?.qualification || 'Any Graduate'
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [redirectedPortal, setRedirectedPortal] = useState(null);
  const [activeMode, setActiveMode] = useState('direct');

  // Sync candidate fields when user logs in or updates
  useEffect(() => {
    if (user) {
      if (user.name) setCandidateName(user.name);
      if (user.phone) setCandidatePhone(user.phone);
      if (user.qualification) setCandidateQualification(user.qualification);
      if (user.resumeUrl) setResumeUrl(user.resumeUrl);
    }
  }, [user]);

  // Sync activeMode whenever modal opens or job/source changes
  useEffect(() => {
    if (selectedSource) {
      const isDirect = selectedSource.portal === 'Direct Company' || selectedSource.isDirect;
      setActiveMode(isDirect ? 'direct' : 'portals');
    } else if (job) {
      const isDirect = job.sources?.[0]?.portal === 'Direct Company' || job.sources?.[0]?.isDirect;
      setActiveMode(isDirect ? 'direct' : 'portals');
    }
    setSubmitted(false);
    setRedirectedPortal(null);
    setError('');
  }, [selectedSource, job, isOpen]);

  // Early return safely after all hooks
  if (!isOpen || !job) return null;

  const currentSource = selectedSource || job.sources?.[0] || {
    portal: 'Direct Company',
    isDirect: true
  };
  const hasDirect = job.sources?.some((s) => s.portal === 'Direct Company' || s.isDirect);
  const externalSources = job.sources?.filter((s) => s.portal !== 'Direct Company' && !s.isDirect) || [];

  const handleDirectSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=apply');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        appliedViaPortal: 'Direct Company',
        applyType: 'DIRECT',
        coverNote,
        candidateName: candidateName || user?.name,
        candidatePhone: candidatePhone || user?.phone,
        candidateQualification: candidateQualification || user?.qualification,
        resumeUrl: resumeUrl || user?.resumeUrl
      };

      await api.post(`/jobs/${job._id}/apply`, payload);
      setSubmitted(true);
      if (onSuccess) onSuccess(job);
    } catch (err) {
      setError(err?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExternalClick = (source) => {
    // Only open the external portal in a new window; do NOT automatically create an application!
    // Application is only created when the candidate explicitly clicks the Submit / Confirm button!
    setRedirectedPortal(source.portal);
  };

  const handleConfirmExternalSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=apply');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post(`/jobs/${job._id}/apply`, {
        appliedViaPortal: redirectedPortal,
        applyType: 'EXTERNAL_REDIRECT',
        status: 'APPLIED',
        candidateName: candidateName || user?.name,
        candidateEmail: user?.email,
        candidatePhone: candidatePhone || user?.phone,
        candidateQualification: candidateQualification || user?.qualification
      });
      setSubmitted(true);
      if (onSuccess) onSuccess(job);
    } catch (err) {
      setError(err?.message || 'Failed to record application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-xs text-left animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-navy p-5 text-white flex items-center justify-between border-b border-navy-800">
          <div>
            <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider block">
              Application Gateway
            </span>
            <h3 className="text-lg font-bold text-white truncate max-w-sm mt-0.5">
              {job.title}
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {job.companyName} • {job.location?.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between Direct Apply and External Portals if both exist */}
        {hasDirect && externalSources.length > 0 && !submitted && !redirectedPortal && (
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveMode('portals')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeMode === 'portals'
                  ? 'bg-white text-navy-950 shadow-xs'
                  : 'text-slate-500 hover:text-navy'
              }`}
            >
              Apply via Portals ({externalSources.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('direct')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeMode === 'direct'
                  ? 'bg-gold text-navy-950 shadow-xs'
                  : 'text-slate-500 hover:text-navy'
              }`}
            >
              Direct ATS Form
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-navy-950">Application Dispatched!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your direct application has been submitted to the hiring team at{' '}
                <strong>{job.companyName}</strong>. You can track this in your candidate dashboard.
              </p>
              <button
                onClick={onClose}
                className="mt-4 bg-navy text-gold font-bold px-6 py-2.5 rounded-xl hover:bg-navy-900 transition-colors text-sm"
              >
                Done
              </button>
            </div>
          ) : redirectedPortal ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <ExternalLink className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-navy-950">
                Opening {redirectedPortal}...
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                We have opened the official job opening on <strong>{redirectedPortal}</strong> in a new tab.
              </p>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 max-w-sm mx-auto space-y-3">
                <p className="font-semibold text-slate-800">
                  Did you complete your application on {redirectedPortal}?
                </p>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirmExternalSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Application to My Dashboard'}</span>
                </button>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={getPortalUrl(job, redirectedPortal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold text-navy-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-gold-400 transition-colors"
                >
                  Reopen {redirectedPortal} ↗
                </a>
                <button
                  onClick={onClose}
                  className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-200 transition-colors"
                >
                  Close (Don't Track)
                </button>
              </div>
            </div>
          ) : activeMode === 'direct' ? (
            /* Direct Application Form */
            <form onSubmit={handleDirectSubmit} className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200/80 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <PortalBadge portal="Direct Company" size="sm" isDirect={true} />
                  <span className="text-xs font-semibold text-amber-900">
                    Direct Employer ATS Channel
                  </span>
                </div>
                <span className="text-[11px] text-amber-700 font-bold">Fastest Review</span>
              </div>

              {!isAuthenticated && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-slate-600">Want to pre-fill your saved details?</span>
                  <button
                    type="button"
                    onClick={() => quickDemoLogin('CANDIDATE')}
                    className="text-xs font-bold text-navy bg-gold/30 hover:bg-gold/50 px-2.5 py-1 rounded-lg"
                  >
                    1-Click Auto Fill
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={candidateName || user?.name || ''}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={candidatePhone || user?.phone || ''}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Highest Qualification</label>
                <select
                  value={candidateQualification}
                  onChange={(e) => setCandidateQualification(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold bg-white"
                >
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th / Inter">12th / Inter</option>
                  <option value="Diploma / ITI">Diploma / ITI</option>
                  <option value="Any Graduate">Any Graduate (B.Com / BA / B.Sc)</option>
                  <option value="B.Tech / B.E">B.Tech / B.E / BCA</option>
                  <option value="Post Graduate">Post Graduate (MBA / MCA / M.Tech)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Resume Link (PDF / Google Drive URL)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={resumeUrl || user?.resumeUrl || ''}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Cover Note / Pitch to Recruiter (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why you are an ideal fit for this role..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-400 text-navy-950 font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Direct Application'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* External Portal Redirect List with High-Contrast Direct Anchor Links */
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                Choose which job portal you want to apply through. Clicking any platform opens its official application page directly in a new tab:
              </div>

              <div className="space-y-2.5">
                {(externalSources.length > 0 ? externalSources : job.sources)?.map((s, idx) => {
                  const targetUrl = getPortalUrl(job, s.portal);
                  const meta = getPortalMeta(s.portal);

                  return (
                    <a
                      key={idx}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleExternalClick(s)}
                      className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 hover:border-gold/60 rounded-2xl border border-slate-200 transition-all shadow-xs group"
                    >
                      <div className="flex items-center gap-3">
                        <PortalBadge portal={s.portal} isDirect={s.isDirect} />
                        <div>
                          <span className="text-xs font-bold text-navy-950 group-hover:text-gold-700 transition-colors block">
                            {meta.tagline}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Opens verified job search/listing
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-gold-700 bg-gold/15 px-3 py-1.5 rounded-xl flex items-center gap-1 group-hover:bg-gold group-hover:text-navy-950 transition-colors">
                        Apply Now <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </a>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-2">
                Opens directly in a new window. Guaranteed 0 popup blocks.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
