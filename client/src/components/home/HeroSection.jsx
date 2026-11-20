import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, MapPin, Sparkles, Building2, Users, Briefcase } from 'lucide-react';

export default function HeroSection({ stats = {} }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [qualification, setQualification] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('q', keyword.trim());
    if (qualification && qualification !== 'all') params.append('qualification', qualification);
    if (city.trim() && city !== 'all') params.append('city', city.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative bg-navy overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-navy-800">
      {/* Decorative Gold Flowing Lines / Background Wave SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-100 200 C300 100, 700 450, 1500 120"
            stroke="#E5A852"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M-50 260 C350 160, 750 510, 1550 180"
            stroke="#E5A852"
            strokeWidth="2"
          />
          <path
            d="M100 320 C500 220, 900 570, 1600 240"
            stroke="#E5A852"
            strokeWidth="1"
          />
          {/* Subtle gold sparkles */}
          <circle cx="950" cy="180" r="2" fill="#E5A852" />
          <circle cx="820" cy="240" r="3" fill="#E5A852" />
          <circle cx="1120" cy="140" r="2.5" fill="#E5A852" />
          <circle cx="1380" cy="290" r="3" fill="#E5A852" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.15]">
              Your Journey to the <br />
              <span className="text-gold-accent">Right Job</span> Begins Here
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Search live openings across <span className="text-white font-medium">LinkedIn, Naukri, Indeed & 1,200+ Company Career Pages</span> — from 10th Pass to Graduates.
            </p>

            {/* Unified 4-Part Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl lg:rounded-full p-2.5 shadow-2xl border border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-0 transition-all hover:shadow-gold/20"
            >
              {/* Part 1: Job title or company */}
              <div className="flex-1 flex items-center px-4 py-2">
                <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Job title or company"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Vertical Divider 1 */}
              <div className="hidden lg:block w-px h-8 bg-slate-200"></div>

              {/* Part 2: Qualification */}
              <div className="flex-1 flex items-center px-4 py-2">
                <GraduationCap className="w-5 h-5 text-gold-accent mr-2.5 flex-shrink-0" />
                <div className="flex flex-col text-left w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0.5">
                    Qualification:
                  </span>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="">10th / Inter / Graduate</option>
                    <option value="10th Pass">10th Pass (Matric)</option>
                    <option value="12th / Inter">12th / Inter / PUC</option>
                    <option value="Diploma / ITI">Diploma / ITI</option>
                    <option value="Any Graduate">Any Graduate (B.Com / BA / B.Sc)</option>
                    <option value="B.Tech / B.E">B.Tech / B.E / IT</option>
                    <option value="Post Graduate">Post Graduate (MBA / MCA)</option>
                  </select>
                </div>
              </div>

              {/* Vertical Divider 2 */}
              <div className="hidden lg:block w-px h-8 bg-slate-200"></div>

              {/* Part 3: Location */}
              <div className="flex-1 flex items-center px-4 py-2">
                <MapPin className="w-5 h-5 text-gold-accent mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Part 4: Submit Button */}
              <button
                type="submit"
                className="bg-gold hover:bg-gold-400 text-navy-950 font-bold px-8 py-3 rounded-xl lg:rounded-full transition-all duration-200 shadow-md active:scale-95 text-sm sm:text-base whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Search Jobs</span>
              </button>
            </form>

            {/* Live Stats Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm font-medium text-slate-200">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-accent"></span>
                <strong className="text-white font-bold">{stats.totalJobs || '10,000+'}</strong> Jobs
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-accent"></span>
                <strong className="text-white font-bold">{stats.totalCompanies || '1,200+'}</strong> Companies
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-accent"></span>
                <strong className="text-white font-bold">50,000+</strong> Professionals
              </span>
              <span className="text-slate-500">•</span>
              <span className="bg-navy-800 text-gold-accent text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-gold-accent/30">
                0% Duplicate Clutter
              </span>
            </div>
          </div>

          {/* Right Hero Graphic: Corporate Indian Team in Angled Diamond Hexagonal Gold Frame */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Outer Glow & Geometric Frame Accent */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-accent/30 to-amber-500/10 rounded-3xl blur-xl opacity-60"></div>

              {/* Diamond-Angled Corporate Container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-gold-accent/40 shadow-2xl bg-navy-900 group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
                  alt="JobYatra Corporate Hiring & Candidate Success"
                  className="w-full h-80 sm:h-96 object-cover object-center filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark & Gold Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent"></div>

                {/* Floating Multi-Portal Live Badge */}
                <div className="absolute top-4 left-4 bg-navy-900/90 backdrop-blur-md border border-gold-accent/50 rounded-xl px-3.5 py-2 shadow-lg flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-white tracking-wide">Universal Aggregator Active</p>
                    <p className="text-[9px] text-gold-accent">LinkedIn • Naukri • Indeed • Apna • Direct ATS</p>
                  </div>
                </div>

                {/* Bottom Verified Hiring Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-navy-900/95 backdrop-blur-md border border-navy-700 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold text-navy-950 font-bold flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-navy-950" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">Direct Employer Connections</p>
                      <p className="text-[11px] text-slate-300">Verified salaries in INR LPA & Monthly</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gold-accent bg-gold/10 px-2.5 py-1 rounded-full border border-gold/30">
                    100% Free
                  </span>
                </div>
              </div>

              {/* Decorative Four-Point Sparkle on Corner */}
              <div className="absolute -bottom-3 -right-3 w-8 h-8 text-gold-accent animate-pulse">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
