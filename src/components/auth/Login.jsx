import React, { useState } from 'react'
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
import { MdOutlineEmail } from "react-icons/md"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'
import Store from '../../store/redux/store'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await api.post('/user/login-user', { email, password })
            const user = res?.data?.user || null

            if (!user) {
                toast.error("Login failed. No user data returned.")
                setLoading(false)
                return
            }

            Store.dispatch({
                type: "LoadUserSuccess",
                payload: user,
            })

            toast.success("Login successful!")

            if (user.sellerStatus === 'APPROVED') {
                navigate("/business/dashboard")
            } else {
                navigate("/")
            }
        } catch (e) {
            toast.error("Login failed. Please check your email and password.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <Link to="/">
                        <img
                            src="/aritii-logo.svg"
                            alt="Aritii Market"
                            className="h-12 w-auto mx-auto mb-6"
                        />
                    </Link>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>Welcome back</h1>
                    <p className="text-base text-gray-600">
                        Sign in to your Aritii account
                    </p>
                </div>

                {/* Form Card */}
                <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition'
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition'
                                />
                                <button
                                    type="button"
                                    onClick={() => setVisible(!visible)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                    className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500'
                                />
                                <span className='ml-2 text-sm text-gray-700'>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-semibold text-green-600 hover:text-green-700">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center'
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
                            <Link to="/sign-up" className="font-semibold text-green-600 hover:text-green-700">
                                Create account
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer Links */}
                <div className='mt-6 text-center'>
                    <p className="text-sm text-gray-600 mb-4">Want to sell on Aritii?</p>
                    <Link to="/sell" className="inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800">
                        Start selling →
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login