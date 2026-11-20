import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Laptop,
  Landmark,
  Wrench,
  BookOpen,
  Award
} from 'lucide-react';

export default function QualificationPills() {
  const navigate = useNavigate();

  const pills = [
    { label: '10th Pass', icon: BookOpen, query: 'qualification=10th+Pass', count: '1,420+ Openings', color: 'hover:border-teal-400' },
    { label: '12th / Inter', icon: GraduationCap, query: 'qualification=12th+%2F+Inter', count: '2,890+ Openings', color: 'hover:border-cyan-400' },
    { label: 'Diploma / ITI', icon: Wrench, query: 'qualification=Diploma+%2F+ITI', count: '1,150+ Openings', color: 'hover:border-purple-400' },
    { label: 'Any Graduate', icon: Award, query: 'qualification=Any+Graduate', count: '5,300+ Openings', color: 'hover:border-blue-400' },
    { label: 'B.Tech / IT', icon: Laptop, query: 'qualification=B.Tech+%2F+B.E', count: '3,840+ Openings', color: 'hover:border-amber-400' },
    { label: 'Work From Home', icon: Laptop, query: 'isRemote=true', count: '940+ Openings', color: 'hover:border-emerald-400' },
    { label: 'Govt & PSU', icon: Landmark, query: 'portalSource=Govt+NCS', count: '450+ Active Calls', color: 'hover:border-orange-400' }
  ];

  return (
    <section className="bg-surface-offwhite py-8 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Browse by Qualification & Category
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            One-click filtering across all Indian job portals
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {pills.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.label}
                onClick={() => navigate(`/jobs?${p.query}`)}
                className={`bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-left flex flex-col justify-between group ${p.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-gold/10 text-navy group-hover:text-gold-700 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-gold-700">→</span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-navy-950 group-hover:text-navy-700 leading-snug">
                    {p.label}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{p.count}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
