import React from 'react';
import { ShieldCheck, TrendingUp, Award, Sparkles } from 'lucide-react';
import JobYatraLogo from '../common/JobYatraLogo';

export default function WhyChooseJobYatra() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Premium Network',
      description: 'Curated employers and verified roles to ensure quality and trust.'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'AI-powered recommendations tailored to your skills and aspirations.'
    },
    {
      icon: Award,
      title: 'Trusted & Verified',
      description: 'Safe, transparent, and reliable hiring process every step of the way.'
    }
  ];

  return (
    <section className="bg-navy text-white pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Golden Framing Accent Lines */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <div className="h-px bg-gradient-to-r from-transparent via-gold-accent/60 to-gold-accent w-24 sm:w-48"></div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white whitespace-nowrap">
            Why Choose JobYatra
          </h2>
          <div className="h-px bg-gradient-to-l from-transparent via-gold-accent/60 to-gold-accent w-24 sm:w-48"></div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex items-start gap-4 text-left group">
                {/* Circular Gold Icon matching reference */}
                <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 text-gold-accent flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:text-navy-950 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mid-Divider */}
        <div className="border-t border-navy-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo with Tagline */}
          <JobYatraLogo variant="light" size="md" withTagline={true} />

          {/* Aggregated Portals Provenance Marquee */}
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap justify-center sm:justify-end">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Indexed Portals:</span>
            <span className="bg-navy-800 px-2 py-0.5 rounded text-slate-300">LinkedIn</span>
            <span className="bg-navy-800 px-2 py-0.5 rounded text-slate-300">Naukri</span>
            <span className="bg-navy-800 px-2 py-0.5 rounded text-slate-300">Indeed</span>
            <span className="bg-navy-800 px-2 py-0.5 rounded text-slate-300">Apna</span>
            <span className="bg-navy-800 px-2 py-0.5 rounded text-slate-300">Govt NCS</span>
            <span className="bg-gold/15 text-gold-accent px-2 py-0.5 rounded border border-gold/30 font-medium">Direct ATS</span>
          </div>
        </div>

      </div>
    </section>
  );
}
