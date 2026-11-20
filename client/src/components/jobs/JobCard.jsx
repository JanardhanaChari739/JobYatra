import React, { useState } from 'react';
import {
  MapPin,
  Bookmark,
  ExternalLink,
  CheckCircle,
  Briefcase,
  Settings,
  ShoppingBag,
  Layers,
  ChevronDown
} from 'lucide-react';
import PortalBadge from '../common/PortalBadge';
import QualificationBadge from '../common/QualificationBadge';
import { formatSalary, timeAgo } from '../../utils/formatters';
import { getPortalUrl, getPortalMeta } from '../../utils/portalLinks';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function JobCard({
  job,
  onSelect,
  onApply,
  onToggleSave,
  isSaved = false
}) {
  const { user, isAuthenticated } = useAuth();
  const [sourcesDropdown, setSourcesDropdown] = useState(false);

  const getIcon = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('operation') || t.includes('technician') || t.includes('engineer') || t.includes('maint')) {
      return Settings;
    }
    if (t.includes('data') || t.includes('analyst') || t.includes('market') || t.includes('sales')) {
      return ShoppingBag;
    }
    return Briefcase;
  };

  const Icon = getIcon(job.title);
  const primarySource = job.sources?.[0] || { portal: 'Direct Company', url: '#' };
  const hasMultipleSources = job.sources && job.sources.length > 1;
  const directSource = job.sources?.find((s) => s.portal === 'Direct Company' || s.isDirect);
  const isDirectPrimary = primarySource.portal === 'Direct Company' || primarySource.isDirect;
  const primaryExternalUrl = getPortalUrl(job, primarySource.portal);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-elevated border border-slate-100/90 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-gold/40 text-left relative group">
      
      {/* Top Header: Icon + Title + Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Gold Icon Box */}
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold-700 flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:text-navy-950 transition-colors">
              <Icon className="w-6 h-6 text-[#A16207] group-hover:text-navy-950 transition-colors" />
            </div>

            <div className="min-w-0">
              <h3
                onClick={() => onSelect(job)}
                className="text-lg font-bold text-navy-950 hover:text-navy-700 transition-colors cursor-pointer truncate leading-tight"
                title={job.title}
              >
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 truncate mt-1 flex items-center gap-1.5">
                <span>{job.companyName}</span>
                {job.companyId?.isVerified && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                    ✓ Verified
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job);
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-gold/15 border-gold text-navy-950'
                : 'border-slate-100 text-slate-400 hover:text-navy hover:bg-slate-50'
            }`}
            title={isSaved ? 'Saved to bookmarks' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-gold-500 text-gold-700' : ''}`} />
          </button>
        </div>

        {/* Metadata Row: Location • Qualification • Job Type • Openings */}
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium my-3 flex-wrap">
          <span className="flex items-center text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {job.location?.city || 'Bengaluru'}
            {job.location?.isRemote && <span className="ml-1 text-emerald-600 font-bold">(Remote)</span>}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-700">
            {job.qualification?.[0] || 'Any Graduate'}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">{job.jobType || 'Full-time'}</span>
          {job.openingsCount > 1 && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                {job.openingsCount} Openings
              </span>
            </>
          )}
        </div>

        {/* Skills Tag Pills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap my-3">
            {job.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60 font-medium"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-[10px] text-slate-400">+{job.skills.length - 3} more</span>
            )}
          </div>
        )}

        {/* Badges Row: Salary Badge + Primary Portal Badge */}
        <div className="flex items-center gap-2.5 my-3.5 flex-wrap">
          {/* Warm Gold filled badge with high-contrast text */}
          <span className="inline-flex items-center bg-gold text-navy-950 font-bold text-xs px-3 py-1 rounded-md shadow-xs">
            {job.salaryDisplay || formatSalary(job.salaryMin, job.salaryMax)}
          </span>

          {/* Primary Portal Badge */}
          <PortalBadge portal={primarySource.portal} isDirect={isDirectPrimary} size="sm" />

          {/* Multi-portal Provenance Indicator & Clickable Portal Badges */}
          {hasMultipleSources && (
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-bold">
              +{job.sources.length - 1} other portals
            </span>
          )}
        </div>

        {/* Multi-Portal Direct Application Links Bar (when aggregated from 2+ portals) */}
        {hasMultipleSources && (
          <div className="my-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Also on:
            </span>
            {job.sources.map((s, idx) => {
              const sUrl = getPortalUrl(job, s.portal);
              const meta = getPortalMeta(s.portal);
              const isDirectItem = s.portal === 'Direct Company' || s.isDirect;

              return (
                <a
                  key={idx}
                  href={sUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[11px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${meta.badgeClass} hover:opacity-90`}
                  title={isDirectItem ? 'Open official company careers page' : `Apply directly on ${s.portal}`}
                >
                  <span>{isDirectItem ? 'Official Careers' : s.portal}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Row: 1-Click Direct Application Redirection */}
      <div className="pt-3 border-t border-slate-100/90 flex items-center gap-3">
        {/* Direct Native Link to official job application page on via platform or official company careers page */}
        <a
          href={primaryExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gold hover:bg-gold-400 text-navy-950 font-bold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-gold active:scale-98 flex items-center justify-center gap-2 text-sm text-center"
          title={isDirectPrimary ? 'Open official company careers page in new tab' : `Apply directly on ${primarySource.portal}`}
        >
          <span>
            {isDirectPrimary ? 'Apply Direct (Official Careers)' : `Apply on ${primarySource.portal}`}
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-navy-950" />
        </a>

        {isDirectPrimary && onApply && (
          <button
            type="button"
            onClick={() => onApply(job, primarySource)}
            className="px-3 py-2.5 rounded-xl bg-navy hover:bg-navy-900 text-gold font-bold text-xs transition-colors shadow-xs"
            title="Submit application using JobYatra ATS form"
          >
            ATS Form
          </button>
        )}

        <button
          type="button"
          onClick={() => onSelect(job)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-navy hover:bg-slate-50 font-semibold text-xs transition-colors"
        >
          Details
        </button>
      </div>

    </div>
  );
}
