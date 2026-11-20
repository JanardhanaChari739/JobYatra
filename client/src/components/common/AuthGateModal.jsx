import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  User,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  X,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import JobYatraLogo from './JobYatraLogo';

export default function AuthGateModal({ isOpen, onClose }) {
  const { login, quickDemoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      await quickDemoLogin(role);
      if (onClose) onClose();
    } catch (err) {
      setError('Demo login failed: ' + (err?.message || 'Try again'));
    } finally {
      setLoading(false);
    }
  };

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      if (onClose) onClose();
    } catch (err) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm text-left animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Close Button to allow guest exploration if desired */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-navy-900/60 text-slate-300 hover:text-white transition-colors"
          title="Browse as Guest"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Banner */}
        <div className="bg-navy p-6 text-white text-center border-b border-navy-800">
          <div className="flex justify-center mb-3">
            <JobYatraLogo variant="light" size="md" to="" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Sign In to Unlock Full Access
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            1-Click instant access to 24+ Indian opportunities, direct company ATS channels & application tracker.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* 1-Click Demo Login Box */}
          <div className="p-4 bg-surface-cream rounded-2xl border border-gold/40 mb-5">
            <span className="text-[10px] font-extrabold text-navy-950 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              1-Click Instant Demo Login (Recommended)
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemo('CANDIDATE')}
                className="bg-navy hover:bg-navy-900 text-gold text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <User className="w-4 h-4" />
                <span>Candidate Demo</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemo('EMPLOYER')}
                className="bg-gold hover:bg-gold-400 text-navy-950 text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Building2 className="w-4 h-4" />
                <span>Employer Demo</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* Quick Login Form */}
          <form onSubmit={handleFormLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy hover:bg-navy-900 text-gold font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 mt-1"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Links */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              to="/register"
              onClick={onClose}
              className="text-navy font-bold hover:underline"
            >
              Create Free Account →
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-medium"
            >
              Browse as Guest
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
