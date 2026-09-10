import React, { useState } from 'react'
import {AiOutlineEyeInvisible,AiOutlineEye} from "react-icons/ai"
import { Link } from 'react-router-dom'
import { useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { AuthLogin } from '../../assets'
import Store from '../../store/redux/store'
import { loadUser, loadSeller } from '../../store/redux/actions/user'

const Login = () => {

    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[visible,setVisible]=useState(false)
    const navigate=useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault()

        // ONE Aritii account, ONE session (single `token` cookie).
        // Every account signs in through the same customer endpoint; the user's
        // role (CUSTOMER or SELLER) is returned by the identity service after a
        // seller application is approved. We load the user profile, then route
        // by role — sellers into the Seller Center, buyers into their account.
        let user;
        try {
            const res = await api.post('/user/login-user', { email, password });
            user = res?.data?.user || null;
        } catch (e) {
            toast.error("Login failed. Please check your email and password.");
            return;
        }

        // Refresh the buyer store from the single cookie/session.
        await Store.dispatch(loadUser());

        // If this account is an approved seller (with a shop), load the seller
        // context from the same session and go to the Seller Center.
        if (user && (user.role === 'SELLER' || user.shopId)) {
            await Store.dispatch(loadSeller());
            toast.success("Welcome back!");
            navigate("/dashboard");
            return;
        }

        // Buyer account -> account dashboard.
        toast.success("Login successful!");
        navigate("/my-dashboard");
    }

    return (
        <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-brand-cream'>

            <div className='w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center'>

            <div className="hidden lg:flex justify-center">
                <img
                    src={AuthLogin}
                    alt="Welcome to Aritii Market"
                    className="w-full max-w-[480px] h-auto object-contain"
                    loading="lazy"
                />
            </div>

            <div>

            <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>

                <Link to="/">
                  <img
                    src="/aritii-logo.svg"
                    alt="Aritii Market"
                    className="h-[56px] w-auto object-contain mx-auto mb-4"
                  />
                </Link>

                <h2 className='mt-2 text-center text-3xl font-extrabold text-brand-primary'>
                    Welcome to Aritii Market
                </h2>
                <p className="mt-2 text-brand-muted">
                    Sign in to your account — customers and sellers use the same login.
                </p>

            </div>



            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-brand'>


                    <form onSubmit={handleSubmit} className='space-y-6' action='#' >



                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-brand-charcoal'>
                                Email address
                            </label>

                            <div className="mt-1">
                                <input type="email" name="email" autoComplete='email' required value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary sm:text-sm'/>
                            </div>
                        </div>





                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-brand-charcoal'>
                                Password
                            </label>

                            <div className="mt-1 relative">
                                <input type={visible? "text" : "password"}
                                 name="password" autoComplete='current-password' required value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary sm:text-sm'/>


                               {visible ? (
                                <AiOutlineEye
                                 className="absolute right-2 top-2 cursor-pointer"
                                 size={25}
                                 onClick={() => setVisible(false)}
                                />
                                 ) : (
                                 <AiOutlineEyeInvisible
                                  className="absolute right-2 top-2 cursor-pointer"
                                 size={25}
                                 onClick={() => setVisible(true)}
                                 />
                              )}
                            </div>



                        </div>




                        <div className="flex justify-between items-center">
                            <div className="flex items-center">

                                <input type="checkbox" name='remember-me' id='remember-me'
                                className='h-4 w-4 text-brand-primary border-gray-600 rounded'
                                />

                                <label htmlFor="remember-me"
                                className='ml-2 block text-sm text-brand-charcoal'
                                >
                                    Remember me
                                </label>

                            </div>

                            <a href=".forgot-password" className="text-sm text-brand-primary">
                                Forgot your password?
                            </a>


                        </div>


                        <div className='flex justify-center'>
                            <button type='submit'
                            className='bg-brand-primary w-80 text-white px-4 py-2 rounded-md hover:bg-brand-primary/90 focus:outline-none font-semibold'
                            >
                                Sign in
                            </button>
                        </div>



                        <div className='flex justify-start w-full'>
                              <h4 className="text-brand-charcoal">Don't have an account?</h4>
                              <Link to="/sign-up" className="ml-2 text-sm text-brand-primary hover:underline font-medium" >
                                Create your Aritii Account
                              </Link>
                        </div>

                        <div className='mt-6 flex items-center justify-center w-full border-t border-brand-border pt-3'>
                          <span className="text-sm text-brand-muted">Want to sell on Aritii?</span>
                          <Link to="/sell" className="ml-2 text-sm text-brand-primary hover:underline font-semibold">
                            Start Selling
                          </Link>
                        </div>

                    </form>

                </div>
            </div>

            </div>

            </div>

        </div>
    )
}

export default Login