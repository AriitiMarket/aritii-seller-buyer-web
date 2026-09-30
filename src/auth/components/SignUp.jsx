import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEyeInvisible, AiOutlineEye, AiOutlineArrowRight } from 'react-icons/ai';
import { FaShoppingBasket, FaStore, FaTruck } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '@/store/slices/userThunks';
import { LOGO } from '@/assets';

const ROLE_CONFIG = {
  BUYER: {
    title: 'Create Buyer Account',
    description: 'Create your account and start shopping local.',
    actorIcon: FaShoppingBasket,
    actorLabel: 'Marketplace',
    eyebrow: 'For the curious shopper',
    heroTitle: 'Find something made for you.',
    heroCopy: 'Discover local makers, everyday essentials, and offers from shops across Ethiopia.',
    benefits: ['Discover local shops', 'Save your favorites', 'Track every order'],
    next: '/my-dashboard',
    submit: 'Create Buyer Account',
    accent: '#75d04b',
    hint: null,
  },
  SELLER: {
    title: 'Create Seller Account',
    description: 'Create your account, then complete your Seller Application.',
    actorIcon: FaStore,
    actorLabel: 'Seller community',
    eyebrow: 'For local businesses',
    heroTitle: 'Bring your business to more customers.',
    heroCopy: 'Build your storefront, manage orders, and grow with a marketplace made for local sellers.',
    benefits: ['Create your shop profile', 'Manage orders and products', 'Get reviewed before seller access'],
    next: '/seller-registration',
    submit: 'Continue to Seller Application',
    accent: '#2f6e4f',
    hint: 'Seller access is enabled after your shop application is reviewed and approved.',
  },
  PROVIDER: {
    title: 'Create Delivery Provider Account',
    description: 'Create your account, then apply to join Aritii Delivery.',
    actorIcon: FaTruck,
    actorLabel: 'Delivery network',
    eyebrow: 'For delivery providers',
    heroTitle: 'Help local orders reach every door.',
    heroCopy: 'Join a growing delivery network connecting neighborhood shops with customers.',
    benefits: ['Apply as a delivery provider', 'Share your service details', 'Get reviewed before provider access'],
    next: '/provider-application',
    submit: 'Continue to Provider Application',
    accent: '#20305c',
    hint: 'Provider access is enabled after your delivery application is reviewed and approved.',
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
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { name: name.trim(), email: email.trim(), password };
    if (role !== 'BUYER') payload.registrationType = role;

    try {
      await dispatch(registerUser(payload));
      if (role === 'BUYER') {
        toast.success('Buyer account created. Welcome to Aritii Market!');
        navigate(config.next, { replace: true });
        return;
      }

      toast.success(`Account created. Continue with your ${role === 'SELLER' ? 'Seller' : 'Delivery Provider'} application.`);
      navigate(config.next, {
        replace: true,
        state: { from: config.next, isNewRegistration: true, registrationType: role },
      });
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
      const status = error?.response?.status;
      if (status === 409 || /already exists|duplicate/i.test(message)) {
        toast.error('An account with these details already exists. Use the shared Login to continue.');
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF6EC] px-3 py-5 sm:px-5 sm:py-9 lg:px-6 lg:py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative overflow-hidden bg-[#20305c] p-4 text-white sm:p-6 lg:flex lg:min-h-full lg:flex-col lg:justify-between lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: config.accent }} aria-hidden="true" />
          <Link to="/" className="relative inline-flex w-fit rounded-xl bg-white p-2.5 shadow-sm">
            <img src={LOGO} alt="Aritii Market home" className="h-9 w-auto" />
          </Link>
          <div className="relative mt-4 min-h-44 overflow-hidden rounded-2xl border border-white/15 p-5 shadow-lg sm:min-h-52 sm:p-7" style={{ background: `linear-gradient(135deg, ${config.accent} 0%, #20305c 72%)` }}>
            <div className="pointer-events-none absolute -right-7 -top-12 h-48 w-48 rounded-full border-[24px] border-white/5" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-white/5" aria-hidden="true" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-md">
                <img src={LOGO} alt="" className="h-full w-full object-contain" />
              </span>
              <div>
                <p className="text-sm font-extrabold tracking-wide text-white">Aritii Market</p>
                <p className="text-xs font-medium text-white/70">{config.actorLabel}</p>
              </div>
            </div>
            <div className="relative mt-5 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[#a4ee83] shadow-inner sm:h-16 sm:w-16">
                <config.actorIcon size={29} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Your place in Aritii</p>
                <p className="mt-1 text-lg font-extrabold leading-tight text-white sm:text-xl">{config.eyebrow}</p>
              </div>
            </div>
            <div className="relative mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/15" aria-hidden="true">
              <div className="h-full w-2/3 rounded-full bg-[#75d04b]" />
            </div>
          </div>
          <div className="relative mt-5 lg:mt-7">
            <span className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/90">
              {config.eyebrow}
            </span>
            <p className="text-2xl font-extrabold leading-tight sm:text-3xl">{config.heroTitle}</p>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">{config.heroCopy}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${config.eyebrow} benefits`}>
              {config.benefits.map((benefit) => (
                <li key={benefit} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
                  <span className="mr-1.5 text-[#8fe16b]" aria-hidden="true">✓</span>{benefit}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-7">
            <span className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ color: config.accent, backgroundColor: `${config.accent}18` }}>
              {role === 'PROVIDER' ? 'Delivery Provider' : role[0] + role.slice(1).toLowerCase()} Registration
            </span>
            <h1 className="text-2xl font-extrabold text-[#20305c] sm:text-3xl">{config.title}</h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">{config.description}</p>
            {config.hint && (
              <p className="mt-4 rounded-xl border px-4 py-3 text-sm leading-5" style={{ color: config.accent, borderColor: `${config.accent}40`, backgroundColor: `${config.accent}0d` }}>
                {config.hint}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-gray-700">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                minLength={2}
                required
                disabled={loading}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={visible ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setVisible((current) => !current)}
                  disabled={loading}
                  aria-label={visible ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
                >
                  {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
              style={{ backgroundColor: config.accent }}
            >
              {loading ? 'Creating account…' : config.submit}
              {!loading && <AiOutlineArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" state={{ from: location.state?.from || (role === 'SELLER' ? '/seller-registration' : role === 'PROVIDER' ? '/provider-application' : undefined) }} className="font-bold text-[#20305c] underline underline-offset-2 hover:text-[#75d04b]">
              Use the shared Login
            </Link>
          </p>
          <p className="mt-3 text-center text-xs text-gray-500">One Login works for Buyers, Sellers, and Delivery Providers.</p>
        </section>
      </div>
    </main>
  );
};

export default SignUp;
