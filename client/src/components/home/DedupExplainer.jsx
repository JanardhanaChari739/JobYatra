import React from 'react';
import { Layers, ShieldCheck, ArrowRight, CheckCircle2, Split } from 'lucide-react';

export default function DedupExplainer() {
  return (
    <section className="bg-white py-16 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Explainer Text */}
          <div className="lg:col-span-5 text-left space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold/15 text-navy-950 border border-gold/40">
              <Layers className="w-3.5 h-3.5 text-navy-900" />
              SHA-256 Deduplication Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight leading-snug">
              Stop Applying to the Same Job 3 Times Across Different Portals.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Employers cross-post openings across LinkedIn, Naukri, Indeed, and their ATS career pages. Our cryptographic SHA-256 deduplicator detects identical postings and merges them into <strong>One Unified Master Job Card</strong>.
            </p>

            <ul className="space-y-2.5 pt-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero duplicate clutter in your search feed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Choose your preferred portal to apply through</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Option to apply directly to verified HR managers</span>
              </li>
            </ul>
          </div>

          {/* Right Visual Comparison Showcase */}
          <div className="lg:col-span-7 bg-surface-offwhite rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
            
            {/* Before / After Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Traditional Portal Clutter (3x Duplicates)</span>
              <span className="text-gold-700 font-extrabold flex items-center gap-1">
                JobYatra Merged Card <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Visual Box */}
            <div className="space-y-3">
              {/* Cluttered Old Way */}
              <div className="grid grid-cols-3 gap-2 opacity-60">
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-left text-[11px]">
                  <span className="text-sky-600 font-bold block">Naukri</span>
                  <p className="font-semibold text-slate-800 truncate">Product Manager</p>
                  <p className="text-slate-400">Razorpay • ₹20-28L</p>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-left text-[11px]">
                  <span className="text-[#0A66C2] font-bold block">LinkedIn</span>
                  <p className="font-semibold text-slate-800 truncate">Product Manager</p>
                  <p className="text-slate-400">Razorpay • ₹20-28L</p>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-left text-[11px]">
                  <span className="text-amber-600 font-bold block">Direct ATS</span>
                  <p className="font-semibold text-slate-800 truncate">Product Manager</p>
                  <p className="text-slate-400">Razorpay • ₹20-28L</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center py-1">
                <span className="bg-navy text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  Automated SHA-256 Merge
                </span>
              </div>

              {/* JobYatra Single Master Card */}
              <div className="bg-white border-2 border-gold-accent/70 rounded-xl p-4 sm:p-5 shadow-elevated text-left transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-navy-950">
                        Product Manager
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                        Verified Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Razorpay Software • Bengaluru • INR 20-28 LPA
                    </p>
                  </div>
                  <span className="bg-gold text-navy-950 text-xs font-bold px-3 py-1 rounded-md self-start sm:self-center">
                    INR 20-28 LPA
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-600">Available on 3 Portals:</span>
                    <span className="text-[11px] bg-amber-50 text-amber-900 font-medium px-2 py-0.5 rounded border border-amber-200">
                      Direct ATS (Preferred)
                    </span>
                    <span className="text-[11px] bg-blue-50 text-[#0A66C2] font-medium px-2 py-0.5 rounded border border-blue-200">
                      LinkedIn
                    </span>
                    <span className="text-[11px] bg-sky-50 text-sky-800 font-medium px-2 py-0.5 rounded border border-sky-200">
                      Naukri
                    </span>
                  </div>

                  <span className="text-xs font-bold text-gold-700 bg-gold/10 px-3 py-1 rounded-lg">
                    Apply on Your Preferred Portal →
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
