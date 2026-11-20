import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowUpDown,
  Briefcase
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import JobDrawer from '../components/jobs/JobDrawer';
import ApplyModal from '../components/jobs/ApplyModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function JobsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [facets, setFacets] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [savedJobIds, setSavedJobIds] = useState(new Set(user?.savedJobs || []));

  // Current filter state from URL params
  const currentFilters = {
    q: searchParams.get('q') || '',
    qualification: searchParams.get('qualification') || 'all',
    portalSource: searchParams.get('portalSource') || 'all',
    city: searchParams.get('city') || 'all',
    jobType: searchParams.get('jobType') || 'all',
    salaryMin: searchParams.get('salaryMin') || '',
    isRemote: searchParams.get('isRemote') || '',
    sort: searchParams.get('sort') || 'latest',
    page: searchParams.get('page') || '1'
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs', { params: currentFilters });
      if (res?.data) {
        setJobs(res.data.jobs || []);
        setPagination(res.data.pagination || { total: 0, page: 1, totalPages: 1 });
        setFacets(res.data.facets || {});
      }
    } catch (err) {
      console.warn('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'All' || value === '') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    // Only reset to page 1 on search or facet filter change, NEVER when changing pages
    if (key !== 'page') {
      nextParams.set('page', '1');
    }
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage) => {
    const pageTarget = Math.max(1, Math.min(newPage, pagination.totalPages || 1));
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(pageTarget));
    setSearchParams(nextParams);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

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

  return (
    <div className="bg-surface-offwhite min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Search Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-200/80 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="w-full md:flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by role, company, skills, or portal keyword..."
                value={currentFilters.q}
                onChange={(e) => updateFilter('q', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Controls: Sorting + Mobile Filter Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-navy font-bold rounded-xl text-xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={currentFilters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy-950 focus:outline-none cursor-pointer"
                >
                  <option value="latest">Latest Ingested</option>
                  <option value="salary_high">Highest Salary (INR LPA)</option>
                  <option value="openings_high">Maximum Openings</option>
                </select>
              </div>

            </div>

          </div>
        </div>

        {/* Main Content: Left Filter Sidebar + Right Job Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28">
            <JobFilters
              filters={currentFilters}
              onChange={updateFilter}
              onReset={handleResetFilters}
              facets={facets}
              totalCount={pagination.total}
            />
          </aside>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-navy-950/70 p-4 flex items-center justify-center lg:hidden">
              <div className="bg-white rounded-2xl p-6 max-h-[85vh] overflow-y-auto w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-navy-950 text-base">Filter Opportunities</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-slate-400 text-sm font-bold"
                  >
                    Close ✕
                  </button>
                </div>
                <JobFilters
                  filters={currentFilters}
                  onChange={(k, v) => {
                    updateFilter(k, v);
                    setMobileFilterOpen(false);
                  }}
                  onReset={() => {
                    handleResetFilters();
                    setMobileFilterOpen(false);
                  }}
                  facets={facets}
                  totalCount={pagination.total}
                />
              </div>
            </div>
          )}

          {/* Right Results Grid */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Result Counter & Active Filter Pills */}
            <div className="flex items-center justify-between text-left">
              <div>
                <h1 className="text-xl font-bold text-navy-950">
                  {loading ? 'Finding matching opportunities...' : `${pagination.total} Openings Available`}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregated and deduplicated across 6+ portals in real-time
                </p>
              </div>

              {pagination.total > 0 && (
                <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium hidden sm:inline-block">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              )}
            </div>

            {/* Job Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse space-y-4">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                    <div className="h-10 bg-slate-200 rounded-xl mt-4"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-gold/15 text-gold-700 rounded-2xl flex items-center justify-center mx-auto">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-950">No Openings Match Your Current Filters</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try clearing some filter criteria such as qualification or city, or search for broader roles.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-navy text-gold font-bold px-6 py-2.5 rounded-xl hover:bg-navy-900 transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-8 pb-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-xs"
                >
                  ← Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      pagination.page === p
                        ? 'bg-navy text-gold font-extrabold ring-2 ring-gold/40 shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-xs"
                >
                  Next →
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Slide-over Detail Drawer */}
      <JobDrawer
        job={selectedJob}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={(j, source) => {
          setDrawerOpen(false);
          setSelectedJob(j);
          setSelectedSource(source);
          setApplyModalOpen(true);
        }}
        onToggleSave={handleToggleSave}
        isSaved={selectedJob ? savedJobIds.has(selectedJob._id) : false}
      />

      {/* Application Gateway Modal */}
      <ApplyModal
        job={selectedJob}
        selectedSource={selectedSource}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}
