import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineEyeInvisible, AiOutlineEye, AiOutlineArrowRight } from "react-icons/ai"
import { MdOutlineEmail } from "react-icons/md"
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginUser } from '@/store/slices/userThunks'
import { authService } from '@/services'
import { LOGO } from '@/assets'

const Login = () => {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.user)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const result = await dispatch(loginUser(identifier.trim(), password))
            toast.success("Login successful!")

            // Preserve the public entry path so an existing account can
            // continue the Buyer, Seller, or Delivery Provider action they chose.
            const from = location.state?.from
            if (from && from !== '/login') {
                navigate(from, { replace: true })
                return
            }
            // Identity resolves the account's actual role. A pending seller or
            // provider is directed to their application status by that role.
            const destination = await authService.loginDestination(result.loginRole)
            navigate(destination, { replace: true })
        } catch (err) {
            const data = err?.response?.data
            const status = err?.response?.status
            if (status === 403 || data?.error === 'role_mismatch') {
                toast.error(data?.message || 'These credentials do not match an account with access.')
            } else {
                toast.error(data?.message || err?.message || "Login failed. Please check your email or phone and password.")
            }
        }
    }

    return (
        <main className="min-h-screen bg-[#FDF6EC] px-3 py-5 sm:px-5 sm:py-9 lg:px-6 lg:py-12">
            <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:grid-cols-[0.95fr_1.05fr]">
                <aside className="relative overflow-hidden bg-[#20305c] p-5 text-white sm:p-8 lg:flex lg:min-h-full lg:flex-col lg:justify-between lg:p-10">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" aria-hidden="true" />
                    <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#75d04b]/10 blur-2xl" aria-hidden="true" />
                    <Link to="/" className="relative inline-flex w-fit rounded-xl bg-white p-2.5 shadow-sm">
                        <img src={LOGO} alt="Aritii Market home" className="h-9 w-auto" />
                    </Link>

                    <div className="relative mt-7 lg:mt-12">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                            <span className="h-2 w-2 rounded-full bg-[#75d04b]" aria-hidden="true" />
                            Your local marketplace
                        </span>
                        <h2 className="mt-4 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">
                            One account. Your place in Aritii.
                        </h2>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
                            Sign in once to continue shopping, manage your business, or deliver with Aritii Market.
                        </p>

                        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#75d04b] text-[#20305c] shadow-lg shadow-black/10" aria-hidden="true">
                                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3 4.5 6v5.5c0 4.4 3.2 7.6 7.5 9.5 4.3-1.9 7.5-5.1 7.5-9.5V6L12 3Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </span>
                            <div>
                                <p className="text-sm font-bold text-white">Secure shared Login</p>
                                <p className="mt-0.5 text-xs leading-5 text-white/70">Your approved access is linked to your account.</p>
                            </div>
                        </div>
                    </div>

                    <p className="relative mt-7 text-xs text-white/55 lg:mt-10">Shop local · Grow your business · Deliver with care</p>
                </aside>

                <section className="p-6 sm:p-10 lg:p-12">
                    <div className="mb-8">
                        <span className="mb-3 inline-flex rounded-full bg-[#75d04b]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4a8f28]">Aritii Market Account</span>
                        <h1 className="text-3xl font-extrabold text-[#20305c]">Welcome back</h1>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Use the same Login for Buyers, Sellers, and Delivery Providers.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white sm:p-1">
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Email Field */}
                        <div>
                            <label htmlFor='login-identifier' className='block text-sm font-semibold text-gray-700 mb-2'>
                                Email or phone number
                            </label>
                            <div className="relative">
                                <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                <input
                                    type="text"
                                    name="identifier"
                                    id="login-identifier"
                                    autoComplete='username'
                                    required
                                    disabled={loading}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="you@example.com or +251…"
                                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 transition disabled:bg-gray-50 disabled:cursor-not-allowed'
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    autoComplete='current-password'
                                    required
                                    disabled={loading}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 transition disabled:bg-gray-50 disabled:cursor-not-allowed'
                                />
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setVisible(!visible)}
                                    aria-label={visible ? 'Hide password' : 'Show password'}
                                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b] disabled:cursor-not-allowed"
                                >
                                    {visible ? (
                                        <AiOutlineEye size={20} />
                                    ) : (
                                        <AiOutlineEyeInvisible size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name='remember-me'
                                    id='remember-me'
                                    disabled={loading}
                                    className='h-4 w-4 rounded border-gray-300 text-[#5ac12f] focus:ring-2 focus:ring-[#75d04b]/25 disabled:cursor-not-allowed'
                                />
                                <span className='ml-2 text-sm text-gray-700'>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-semibold text-[#4a8f28] hover:text-[#20305c]">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='flex w-full items-center justify-center gap-2 rounded-full bg-[#75d04b] py-3.5 font-bold text-white transition hover:bg-[#5ac12f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#75d04b]/30 disabled:cursor-wait disabled:opacity-60'
                        >
                            {loading ? 'Signing in…' : <>Sign in <AiOutlineArrowRight aria-hidden="true" /></>}
                        </button>

                        {/* Sign Up Link */}
                        <p className="pt-2 text-center text-sm text-gray-600">
                            Need an account?{' '}
                            <Link to={{ pathname: getRegistrationPath(location.state?.from), state: location.state }} className="font-bold text-[#20305c] underline decoration-[#75d04b] decoration-2 underline-offset-4 hover:text-[#4a8f28]">
                                {getRegistrationLabel(location.state?.from)}
                            </Link>
                        </p>
                    </form>
                    </div>
                    <p className="mt-5 text-center text-xs text-gray-500">Aritii Market uses your account’s approved role to route you to the right workspace.</p>
                </section>
            </div>
        </main>
    )
}

function getRegistrationPath(from = '') {
    if (from.startsWith('/seller') || from.startsWith('/become-a-seller') || from.startsWith('/sell')) return '/seller-sign-up'
    if (from.startsWith('/provider') || from.startsWith('/delivery') || from.startsWith('/become-provider')) return '/delivery-sign-up'
    return '/sign-up'
}

function getRegistrationLabel(from = '') {
    if (getRegistrationPath(from) === '/seller-sign-up') return 'Start a Seller Application'
    if (getRegistrationPath(from) === '/delivery-sign-up') return 'Apply as a Delivery Provider'
    return 'Create a Buyer Account'
}

export default Login
