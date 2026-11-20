import React, { useState, useEffect } from 'react';
import JobYatraLogo from './JobYatraLogo';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Smooth progress bar to 100% over 1.8 seconds
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 50);

    // Trigger fade-out at 1.85 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1850);

    // Completely dismiss at 2.1 seconds
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2100);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center p-6 text-center select-none transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Animated Custom Logo */}
        <div className="transform scale-125 mb-6 animate-bounce duration-1000">
          <JobYatraLogo variant="light" size="lg" to="" />
        </div>

        {/* Tagline */}
        <p className="text-sm font-bold text-slate-300 tracking-wide mt-2">
          Every Portal. <span className="text-gold">One Search.</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Aggregating live openings across India...
        </p>

        {/* 2-Second Animated Progress Bar */}
        <div className="w-48 sm:w-64 h-1.5 bg-navy-800 rounded-full mt-8 overflow-hidden border border-navy-700/60 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-gold-400 via-gold to-amber-500 rounded-full transition-all duration-[1900ms] ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <span className="text-[10px] text-gold-accent/80 font-mono font-semibold mt-3 tracking-wider">
          INITIALIZING SECURE PORTAL ENGINE
        </span>
      </div>
    </div>
  );
}
