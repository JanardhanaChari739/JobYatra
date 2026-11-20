import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2, Lock, Mail, Phone, MapPin, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import JobYatraLogo from '../components/common/JobYatraLogo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('CANDIDATE');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Bengaluru',
    qualification: 'Any Graduate'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPostRegisterLoading, setIsPostRegisterLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({ ...formData, role });
      setLoading(false);
      // Show 2-second loading screen with JobYatra logo
      setIsPostRegisterLoading(true);
      setTimeout(() => setProgress(100), 50);

      // After 2 seconds logo loading, navigate to the login page
      setTimeout(() => {
        navigate(`/login?registered=true&email=${encodeURIComponent(formData.email)}`, {
          state: {
            registered: true,
            message: 'Account created successfully! Please sign in with your password to continue.',
            email: formData.email
          }
        });
      }, 2000);
    } catch (err) {
      setError(err?.message || 'Registration failed. Please check your details.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-6">
        <JobYatraLogo variant="light" size="lg" />
        <h2 className="mt-4 text-2xl font-extrabold text-white">Create Your Account</h2>
        <p className="mt-1 text-xs text-slate-300">Join India's unified job discovery network</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl rounded-3xl border border-slate-100">
          
          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('CANDIDATE')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                role === 'CANDIDATE' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-500 hover:text-navy'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('EMPLOYER')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                role === 'EMPLOYER' ? 'bg-gold text-navy-950 shadow-xs' : 'text-slate-500 hover:text-navy'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Employer (Hiring)</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'EMPLOYER' ? 'Hiring Lead / Company Name' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={role === 'EMPLOYER' ? 'e.g. Swiggy Recruiting' : 'e.g. Aarav Sharma'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone (+91)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City Hub
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Remote">Pan-India (Remote)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Highest Qualification
                </label>
                <select
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="10th Pass">10th Pass (Matric)</option>
                  <option value="12th / Inter">12th / Intermediate</option>
                  <option value="Diploma / ITI">Diploma / ITI</option>
                  <option value="Any Graduate">Any Graduate</option>
                  <option value="B.Tech / B.E">B.Tech / B.E / Engineering</option>
                  <option value="Post Graduate">Post Graduate (MBA / MCA)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-400 text-navy-950 font-bold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-4 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Free Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-navy font-bold hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>

      {/* 2-Second Post-Registration Branded Loading Screen with JobYatra Logo */}
      {isPostRegisterLoading && (
        <div className="fixed inset-0 z-50 bg-navy flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-300">
          {/* Radial ambient glow */}
          <div className="absolute w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
            {/* Animated JobYatra Logo */}
            <div className="transform scale-125 mb-6 animate-bounce duration-1000">
              <JobYatraLogo variant="light" size="lg" to="" />
            </div>

            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Registration Successful!</span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Welcome to JobYatra
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              Account registered successfully. Navigating to the Login page...
            </p>

            {/* 2-Second Animated Progress Bar */}
            <div className="w-56 h-1.5 bg-navy-800 rounded-full mt-6 overflow-hidden border border-navy-700/60 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-gold-400 via-gold to-amber-500 rounded-full transition-all duration-[2000ms] ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <span className="text-[10px] text-gold-accent font-mono font-semibold mt-3 tracking-wider">
              LOADING SECURE SIGN-IN • 2 SECONDS
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
