import React from 'react';
import { Link } from 'react-router-dom';

export default function JobYatraLogo({
  variant = 'light', // 'light' for dark navy surfaces, 'dark' for off-white surfaces
  size = 'md',       // 'sm', 'md', 'lg'
  withTagline = false,
  to = '/'
}) {
  const isLight = variant === 'light';

  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-xl', badge: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', badge: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', badge: 'text-xs' }
  }[size];

  const content = (
    <div className="inline-flex items-center gap-2.5 group select-none">
      {/* Custom Vector Icon: Briefcase + Upward Growth Arrow ("Yatra") + Magnifying Lens */}
      <div className={`relative ${sizeClasses.icon} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Briefcase Base */}
          <rect
            x="6"
            y="14"
            width="32"
            height="22"
            rx="4"
            fill={isLight ? '#FFFFFF' : '#0B192C'}
            className="transition-colors"
          />

          {/* Briefcase Handle */}
          <path
            d="M15 14V10C15 8.89543 15.8954 8 17 8H27C28.1046 8 29 8.89543 29 10V14"
            stroke={isLight ? '#FFFFFF' : '#0B192C'}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Briefcase Center Latch Accent */}
          <rect
            x="19"
            y="18"
            width="6"
            height="4"
            rx="1"
            fill="#E5A852"
          />

          {/* Search Lens Ring / Handle (Subtle bottom-left) */}
          <circle
            cx="14"
            cy="27"
            r="4.5"
            stroke="#E5A852"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M11 30.5L8 34"
            stroke="#E5A852"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Upward Growth Arrow ("Yatra") across Briefcase */}
          <path
            d="M14 27L23 18L28 22L36 12"
            stroke="#E5A852"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrowhead */}
          <path
            d="M30 11.5H36.5V18"
            stroke="#E5A852"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight ${sizeClasses.text} leading-none flex items-center`}>
          <span className={isLight ? 'text-white' : 'text-navy-950'}>Job</span>
          <span className="text-gold-accent ml-0.5">Yatra</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-accent ml-1 -mt-2"></span>
        </div>
        {withTagline && (
          <span className={`text-[10px] tracking-wide mt-0.5 font-medium ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Your career journey starts here.
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
