import React, { useState } from 'react';
import { X, Check, User, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { GoogleIcon, FacebookIcon, LinkedInIcon } from './SocialIcons';

export default function SocialAuthModal({
  isOpen,
  onClose,
  provider = 'GOOGLE',
  onSelectAccount,
  role = 'CANDIDATE'
}) {
  const [loading, setLoading] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const accountsByProvider = {
    GOOGLE: [
      {
        name: 'Aarav Sharma',
        email: 'candidate@jobyatra.in',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        label: 'Google Workspace • JobYatra Candidate'
      },
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        label: 'Google Account (Primary)'
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair.dev@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        label: 'Google Account (Work)'
      },
      {
        name: 'Rohan Verma',
        email: 'rohan.verma@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
        label: 'Google Account (Personal)'
      }
    ],
    FACEBOOK: [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma.fb@facebook.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        label: 'Facebook Profile'
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair.fb@facebook.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        label: 'Facebook Profile'
      }
    ],
    LINKEDIN: [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@linkedin.in',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        label: 'LinkedIn Verified Profile • Senior Architect'
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair@linkedin.in',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        label: 'LinkedIn Verified Profile • Lead Engineer'
      }
    ]
  };

  const currentAccounts = accountsByProvider[provider] || accountsByProvider.GOOGLE;

  const handleChoose = async (acc) => {
    setLoading(true);
    try {
      await onSelectAccount({
        provider,
        email: acc.email,
        name: acc.name,
        avatar: acc.avatar || '',
        role
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    setLoading(true);
    try {
      await onSelectAccount({
        provider,
        email: customEmail,
        name: customName,
        avatar: '',
        role
      });
    } finally {
      setLoading(false);
    }
  };

  const getProviderMeta = () => {
    switch (provider) {
      case 'FACEBOOK':
        return {
          title: 'Log in with Facebook',
          subtitle: 'JobYatra will receive your name and profile picture, email address.',
          icon: <FacebookIcon className="w-6 h-6 text-[#1877F2]" />,
          color: 'text-[#1877F2]'
        };
      case 'LINKEDIN':
        return {
          title: 'Sign in with LinkedIn',
          subtitle: 'Sync your verified professional qualifications & credentials with JobYatra.',
          icon: <LinkedInIcon className="w-6 h-6 text-[#0A66C2]" />,
          color: 'text-[#0A66C2]'
        };
      default:
        return {
          title: 'Sign in with Google',
          subtitle: 'Choose an account to continue to JobYatra (jobyatra.in)',
          icon: <GoogleIcon className="w-6 h-6" />,
          color: 'text-slate-800'
        };
    }
  };

  const meta = getProviderMeta();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-xs text-left animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-xs">
              {meta.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 leading-tight">
                {meta.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {meta.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-slate-600">
                Authorizing with {provider}...
              </p>
              <p className="text-[10px] text-slate-400">Secure OAuth 2.0 Token Exchange</p>
            </div>
          ) : customMode ? (
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div className="text-xs font-bold text-slate-700 mb-1">
                Enter your {provider.toLowerCase()} account details:
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder={`name@${provider.toLowerCase()}.com`}
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-navy hover:bg-navy-900 text-gold font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs"
                >
                  Continue with this Account
                </button>
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Back
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Saved Accounts on this Device:
              </span>

              {currentAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChoose(acc)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 hover:border-gold hover:bg-slate-50 transition-all text-left group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-navy-950 group-hover:text-gold-700 transition-colors">
                        {acc.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {acc.email}
                      </p>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                        {acc.label}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-gold-700 transition-colors" />
                </button>
              ))}

              {/* Use Another Account Button */}
              <button
                type="button"
                onClick={() => setCustomMode(true)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-gold hover:bg-slate-50/70 transition-all text-left text-xs font-bold text-slate-700"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Use another {provider.toLowerCase()} account</span>
              </button>
            </div>
          )}

          {/* Privacy Note */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>JobYatra protects your data with end-to-end 256-bit encryption.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
