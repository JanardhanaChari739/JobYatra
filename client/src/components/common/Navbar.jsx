import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import JobYatraLogo from './JobYatraLogo';
import {
  Menu,
  X,
  User,
  Briefcase,
  LogOut,
  ChevronDown,
  Sparkles,
  Bookmark
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isEmployer, isCandidate } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { label: 'Find Jobs', to: '/jobs' },
    { label: 'Companies', to: '/companies' },
    { label: '10th / Inter Jobs', to: '/jobs?qualification=10th+Pass' },
    { label: 'Govt & PSU', to: '/jobs?portalSource=Govt+NCS' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-navy-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <JobYatraLogo variant="light" size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-gold ${
                    isActive ? 'text-gold' : 'text-slate-200'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-navy-800 border border-navy-700 hover:border-gold/50 transition-all text-white text-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gold text-navy-950 font-bold flex items-center justify-center text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name?.split(' ')[0]}</p>
                    <span className="text-[10px] text-gold font-medium uppercase">{user.role}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-slate-100 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-navy-950">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-gold/20 text-navy-900 px-2 py-0.5 rounded">
                        {user.role} ACCOUNT
                      </span>
                    </div>

                    <Link
                      to={isEmployer ? '/dashboard/employer' : '/dashboard/candidate'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy-950"
                    >
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>

                    {isCandidate && (
                      <Link
                        to="/dashboard/candidate?tab=saved"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy-950"
                      >
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        Saved Jobs
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-200 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Post a Job CTA */}
            <Link
              to={isEmployer ? '/dashboard/employer' : '/login?redirect=post-job&role=EMPLOYER'}
              className="inline-flex items-center justify-center bg-gold hover:bg-gold-400 text-navy-950 font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-gold active:scale-95"
            >
              Post a Job
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to={isEmployer ? '/dashboard/employer' : '/dashboard/candidate'}
                className="flex items-center gap-1.5 text-xs font-bold bg-gold text-navy-950 px-3 py-1.5 rounded-full shadow-xs"
              >
                <span>{user?.name?.split(' ')[0] || 'Dashboard'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold bg-gold text-navy-950 px-3 py-1.5 rounded-full shadow-xs"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-b border-navy-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-200 hover:text-gold py-2 border-b border-navy-800"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="pt-2 space-y-2">
              <Link
                to={isEmployer ? '/dashboard/employer' : '/dashboard/candidate'}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-gold py-1"
              >
                Go to Dashboard ({user.name})
              </Link>
              <button
                onClick={handleLogout}
                className="block text-sm text-rose-400 py-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-2.5 rounded-lg border border-navy-700 text-white font-semibold text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/login?role=EMPLOYER"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-2.5 rounded-lg bg-gold text-navy-950 font-bold text-sm"
              >
                Post a Job
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
