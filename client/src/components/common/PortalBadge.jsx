import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export default function PortalBadge({
  portal = 'Direct Company',
  showIcon = true,
  size = 'md',
  isDirect = false
}) {
  const norm = portal.toLowerCase();

  let badgeStyle = {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    label: portal
  };

  if (norm.includes('naukri')) {
    badgeStyle = {
      bg: 'bg-sky-50 text-sky-800 border-sky-200/80',
      label: 'via Naukri'
    };
  } else if (norm.includes('linkedin')) {
    badgeStyle = {
      bg: 'bg-blue-50 text-[#0A66C2] border-blue-200/80',
      label: 'via LinkedIn'
    };
  } else if (norm.includes('indeed')) {
    badgeStyle = {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      label: 'via Indeed'
    };
  } else if (norm.includes('apna')) {
    badgeStyle = {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      label: 'via Apna'
    };
  } else if (norm.includes('ncs') || norm.includes('govt')) {
    badgeStyle = {
      bg: 'bg-orange-50 text-orange-800 border-orange-200/80',
      label: 'Govt NCS'
    };
  } else if (isDirect || norm.includes('direct')) {
    badgeStyle = {
      bg: 'bg-amber-50 text-amber-900 border-amber-300/80',
      label: 'Direct Company'
    };
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${badgeStyle.bg} ${sizeClasses} transition-all`}
    >
      {isDirect || norm.includes('direct') ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
      ) : null}
      <span>{badgeStyle.label}</span>
    </span>
  );
}
