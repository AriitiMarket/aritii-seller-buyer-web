import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
import { MdOutlineEmail } from "react-icons/md"
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginUser, loadSeller } from '@/store/slices/userThunks'
import Store from '@/store'
import { LOGO } from '@/assets'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { loading, user, error } = useSelector((state) => state.user)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await dispatch(loginUser(email, password))

            toast.success("Login successful!")

            // Seller capability already resolved inside loginUser thunk
            const isSeller = Store.getState()?.seller?.isSeller
            // Guards (SellerRegistrationGuard, ProtectedRoute) stash where the
            // visitor was heading — e.g. /seller-registration. Honour it so a
            // "Sell on Ariiti" click doesn't dump them on the dashboard.
            const from = location.state?.from
            navigate(from && from !== '/login' ? from : (isSeller ? "/business" : "/my-dashboard"))
        } catch (err) {
            toast.error(err?.message || "Login failed. Please check your email and password.")
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
                        Sign in to your Aritii account
                    </p>
                </div>

                {/* Form Card */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Email Field */}
                        <div>
                            <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
                                Email address
                            </label>
                            <div className="relative">
                                <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete='email'
                                    required
                                    disabled={loading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
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

                        {/* Divider */}
                        <div className='relative my-6'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-200'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white text-gray-500'>Or continue with</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link to={{ pathname: '/sign-up', state: location.state }} className="font-semibold font-semibold text-[#75d04b] hover:text-[#5ac12f]">
                                Create account
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer Links */}
                
            </div>
        </div>
    )
}

export default Login
