import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  const topCities = [
    { name: 'Bengaluru', to: '/jobs?city=Bengaluru' },
    { name: 'Hyderabad', to: '/jobs?city=Hyderabad' },
    { name: 'Mumbai', to: '/jobs?city=Mumbai' },
    { name: 'Pune', to: '/jobs?city=Pune' },
    { name: 'Chennai', to: '/jobs?city=Chennai' },
    { name: 'Delhi NCR', to: '/jobs?city=Delhi+NCR' },
    { name: 'Remote Jobs', to: '/jobs?isRemote=true' }
  ];

  const qualifications = [
    { name: '10th Pass Jobs', to: '/jobs?qualification=10th+Pass' },
    { name: '12th / Inter Jobs', to: '/jobs?qualification=12th+%2F+Inter' },
    { name: 'Diploma & ITI Openings', to: '/jobs?qualification=Diploma+%2F+ITI' },
    { name: 'Graduate Roles', to: '/jobs?qualification=Any+Graduate' },
    { name: 'B.Tech / Software Engineering', to: '/jobs?qualification=B.Tech+%2F+B.E' },
    { name: 'Post-Graduate & MBA', to: '/jobs?qualification=Post+Graduate' }
  ];

  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Popular Locations */}
          <div>
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-3">Jobs by City</p>
            <ul className="space-y-2">
              {topCities.map((c) => (
                <li key={c.name}>
                  <Link to={c.to} className="hover:text-gold transition-colors">
                    Jobs in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: By Qualification */}
          <div>
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-3">By Qualification</p>
            <ul className="space-y-2">
              {qualifications.map((q) => (
                <li key={q.name}>
                  <Link to={q.to} className="hover:text-gold transition-colors">
                    {q.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Portal Sources */}
          <div>
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-3">Aggregated Feeds</p>
            <ul className="space-y-2">
              <li><Link to="/jobs?portalSource=LinkedIn" className="hover:text-gold transition-colors">LinkedIn Indian Openings</Link></li>
              <li><Link to="/jobs?portalSource=Naukri" className="hover:text-gold transition-colors">Naukri.com Feed</Link></li>
              <li><Link to="/jobs?portalSource=Indeed" className="hover:text-gold transition-colors">Indeed India</Link></li>
              <li><Link to="/jobs?portalSource=Apna" className="hover:text-gold transition-colors">Apna Entry-Level Jobs</Link></li>
              <li><Link to="/jobs?portalSource=Govt+NCS" className="hover:text-gold transition-colors">National Career Service (NCS)</Link></li>
              <li><Link to="/jobs?portalSource=Direct+Company" className="hover:text-gold transition-colors">Direct Company ATS</Link></li>
            </ul>
          </div>

          {/* Col 4: For Employers & Legal */}
          <div>
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-3">Employers & Support</p>
            <ul className="space-y-2">
              <li><Link to="/login?role=EMPLOYER" className="text-gold font-medium hover:underline">Post a Job (Free Direct ATS)</Link></li>
              <li><Link to="/companies" className="hover:text-gold transition-colors">Browse Verified Companies</Link></li>
              <li><Link to="/dashboard/employer" className="hover:text-gold transition-colors">Employer Hiring Portal</Link></li>
              <li><span className="text-slate-500">Contact: support@jobyatra.in</span></li>
              <li><span className="text-slate-500">Helpline: +91 80 4910 2026</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar matching image */}
        <div className="border-t border-navy-800/80 pt-6 text-center text-slate-400">
          <p className="text-xs sm:text-sm font-medium">
            © 2024 JobYatra. All rights reserved. • Made in India with excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
