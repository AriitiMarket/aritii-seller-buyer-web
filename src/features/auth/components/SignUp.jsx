import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '@/store/slices/userThunks';
import BrandLogo from '@/shared/components/BrandLogo';
import { getSafeRedirect } from '@/features/auth/utils/redirect';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineCheckCircle,
  AiOutlineArrowRight,
  AiOutlineShop,
  AiOutlineCar,
  AiOutlineUser,
} from 'react-icons/ai';

const ROLE_CONFIG = {
  BUYER: {
    role: 'BUYER',
    title: 'Create Personal Account',
    subtitle: 'Shop local Ethiopian products with fast home delivery and order tracking.',
    badge: 'Shopper Account',
    badgeColor: 'bg-[#75d04b]/15 text-[#58a735] dark:text-[#75d04b] border border-[#75d04b]/30',
    primaryButton: 'Create your Ariiti account',
    next: '/my-dashboard',
    accentColor: '#75d04b',
    accentHover: '#66bb3f',
    benefits: [
      'Shop thousands of verified local Ethiopian items',
      'Track orders from seller preparation to your doorstep',
      'Direct messaging with shops and secure escrow checkout',
    ],
  },
  SELLER: {
    role: 'SELLER',
    title: 'Create Seller Central Account',
    subtitle: 'Start selling your products online to buyers across Ethiopia with zero upfront fees.',
    badge: 'Merchant Account',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    primaryButton: 'Register as Ariiti Seller',
    next: '/seller-registration',
    accentColor: '#f59e0b',
    accentHover: '#d97706',
    benefits: [
      'Reach thousands of ready shoppers in your city',
      'Automated courier dispatch & route fulfillment',
      'Direct payouts to CBE, Telebirr, and Awash Bank',
    ],
  },
  PROVIDER: {
    role: 'PROVIDER',
    title: 'Create Delivery Partner Account',
    subtitle: 'Earn flexible daily income delivering orders using your motorcycle, bike, or van.',
    badge: 'Driver Partner Account',
    badgeColor: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30',
    primaryButton: 'Join Delivery Network',
    next: '/provider-application',
    accentColor: '#0ea5e9',
    accentHover: '#0284c7',
    benefits: [
      'Flexible working schedule — drive when you want',
      'Guaranteed transparent compensation & 100% of customer tips',
      'Same-day and instant mobile wallet withdrawals',
    ],
  },
};

