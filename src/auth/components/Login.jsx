import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
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
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-white dark:bg-gray-900">
            <div className='w-full max-w-[450px]'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <Link to="/">
                        <img
                            src={LOGO}
                            alt="Aritii Market"
                            className="h-12 w-auto mx-auto mb-6"
                        />
                    </Link>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white dark:text-white mb-2'>Welcome back</h1>
                    <p className="text-base text-gray-600">
                        One shared Login for Buyers, Sellers, and Delivery Providers.
                    </p>
                </div>

                {/* Form Card */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
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
                                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition disabled:bg-gray-50 disabled:cursor-not-allowed'
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
                                    className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition disabled:bg-gray-50 disabled:cursor-not-allowed'
                                />
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setVisible(!visible)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
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
                                    className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-[#75d04b]/25 disabled:cursor-not-allowed'
                                />
                                <span className='ml-2 text-sm text-gray-700'>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-semibold font-semibold text-[#75d04b] hover:text-[#5ac12f]">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-[#75d04b] hover:brightness-95 text-white font-semibold rounded-full py-3 transition-all duration-200 flex items-center justify-center'
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                        {/* Sign Up Link */}
                        <p className="text-center text-gray-600">
                            Need an account?{' '}
                            <Link to={{ pathname: getRegistrationPath(location.state?.from), state: location.state }} className="font-semibold text-[#75d04b] hover:text-[#5ac12f]">
                                {getRegistrationLabel(location.state?.from)}
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer Links */}
                
            </div>
        </div>
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
