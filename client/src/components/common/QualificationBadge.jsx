import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function QualificationBadge({
  qualification = 'Any Graduate',
  size = 'md'
}) {
  const q = qualification.toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (q.includes('10th')) {
    colorClasses = 'bg-teal-50 text-teal-800 border-teal-200';
  } else if (q.includes('12th') || q.includes('inter')) {
    colorClasses = 'bg-cyan-50 text-cyan-800 border-cyan-200';
  } else if (q.includes('diploma') || q.includes('iti')) {
    colorClasses = 'bg-purple-50 text-purple-800 border-purple-200';
  } else if (q.includes('b.tech') || q.includes('b.e')) {
    colorClasses = 'bg-blue-50 text-blue-800 border-blue-200';
  } else if (q.includes('post graduate') || q.includes('mba') || q.includes('m.tech')) {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colorClasses} ${sizeClasses}`}
    >
      <GraduationCap className="w-3.5 h-3.5 opacity-80" />
      <span>{qualification}</span>
    </span>
  );
}
