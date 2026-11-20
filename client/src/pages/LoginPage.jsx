import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, Building2, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import JobYatraLogo from '../components/common/JobYatraLogo';
import { GoogleIcon, FacebookIcon, LinkedInIcon } from '../components/common/SocialIcons';
import SocialAuthModal from '../components/common/SocialAuthModal';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const initialRole = searchParams.get('role') || 'CANDIDATE';
  const registered = searchParams.get('registered') === 'true' || Boolean(location.state?.registered);
  const prefillEmail = searchParams.get('email') || location.state?.email || '';

  const { login, quickDemoLogin, socialLogin } = useAuth();
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [socialProvider, setSocialProvider] = useState('GOOGLE');

  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);

  const handleSocialClick = (providerName) => {
    setSocialProvider(providerName);
    setSocialModalOpen(true);
  };

  const handleSocialAccountSelected = async (account) => {
    setSocialModalOpen(false);
    setLoading(true);
    setError('');
    try {
      await socialLogin({ ...account, role: 'CANDIDATE' });
      // Direct navigation to home page after successful login
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Social login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // After login navigate to home page of the portal as requested
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    setError('');
    try {
      await quickDemoLogin(role);
      // After login navigate to home page of the portal as requested
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-6">
        <JobYatraLogo variant="light" size="lg" />
        <h2 className="mt-4 text-2xl font-extrabold text-white">
          Sign In to JobYatra
        </h2>
        <p className="mt-1 text-xs text-slate-300">
          Access your unified candidate tracker or employer dashboard
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl rounded-3xl border border-slate-100">
          
          {registered && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{location.state?.message || 'Account created successfully! Please sign in with your password to continue.'}</span>
            </div>
          )}

          {!registered && location.state?.from && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-semibold flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
              <span>Please sign in or create an account to access the JobYatra portal.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* Primary Email & Password Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              {/* Desktop Account Quick-Select Header */}
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <span className="text-[10px] text-slate-400 font-semibold">Select desktop account:</span>
              </div>

              {/* Desktop Account Selector Pills */}
              <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
                {[
                  { name: 'Aarav (Candidate)', email: 'candidate@jobyatra.in', pass: 'Pass@1234' },
                  { name: 'Priya (Google)', email: 'priya.nair.dev@gmail.com', pass: 'Password@123' },
                  { name: 'Pooja (Employer)', email: 'employer@jobyatra.in', pass: 'Pass@1234' }
                ].map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword(acc.pass);
                    }}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                      email === acc.email
                        ? 'bg-navy text-gold border-navy shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-gold hover:bg-white'
                    }`}
                    title={`Select desktop account ${acc.email}`}
                  >
                    <User className="w-2.5 h-2.5" />
                    <span>{acc.name}</span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  list="desktop-saved-accounts"
                  required
                  placeholder="name@company.com or select account above"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                />
                <datalist id="desktop-saved-accounts">
                  <option value="candidate@jobyatra.in">Aarav Sharma (Candidate Demo)</option>
                  <option value="priya.nair.dev@gmail.com">Priya Nair (Google Profile)</option>
                  <option value="aarav.sharma@gmail.com">Aarav Sharma (Google Personal)</option>
                  <option value="employer@jobyatra.in">Pooja Verma (Employer HR)</option>
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy hover:bg-navy-900 text-gold font-bold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Authentication Options (Moved DOWN to login page below email form) */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 whitespace-nowrap">
              Or continue with social
            </span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>

          <div className="space-y-2 mb-6">
            {/* Continue with Google */}
            <button
              type="button"
              onClick={() => handleSocialClick('GOOGLE')}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs active:scale-98"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>

            {/* LinkedIn & Facebook Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSocialClick('LINKEDIN')}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98"
              >
                <LinkedInIcon className="w-3.5 h-3.5 fill-white" />
                <span>LinkedIn</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick('FACEBOOK')}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-[#1877F2] hover:bg-[#145dbf] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98"
              >
                <FacebookIcon className="w-3.5 h-3.5 fill-white" />
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* 1-Click Demo Buttons Banner */}
          <div className="p-3 bg-surface-cream rounded-2xl border border-gold/40 text-left mb-6">
            <span className="text-[10px] font-extrabold text-navy-950 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              Instant 1-Click Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('CANDIDATE')}
                className="bg-navy hover:bg-navy-900 text-gold text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Candidate Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('EMPLOYER')}
                className="bg-gold hover:bg-gold-400 text-navy-950 text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Employer Demo</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-navy font-bold hover:underline">
              Register as Candidate or Employer
            </Link>
          </div>

        </div>
      </div>

      <SocialAuthModal
        isOpen={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        provider={socialProvider}
        onSelectAccount={handleSocialAccountSelected}
        role="CANDIDATE"
      />
    </div>
  );
}
