import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEyeInvisible, AiOutlineEye, AiOutlineArrowRight } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '@/store/slices/userThunks';
import { LOGO } from '@/assets';

const ROLE_CONFIG = {
  BUYER: {
    title: 'Create Buyer Account',
    description: 'Create your account and start shopping local.',
    next: '/my-dashboard',
    submit: 'Create Buyer Account',
    accent: '#75d04b',
    hint: null,
  },
  SELLER: {
    title: 'Create Seller Account',
    description: 'Create your account, then complete your Seller Application.',
    next: '/seller-registration',
    submit: 'Continue to Seller Application',
    accent: '#2f6e4f',
    hint: 'Seller access is enabled after your shop application is reviewed and approved.',
  },
  PROVIDER: {
    title: 'Create Delivery Provider Account',
    description: 'Create your account, then apply to join Aritii Delivery.',
    next: '/provider-application',
    submit: 'Continue to Provider Application',
    accent: '#2563eb',
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
    <main className="min-h-screen bg-[#FDF6EC] px-4 py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden min-h-full overflow-hidden bg-[#20305c] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-20" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #75d04b 0, transparent 40%), radial-gradient(circle at 85% 80%, #2563eb 0, transparent 38%)' }} />
          <Link to="/" className="relative inline-flex w-fit rounded-lg bg-white p-2">
            <img src={LOGO} alt="Aritii Market" className="h-10 w-auto" />
          </Link>
          <div className="relative">
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Aritii Market</span>
            <p className="text-3xl font-bold leading-tight">Local commerce, connected.</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">One trusted platform for shopping, growing a business, and getting orders delivered.</p>
          </div>
          <p className="relative text-xs text-white/60">Secure accounts · Local businesses · Connected delivery</p>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <Link to="/" className="mb-8 inline-flex lg:hidden">
            <img src={LOGO} alt="Aritii Market" className="h-10 w-auto" />
          </Link>
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
