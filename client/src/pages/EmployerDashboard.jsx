import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatSalary, timeAgo } from '../utils/formatters';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'postings';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post Job form state
  const [newJob, setNewJob] = useState({
    title: '',
    companyName: user?.name ? `${user.name.split(' ')[0]} Technologies` : 'Direct Employer',
    qualification: ['B.Tech / B.E'],
    experienceMin: 1,
    experienceMax: 4,
    salaryMin: 800000,
    salaryMax: 1500000,
    city: 'Bengaluru',
    state: 'Karnataka',
    isRemote: false,
    jobType: 'Full-time',
    openingsCount: 2,
    skills: 'React, Node.js, Problem Solving',
    description: ''
  });
  const [postLoading, setPostLoading] = useState(false);
  const [postMessage, setPostMessage] = useState({ type: '', text: '' });

  const fetchEmployerJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employer/jobs');
      if (res?.data) {
        setJobs(res.data);
        if (res.data.length > 0 && !selectedJobId) {
          setSelectedJobId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.warn('Error fetching employer jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    if (!jobId) return;
    try {
      const res = await api.get(`/employer/jobs/${jobId}/applicants`);
      if (res?.data?.applicants) {
        setApplicants(res.data.applicants);
      }
    } catch (err) {
      console.warn('Error fetching applicants', err);
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
    }
  }, [selectedJobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/employer/applications/${appId}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert('Failed to update applicant status: ' + (err?.message || 'Try again'));
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostLoading(true);
    setPostMessage({ type: '', text: '' });

    try {
      const payload = {
        ...newJob,
        experienceMin: Number(newJob.experienceMin),
        experienceMax: Number(newJob.experienceMax),
        salaryMin: Number(newJob.salaryMin),
        salaryMax: Number(newJob.salaryMax),
        openingsCount: Number(newJob.openingsCount),
        skills: newJob.skills.split(',').map((s) => s.trim()).filter(Boolean)
      };

      const res = await api.post('/jobs', payload);
      setPostMessage({ type: 'success', text: 'Job opening posted successfully to JobYatra network!' });
      fetchEmployerJobs();
      setNewJob({
        title: '',
        companyName: newJob.companyName,
        qualification: ['Any Graduate'],
        experienceMin: 0,
        experienceMax: 3,
        salaryMin: 500000,
        salaryMax: 1000000,
        city: 'Bengaluru',
        state: 'Karnataka',
        isRemote: false,
        jobType: 'Full-time',
        openingsCount: 1,
        skills: '',
        description: ''
      });
    } catch (err) {
      setPostMessage({ type: 'error', text: err?.message || 'Failed to post opening.' });
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className="bg-surface-offwhite min-h-screen py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Employer Banner */}
        <div className="bg-navy rounded-3xl p-8 shadow-card text-white mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gold text-navy-950 font-extrabold flex items-center justify-center text-2xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold">{user?.name}</h1>
                <span className="text-[10px] bg-gold text-navy-950 font-bold px-2 py-0.5 rounded uppercase">
                  Verified Employer
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Employer ATS Direct Hiring Gateway • JobYatra Verified Partner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchParams({ tab: 'post' })}
              className="bg-gold hover:bg-gold-400 text-navy-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Opening</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8">
          <button
            onClick={() => setSearchParams({ tab: 'postings' })}
            className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'postings'
                ? 'border-gold text-navy-950'
                : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Active Postings ({jobs.length})</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'pipeline' })}
            className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'pipeline'
                ? 'border-gold text-navy-950'
                : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applicant Pipeline</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'post' })}
            className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'post'
                ? 'border-gold text-navy-950'
                : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Job</span>
          </button>
        </div>

        {/* Tab 1: Active Postings Table */}
        {activeTab === 'postings' && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-navy-950 text-base">Your Active Job Postings</h2>
                <p className="text-xs text-slate-500">Candidate applications arrive in real time</p>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-navy-950">No Openings Posted Yet</h3>
                <p className="text-xs text-slate-500">Post your first job opening to start receiving candidates.</p>
                <button
                  onClick={() => setSearchParams({ tab: 'post' })}
                  className="bg-navy text-gold font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Post Job Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Job Role</th>
                      <th className="px-6 py-4">City</th>
                      <th className="px-6 py-4">Salary Package</th>
                      <th className="px-6 py-4">Openings</th>
                      <th className="px-6 py-4">Applicants</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {jobs.map((j) => (
                      <tr key={j._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-navy-950 text-sm">{j.title}</p>
                          <span className="text-[10px] text-slate-400">Posted {timeAgo(j.postedAt)}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{j.location?.city}</td>
                        <td className="px-6 py-4">
                          <span className="bg-gold/15 text-navy-950 font-bold px-2.5 py-0.5 rounded">
                            {j.salaryDisplay}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-700">{j.openingsCount}</td>
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-navy-950 text-sm">
                            {j.applicantCount || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => {
                              setSelectedJobId(j._id);
                              setSearchParams({ tab: 'pipeline' });
                            }}
                            className="bg-navy text-gold font-bold px-3 py-1.5 rounded-lg hover:bg-navy-900 transition-colors"
                          >
                            Review Applicants
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Applicant Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Job Selector Dropdown */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600">Select Job to View Candidates:</label>
              <select
                value={selectedJobId || ''}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-navy-950 focus:outline-none cursor-pointer"
              >
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title} ({j.location?.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Applicants List */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6">
              <h2 className="text-base font-bold text-navy-950 mb-4">
                Applicants Pipeline ({applicants.length})
              </h2>

              {applicants.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No applications received yet for this position.
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((app) => (
                    <div
                      key={app._id}
                      className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gold text-navy-950 font-bold flex items-center justify-center text-sm">
                            {app.candidateName?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <h3 className="font-bold text-navy-950 text-sm">{app.candidateName}</h3>
                            <p className="text-xs text-slate-500">
                              {app.candidateEmail} • {app.candidatePhone} • {app.candidateQualification}
                            </p>
                          </div>
                        </div>

                        {app.coverNote && (
                          <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80 mt-3 max-w-xl">
                            <strong>Note:</strong> {app.coverNote}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
                          <span>Via: <strong>{app.appliedViaPortal}</strong></span>
                          <span>•</span>
                          <span>Applied {timeAgo(app.appliedAt)}</span>
                          {app.resumeUrl && (
                            <>
                              <span>•</span>
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-navy font-bold hover:underline flex items-center gap-1"
                              >
                                Resume Document <ExternalLink className="w-3 h-3" />
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status Management Dropdown */}
                      <div className="flex items-center gap-2 self-start md:self-center">
                        <span className="text-xs font-bold text-slate-500">Status:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-navy-950 focus:outline-none cursor-pointer"
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Post New Job Opening */}
        {activeTab === 'post' && (
          <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-200 max-w-3xl">
            <h2 className="text-lg font-bold text-navy-950 mb-2">Create Direct Opening (ATS)</h2>
            <p className="text-xs text-slate-500 mb-6">
              Published directly to candidates on JobYatra with instant SHA-256 deduplication and verification.
            </p>

            {postMessage.text && (
              <div
                className={`p-3 rounded-xl text-xs font-bold mb-4 ${
                  postMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {postMessage.text}
              </div>
            )}

            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Frontend Architect"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newJob.companyName}
                    onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">City Hub</label>
                  <input
                    type="text"
                    required
                    value={newJob.city}
                    onChange={(e) => setNewJob({ ...newJob, city: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Employment Type</label>
                  <select
                    value={newJob.jobType}
                    onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-gold bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Min Exp (Yrs)</label>
                  <input
                    type="number"
                    min="0"
                    value={newJob.experienceMin}
                    onChange={(e) => setNewJob({ ...newJob, experienceMin: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Max Exp (Yrs)</label>
                  <input
                    type="number"
                    min="0"
                    value={newJob.experienceMax}
                    onChange={(e) => setNewJob({ ...newJob, experienceMax: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Min Salary (INR)</label>
                  <input
                    type="number"
                    step="50000"
                    value={newJob.salaryMin}
                    onChange={(e) => setNewJob({ ...newJob, salaryMin: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Max Salary (INR)</label>
                  <input
                    type="number"
                    step="50000"
                    value={newJob.salaryMax}
                    onChange={(e) => setNewJob({ ...newJob, salaryMax: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Required Qualification Bucket
                </label>
                <select
                  value={newJob.qualification[0]}
                  onChange={(e) => setNewJob({ ...newJob, qualification: [e.target.value] })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th / Inter">12th / Inter</option>
                  <option value="Diploma / ITI">Diploma / ITI</option>
                  <option value="Any Graduate">Any Graduate</option>
                  <option value="B.Tech / B.E">B.Tech / B.E</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, GraphQL, Node.js"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Job Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline responsibilities, day-to-day work, and benefits..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={postLoading}
                  className="bg-navy hover:bg-navy-900 text-gold font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{postLoading ? 'Publishing...' : 'Publish Opening Now'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
