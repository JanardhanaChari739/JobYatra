import React from 'react';
import { Filter, RotateCcw, Check, Sparkles, Building2, MapPin } from 'lucide-react';

export default function JobFilters({
  filters,
  onChange,
  onReset,
  facets = {},
  totalCount = 0
}) {
  const qualifications = [
    { label: 'All Qualifications', value: 'all' },
    { label: '10th Pass (Matric)', value: '10th Pass' },
    { label: '12th / Inter / PUC', value: '12th / Inter' },
    { label: 'Diploma / ITI', value: 'Diploma / ITI' },
    { label: 'Any Graduate', value: 'Any Graduate' },
    { label: 'B.Tech / B.E', value: 'B.Tech / B.E' },
    { label: 'Post Graduate (MBA / MCA)', value: 'Post Graduate' }
  ];

  const portals = [
    { label: 'All Portals', value: 'all' },
    { label: 'Direct Company ATS', value: 'Direct Company' },
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'Naukri', value: 'Naukri' },
    { label: 'Indeed', value: 'Indeed' },
    { label: 'Apna', value: 'Apna' },
    { label: 'Govt NCS', value: 'Govt NCS' },
    { label: 'Foundit (Monster)', value: 'Foundit' },
    { label: 'Glassdoor', value: 'Glassdoor' },
    { label: 'Internshala', value: 'Internshala' },
    { label: 'Unstop', value: 'Unstop' }
  ];

  const cities = [
    'All',
    'Bengaluru',
    'Hyderabad',
    'Mumbai',
    'Pune',
    'Chennai',
    'Delhi NCR'
  ];

  const jobTypes = ['All', 'Full-time', 'Internship', 'Contract', 'Part-time'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-200/80 text-left space-y-6">
      
      {/* Top Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gold-700" />
          <h2 className="font-bold text-navy-950 text-base">Filter Opportunities</h2>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-navy flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Qualification Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Candidate Qualification
        </label>
        <div className="space-y-1.5">
          {qualifications.map((q) => {
            const isSelected = (filters.qualification || 'all') === q.value;
            return (
              <button
                key={q.value}
                onClick={() => onChange('qualification', q.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-navy text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{q.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Portal Provenance Filter */}
      <div className="pt-4 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Aggregated Source Portal
        </label>
        <div className="space-y-1.5">
          {portals.map((p) => {
            const isSelected = (filters.portalSource || 'all') === p.value;
            return (
              <button
                key={p.value}
                onClick={() => onChange('portalSource', p.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-gold text-navy-950 font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{p.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-navy-950" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Location / City Filter */}
      <div className="pt-4 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Indian Tech & Commercial Hub
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {cities.map((city) => {
            const isSelected =
              (filters.city || 'All').toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                onClick={() => onChange('city', city === 'All' ? 'all' : city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                  isSelected
                    ? 'bg-navy text-gold font-bold border-navy shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Remote Toggle */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label htmlFor="remoteToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
            Remote & Work From Home
          </label>
          <input
            id="remoteToggle"
            type="checkbox"
            checked={filters.isRemote === 'true' || filters.isRemote === true}
            onChange={(e) => onChange('isRemote', e.target.checked ? 'true' : '')}
            className="w-4 h-4 rounded text-gold focus:ring-gold border-slate-300 cursor-pointer accent-[#E5A852]"
          />
        </div>
      </div>

      {/* 5. Minimum Salary Filter */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Min Salary (Annual)
          </label>
          <span className="text-xs font-bold text-navy-900">
            {filters.salaryMin > 0 ? `₹${(filters.salaryMin / 100000).toFixed(0)} LPA+` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="3000000"
          step="100000"
          value={filters.salaryMin || 0}
          onChange={(e) => onChange('salaryMin', e.target.value)}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E5A852]"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>₹0</span>
          <span>₹10 LPA</span>
          <span>₹20 LPA</span>
          <span>₹30 LPA+</span>
        </div>
      </div>

      {/* 6. Job Type */}
      <div className="pt-4 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Employment Nature
        </label>
        <div className="flex flex-wrap gap-1.5">
          {jobTypes.map((t) => {
            const isSelected = (filters.jobType || 'All').toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => onChange('jobType', t === 'All' ? 'all' : t)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-navy text-white font-bold border-navy'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
