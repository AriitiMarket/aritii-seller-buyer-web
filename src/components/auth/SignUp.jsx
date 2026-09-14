import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
import { MdOutlineEmail } from "react-icons/md"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerUser } from '../../store/redux/actions/user'
import { RxAvatar } from "react-icons/rx"

const SignUp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.user)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)
    const [avatar, setAvatar] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        if (avatar) {
            formData.append("file", avatar)
        }
        formData.append("name", name)
        formData.append("email", email)
        formData.append("password", password)

        try {
            await dispatch(registerUser(formData))
            navigate("/login")
            toast.success("Registration successful! Please log in.")

            setName('')
            setEmail('')
            setPassword('')
            setAvatar(null)
        } catch (error) {
            toast.error(error?.message || "Registration failed. Please try again.")
        }
    }

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        setAvatar(file)
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
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>Create account</h1>
                    <p className="text-base text-gray-600">
                        Join Aritii Market to buy, sell, and discover amazing products
                    </p>
                </div>

                {/* Form Card */}
                <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Name Field */}
                        <div>
                            <label htmlFor='name' className='block text-sm font-semibold text-gray-700 mb-2'>
                                Full name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete='name'
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition'
                            />
                        </div>

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
                                    autoComplete='new-password'
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

                        {/* Avatar Upload */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-3'>
                                Profile picture (optional)
                            </label>
                            <div className='flex items-center gap-4'>
                                <div className='relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0'>
                                    {avatar ? (
                                        <img
                                            src={URL.createObjectURL(avatar)}
                                            alt="avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <RxAvatar className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>
                                <label htmlFor="file-input" className='flex-1'>
                                    <div className='relative px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition'>
                                        <span className='text-sm font-medium text-gray-600'>Upload photo</span>
                                        <input
                                            type="file"
                                            name="avatar"
                                            accept='.jpg,.jpeg,.png'
                                            id="file-input"
                                            onChange={handleFileInputChange}
                                            className='sr-only'
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center mt-6'
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>

                        {/* Divider */}
                        <div className='relative my-6'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-200'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white text-gray-500'>Already have an account?</span>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <p className="text-center text-gray-600">
                            <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">
                                Sign in instead
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer Links */}
                <div className='mt-6 text-center'>
                    <p className="text-sm text-gray-600 mb-4">Ready to start selling?</p>
                    <Link to="/sell" className="inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800">
                        Become a seller →
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignUp