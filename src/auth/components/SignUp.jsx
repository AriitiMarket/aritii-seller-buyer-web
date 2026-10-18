import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';
import { registerUser } from '@/store/slices/userThunks';

const ROLE_CONFIG = {
  BUYER: {
    title: 'Create Your Buyer Account',
    description: 'Sign up to explore local products, manage orders, and enjoy fast delivery.',
    badge: 'ARIITI MARKET • BUYER ACCOUNT',
    next: '/my-dashboard',
    submit: 'Complete Registration',
  },
  SELLER: {
    title: 'Create Your Seller Account',
    description: 'Sign up to start selling and reach more customers.',
    badge: 'ARIITI MARKET • SELLER ACCOUNT',
    next: '/seller-registration',
    submit: 'Create Seller Account',
  },
  PROVIDER: {
    title: 'Create Your Delivery Account',
    description: 'Sign up to join our delivery network.',
    badge: 'ARIITI MARKET • DELIVERY ACCOUNT',
    next: '/provider-application',
    submit: 'Create Delivery Account',
  },
};

const SignUp = ({ registrationType = 'BUYER' }) => {
  const role = ROLE_CONFIG[registrationType] ? registrationType : 'BUYER';
  const config = ROLE_CONFIG[role];
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [agree, setAgree] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      toast.error('Please agree to Terms of Service');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim(),
      city: city.trim(),
      registrationType: role,
    };

    try {
      await dispatch(registerUser(payload));
      toast.success('Account created successfully!');
      navigate(config.next, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm lg:p-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139, 69, 19, 0.1) 0%, rgba(0,0,0,0.5) 100%)' }}>
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full max-w-6xl h-screen lg:h-auto lg:max-h-[90vh] relative">
        {/* Left Sidebar - Branding */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-orange-600 to-orange-800 p-12 flex-col justify-between rounded-l-2xl">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <svg viewBox="0 0 64 64" className="h-12 w-auto" aria-hidden="true">
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fff" />
                    <stop offset="1" stopColor="#f0f0f0" />
                  </linearGradient>
                </defs>
                <path d="M32 6 L58 52 L6 52 Z" fill="#000" />
                <path d="M32 31 L58 52 L6 52 Z" fill="url(#brandGrad)" />
              </svg>
              <div>
                <p className="text-xl font-bold text-white">Aritii</p>
                <p className="text-sm text-orange-100">Market</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Create Account</h2>
            <p className="text-lg text-orange-50 leading-relaxed">Join thousands of buyers, sellers, and delivery partners in Ethiopia's fastest-growing marketplace.</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛍️</span>
              <div>
                <p className="font-semibold text-white">For Buyers</p>
                <p className="text-sm text-orange-100">Discover local shops and fast delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏪</span>
              <div>
                <p className="font-semibold text-white">For Sellers</p>
                <p className="text-sm text-orange-100">Grow your business online</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-semibold text-white">For Delivery</p>
                <p className="text-sm text-orange-100">Earn by delivering orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="relative w-full lg:w-3/5 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none border border-orange-500/20 bg-gradient-to-b from-slate-900/95 to-slate-950/95 shadow-2xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(249, 115, 22, 0.15)' }}>
          {/* Close Button */}
          <button
            onClick={() => navigate('/login')}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-gray-300 hover:text-white transition"
            aria-label="Close"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center lg:text-left border-b border-orange-500/10">
            <div className="flex items-center gap-3 mb-3 lg:hidden justify-center">
              <svg viewBox="0 0 64 64" className="h-8 w-auto" aria-hidden="true">
                <defs>
                  <linearGradient id="signupGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#f97316" />
                  </linearGradient>
                </defs>
                <path d="M32 6 L58 52 L6 52 Z" fill="#0f1114" />
                <path d="M32 31 L58 52 L6 52 Z" fill="url(#signupGrad)" />
              </svg>
              <div>
                <p className="font-bold text-white">Aritii Market</p>
              </div>
            </div>
            <span className="inline-block mb-2 text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              {config.badge}
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">{config.title}</h1>
            <p className="text-sm text-gray-400">{config.description}</p>
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-3 overflow-y-auto max-h-[70vh] lg:max-h-none">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Abebe Bikila"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="buyer@example.com"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition disabled:opacity-50"
            />
          </div>

          {/* Phone + City Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">Phone</label>
              <div className="flex gap-2">
                <select className="w-14 px-2 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none transition">
                  <option>+251</option>
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="912345678"
                  required
                  disabled={loading}
                  className="flex-1 px-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition"
              >
                <option value="">Select city...</option>
                <option value="addis-ababa">Addis Ababa</option>
                <option value="dire-dawa">Dire Dawa</option>
                <option value="harar">Harar</option>
                <option value="awassa">Awassa</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">Password</label>
            <div className="relative">
              <input
                type={visible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength="8"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition disabled:opacity-50 pr-10"
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">Confirm Password</label>
            <div className="relative">
              <input
                type={visibleConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength="8"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition disabled:opacity-50 pr-10"
              />
              <button
                type="button"
                onClick={() => setVisibleConfirm(!visibleConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer mt-5">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-5 h-5 rounded accent-orange-500"
            />
            <span className="text-sm text-gray-300">
              I agree to the{' '}
              <Link to="#" className="text-orange-400 hover:text-orange-300 font-semibold">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="#" className="text-orange-400 hover:text-orange-300 font-semibold">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-black font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : config.submit}
            {!loading && (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs text-gray-500 font-semibold uppercase">or sign up with</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {/* Social Buttons */}
        <div className="px-6 pb-6 flex justify-center gap-3">
          <a href="#" onClick={(e) => e.preventDefault()} className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 flex items-center justify-center transition" aria-label="Sign up with Google">
            <GoogleLogo />
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 flex items-center justify-center transition" aria-label="Sign up with Facebook">
            <FacebookLogo />
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 flex items-center justify-center transition" aria-label="Sign up with LinkedIn">
            <LinkedInLogo />
          </a>
        </div>

        {/* Footer */}
        <div className="px-6 lg:px-8 pb-6 text-center border-t border-orange-500/10 pt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-orange-400 hover:text-orange-300 font-semibold"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

function GoogleLogo() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.7 10h-2.5v8h-2v-8H9v-2h2V9c0-1.66 1-2.5 2.7-2.5h1.8v1.8h-1c-.52 0-.7.22-.7.7v1.2h2l-.5 2z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#0A66C2" />
      <path fill="white" d="M9 8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm0 14H7V9h2v13zm8-13c-1.657 0-2 1.343-2 3v1h-2v2h2v8h2v-8c0-2 1-3 2-3h1v-2h-1z" />
    </svg>
  );
}
export default SignUp;
