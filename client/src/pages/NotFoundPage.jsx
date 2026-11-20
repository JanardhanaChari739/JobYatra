import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import JobYatraLogo from '../components/common/JobYatraLogo';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 text-center text-white">
      <JobYatraLogo variant="light" size="lg" />
      <h1 className="text-6xl font-extrabold text-gold mt-6">404</h1>
      <h2 className="text-2xl font-bold mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-300 max-w-md mt-2">
        The destination you are looking for has been moved or does not exist on JobYatra.
      </p>

      <div className="flex items-center gap-4 mt-8">
        <Link
          to="/"
          className="bg-gold text-navy-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-gold-400 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          to="/jobs"
          className="bg-navy-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-navy-700 transition-colors border border-navy-700"
        >
          <Search className="w-4 h-4" />
          <span>Search Jobs</span>
        </Link>
      </div>
    </div>
  );
}