const SignUp = ({ registrationType = 'BUYER', from = null }) => {
  const [selectedRole, setSelectedRole] = useState(
    ROLE_CONFIG[registrationType] ? registrationType : 'BUYER'
  );
  const config = ROLE_CONFIG[selectedRole] || ROLE_CONFIG.BUYER;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user || {});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClose = () => {
    const safeFrom = getSafeRedirect(from, null);
    if (safeFrom) {
      navigate(safeFrom, { replace: true });
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleGoToLogin = () => {
    navigate('/login', {
      state: { from: getSafeRedirect(from, null), role: selectedRole },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      toast.error('Please agree to Ariiti Market Conditions of Use and Privacy Notice');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Passwords must be at least 6 characters');
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim(),
      city: city.trim() || 'Addis Ababa',
      registrationType: selectedRole,
    };

    try {
      await dispatch(registerUser(payload));
      toast.success('Account created successfully!');
      if (selectedRole === 'BUYER' && from) {
        const safeTarget = getSafeRedirect(from, config.next);
        navigate(safeTarget, { replace: true });
      } else {
        navigate(config.next, { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Registration failed. Please check your information.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-between py-8 px-4 sm:px-6">
      <div className="max-w-xl w-full mx-auto relative">
        {/* Top Header / Back Nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1 transition focus:outline-none"
            aria-label="Back to previous page"
          >
            <span aria-hidden="true">&larr;</span> Back
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">Ariiti Market Registration</span>
        </div>

        {/* Ariiti Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <BrandLogo size="lg" showText showTagline={false} tone="auto" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ethiopia&apos;s Connected Local Commerce Marketplace
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-t-2xl p-1.5 flex gap-1 shadow-xs">
          <button
            type="button"
            onClick={() => setSelectedRole('BUYER')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'BUYER'
                ? 'bg-[#75d04b] text-gray-950 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <AiOutlineUser size={15} />
            <span>Shopper</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('SELLER')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'SELLER'
                ? 'bg-amber-500 text-gray-950 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <AiOutlineShop size={15} />
            <span>Seller Central</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('PROVIDER')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'PROVIDER'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <AiOutlineCar size={15} />
            <span>Delivery Partner</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#141414] border-x border-b border-gray-200 dark:border-gray-800 rounded-b-2xl p-6 sm:p-8 shadow-sm">
          {/* Header & Role Badge */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {config.title}
              </h1>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${config.badgeColor}`}>
                {config.badge}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {config.subtitle}
            </p>
          </div>

          {/* Benefits summary list */}
          <div className="mb-6 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
            <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Account Highlights:
            </p>
            <ul className="space-y-1.5">
              {config.benefits.map((b, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <AiOutlineCheckCircle className="text-[#75d04b] flex-shrink-0" size={14} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="signup-name" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Your name / Business contact
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last name"
                required
                disabled={loading}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 outline-none transition"
              />
            </div>

            {/* Phone & City Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-phone" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    +251
                  </span>
                  <input
                    id="signup-phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="911 234 567"
                    required
                    disabled={loading}
                    className="w-full pl-12 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-city" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  City / Location
                </label>
                <select
                  id="signup-city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 outline-none transition cursor-pointer"
                >
                  <option value="">Select City (Default: Addis Ababa)</option>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Hawassa">Hawassa</option>
                  <option value="Adama">Adama (Nazret)</option>
                  <option value="Bahir Dar">Bahir Dar</option>
                  <option value="Dire Dawa">Dire Dawa</option>
                  <option value="Mekelle">Mekelle</option>
                  <option value="Bishoftu">Bishoftu</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 outline-none transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Passwords must be at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="signup-confirm-password" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Re-enter password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 outline-none transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-2">
              <label htmlFor="signup-agree" className="flex items-start gap-2.5 cursor-pointer">
                <input
                  id="signup-agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#75d04b]"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
                  By continuing, you agree to Ariiti Market&apos;s{' '}
                  <Link to="/contact" className="text-[#75d04b] hover:underline font-medium">
                    Conditions of Use
                  </Link>{' '}
                  and{' '}
                  <Link to="/contact" className="text-[#75d04b] hover:underline font-medium">
                    Privacy Notice
                  </Link>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: config.accentColor,
                color: selectedRole === 'PROVIDER' ? '#FFFFFF' : '#111111',
              }}
              className="w-full py-2.5 px-4 font-bold text-sm rounded-full shadow-sm hover:opacity-90 active:opacity-100 transition-all cursor-pointer disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating account...' : config.primaryButton}</span>
              <AiOutlineArrowRight size={16} />
            </button>
          </form>

          {/* Already have an account? Log in */}
          <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={handleGoToLogin}
                className="text-[#75d04b] hover:underline font-bold"
              >
                Log in &rarr;
              </button>
            </p>
          </div>
        </div>

        {/* Clean Ariiti Footer */}
        <div className="mt-8 text-center text-[11px] text-gray-500 dark:text-gray-400 space-y-2">
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="hover:underline hover:text-gray-900 dark:hover:text-white">
              Conditions of Use
            </Link>
            <Link to="/contact" className="hover:underline hover:text-gray-900 dark:hover:text-white">
              Privacy Notice
            </Link>
            <Link to="/contact" className="hover:underline hover:text-gray-900 dark:hover:text-white">
              Help
            </Link>
          </div>
          <p>© 2026, Ariiti Market, Inc. or its affiliates</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
