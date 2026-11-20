import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Award,
  Filter,
  User,
  MapPin,
  Save,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PortalBadge from '../components/common/PortalBadge';
import { timeAgo, formatSalary } from '../utils/formatters';
import { getPortalUrl } from '../utils/portalLinks';

export default function CandidateDashboard() {
  const { user, setUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Profile editing state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || 'Bengaluru',
    qualification: user?.qualification || 'Any Graduate',
    resumeUrl: user?.resumeUrl || '',
    skills: user?.skills?.join(', ') || ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/candidate/applications');
      if (res?.data) {
        // Only actual applied pipeline jobs should ever appear in candidate dashboard
        const confirmedApps = res.data.filter((a) => a.status !== 'VISITED');
        setApplications(confirmedApps);
      }
    } catch (err) {
      console.warn('Error fetching candidate applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    try {
      const res = await api.patch('/auth/profile', {
        ...profile,
        skills: profile.skills.split(',').map((s) => s.trim()).filter(Boolean)
      });
      if (res?.data) {
        setUser(res.data);
        localStorage.setItem('jobyatra_user', JSON.stringify(res.data));
        setProfileMsg('Profile updated successfully!');
        setTimeout(() => setShowProfileModal(false), 1200);
      }
    } catch (err) {
      setProfileMsg('Failed to update: ' + (err?.message || 'Try again'));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleConfirmApplied = async (appId) => {
    try {
      await api.patch(`/candidate/applications/${appId}/status`, { status: 'APPLIED' });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: 'APPLIED', appliedAt: new Date() } : a))
      );
    } catch (err) {
      console.warn('Failed to confirm application', err);
    }
  };

  const handleRemoveApplication = async (appId) => {
    try {
      await api.delete(`/candidate/applications/${appId}`);
      setApplications((prev) => prev.filter((a) => a._id !== appId));
    } catch (err) {
      console.warn('Failed to remove application', err);
    }
  };

  // Group applications into pipeline categories
  const appliedList = applications.filter((a) => a.status === 'APPLIED');
  const inProgressList = applications.filter((a) => a.status === 'IN_PROGRESS');
  const shortlistedList = applications.filter((a) => a.status === 'SHORTLISTED');
  const selectedList = applications.filter((a) => a.status === 'SELECTED');

  const filteredApplications = applications.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.status === selectedCategory;
  });

  const getStatusBadge = (status, portal = '') => {
    switch (status) {
      case 'SELECTED':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Selected / Offer
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            Shortlisted
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            In Progress / Review
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-600" />
            Applied
          </span>
        );
    }
  };

  return (
    <div className="bg-surface-offwhite min-h-screen py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Candidate Profile Banner */}
        <div className="bg-navy rounded-3xl p-8 shadow-card text-white mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-navy-800">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gold text-navy-950 font-extrabold flex items-center justify-center text-2xl shadow-sm">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.name}</h1>
                <span className="text-[10px] bg-gold text-navy-950 font-extrabold px-2 py-0.5 rounded uppercase">
                  Candidate
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {user?.qualification} • {user?.city} • {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileModal(true)}
              className="bg-navy-800 hover:bg-navy-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-navy-700 flex items-center gap-1.5 transition-colors"
            >
              <User className="w-4 h-4 text-gold" />
              <span>Edit Profile</span>
            </button>
            <Link
              to="/jobs"
              className="bg-gold hover:bg-gold-400 text-navy-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Explore More Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Pipeline Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory('APPLIED')}
            className={`p-5 rounded-2xl border transition-all text-left ${
              selectedCategory === 'APPLIED'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 1</span>
              <Briefcase className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-extrabold">{appliedList.length}</p>
            <p className="text-xs font-bold mt-0.5">Applied</p>
          </button>

          <button
            onClick={() => setSelectedCategory('IN_PROGRESS')}
            className={`p-5 rounded-2xl border transition-all text-left ${
              selectedCategory === 'IN_PROGRESS'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-200/80 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Step 2</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-extrabold">{inProgressList.length}</p>
            <p className="text-xs font-bold mt-0.5">In Progress</p>
          </button>

          <button
            onClick={() => setSelectedCategory('SHORTLISTED')}
            className={`p-5 rounded-2xl border transition-all text-left ${
              selectedCategory === 'SHORTLISTED'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-200/80 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Step 3</span>
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold">{shortlistedList.length}</p>
            <p className="text-xs font-bold mt-0.5">Shortlisted</p>
          </button>

          <button
            onClick={() => setSelectedCategory('SELECTED')}
            className={`p-5 rounded-2xl border transition-all text-left ${
              selectedCategory === 'SELECTED'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-200/80 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Milestone</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-extrabold">{selectedList.length}</p>
            <p className="text-xs font-bold mt-0.5">Selected</p>
          </button>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter Pipeline:
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-navy text-gold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Applied ({applications.length})
            </button>
            <button
              onClick={() => setSelectedCategory('APPLIED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'APPLIED'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Applied ({appliedList.length})
            </button>
            <button
              onClick={() => setSelectedCategory('IN_PROGRESS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'IN_PROGRESS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              In Progress ({inProgressList.length})
            </button>
            <button
              onClick={() => setSelectedCategory('SHORTLISTED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'SHORTLISTED'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Shortlisted ({shortlistedList.length})
            </button>
            <button
              onClick={() => setSelectedCategory('SELECTED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'SELECTED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Selected ({selectedList.length})
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredApplications.length}</strong> active applications
          </span>
        </div>

        {/* Applied Jobs List */}
        {loading ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-500">Loading your applications pipeline...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-card">
            <div className="w-16 h-16 bg-gold/15 text-gold-700 rounded-2xl flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-950">No Applications in this Category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't applied to any roles currently in this stage. Browse live openings across India to apply.
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-navy text-gold font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-navy-900 transition-colors"
            >
              Search Openings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const job = app.jobId || {};
              const portalUrl = getPortalUrl(job, app.appliedViaPortal);
              const isDirect = app.applyType === 'DIRECT';
              const isVisitedOnly = app.status === 'VISITED';

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl p-6 shadow-elevated border border-slate-100 hover:border-gold/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-navy-950 leading-snug">
                        {job.title || 'Untitled Opening'}
                      </h3>
                      {getStatusBadge(app.status, app.appliedViaPortal)}
                    </div>

                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                      <span className="font-bold text-slate-800">{job.companyName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold-700" />
                        {job.location?.city || 'India'}
                      </span>
                      <span>•</span>
                      <span className="bg-gold/15 text-navy-950 font-bold px-2 py-0.5 rounded">
                        {job.salaryDisplay || 'Competitive'}
                      </span>
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Application Route:</span>
                        <PortalBadge portal={app.appliedViaPortal} isDirect={isDirect} size="sm" />
                      </span>
                      <span>•</span>
                      <span>
                        Submitted {timeAgo(app.appliedAt)}
                      </span>
                    </div>

                    {app.coverNote && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-2xl mt-2">
                        "{app.coverNote}"
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-3 self-start md:self-center flex-wrap">
                    {/* Reopen Official Portal Application Page */}
                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gold hover:bg-gold-400 text-navy-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap"
                      title="Open official career page in new tab"
                    >
                      <span>{isDirect ? 'Reopen Official Careers Page' : `Reopen on ${app.appliedViaPortal}`}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleRemoveApplication(app._id)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                      title="Withdraw / Remove application from dashboard"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {job._id && (
                      <Link
                        to={`/jobs/${job._id}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors whitespace-nowrap"
                      >
                        View Job Specs
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy-950">Update Candidate Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            {profileMsg && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">City Hub</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Highest Qualification</label>
                <select
                  value={profile.qualification}
                  onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="10th Pass">10th Pass (Matric)</option>
                  <option value="12th / Inter">12th / Inter / Intermediate</option>
                  <option value="Diploma / ITI">Diploma / ITI</option>
                  <option value="Any Graduate">Any Graduate (B.Com / BA / B.Sc)</option>
                  <option value="B.Tech / B.E">B.Tech / B.E (Engineering)</option>
                  <option value="Post Graduate">Post Graduate (MBA / MCA / M.Tech)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={profile.skills}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Public Resume Link</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={profile.resumeUrl}
                  onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-navy text-gold font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
