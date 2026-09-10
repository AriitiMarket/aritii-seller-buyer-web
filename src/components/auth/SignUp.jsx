import React, { useState } from 'react'
import {AiOutlineEyeInvisible,AiOutlineEye} from "react-icons/ai"
import { Link } from 'react-router-dom'
import {RxAvatar} from "react-icons/rx"
import api from '../../services/api'
import { useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthRegister } from '../../assets'


const SignUp = () => {

     const navigate = useNavigate()

    const[name,setName]=useState('')
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[visible,setVisible]=useState(false)
    const[avatar,setAvatar]=useState(null)



    const handleSubmit = (e) => {

        

    e.preventDefault()  // prevents the default form submission behavior, which would cause a page reload. We want to handle the submission with JavaScript instead.
    
    const newForm = new FormData(); // FormData lets you send files + text together
    newForm.append("file", avatar)
    newForm.append("name", name)
    newForm.append("email", email)
    newForm.append("password", password)

    console.log("Submitting signup form", { name, email, password, avatar })

    api.post('/user/create-user', newForm) // let browser set multipart boundary
    .then((res) => {                                   // runs if request is successful
        console.log(res.data) 
        navigate("/login")                             // logs the response from backend

        toast.success("Registration successful!.")
    
        
        //after successful registration empty the firlds:
        setName('')
        setEmail('')
        setPassword('')
        setAvatar(null)
    })
    .catch((error) => {                                // runs if request fails
        console.log(error)                             // logs the error
        toast.error("Registration failed. Please try again.")
    })                                                
}




    const handleFileInputChange=(e)=>{
        const file=e.target.files[0];
        setAvatar(file)
    }



    return (
        <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-brand-cream'>

            <div className='w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center'>

            <div className="hidden lg:flex justify-center">
                <img
                    src={AuthRegister}
                    alt="Join Aritii Market"
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
                    Create your Aritii Account
                </h2>
                <p className="mt-2 text-brand-muted">
                    Join Aritii Market to discover products, manage your orders, and become a seller whenever you're ready.
                </p>

            </div>



            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-brand'>


                    <form className='space-y-6' action='#' onSubmit={handleSubmit} >


                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-brand-charcoal'>
                                Full name
                            </label>

                            <div className="mt-1">
                                <input type="text" name="text" autoComplete='text' required value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:border-brand-primary sm:text-sm'/>
                            </div>
                        </div>
                        
                        
                        
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-brand-charcoal'>
                                Email address
                            </label>

                            <div className="mt-1">
                                <input type="email" name="email" autoComplete='email' required value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:border-brand-primary sm:text-sm'/>
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
                                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:border-brand-primary sm:text-sm'/>

                                
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


                    

                        {/* div for file upload */}
                        <div>
                            <label htmlFor="avatar"
                            className='block text-sm font-medium text-brand-charcoal'>

                            </label>

                            <div className='mt-2 flex items-center'>
                                <span className='inline-block h-8 w-8 rounded-full overflow-hidden'>
                                    
                                        {avatar ? (
                                            <img
                                                src={URL.createObjectURL(avatar)}
                                                alt="avatar"
                                                className="h-full w-full object-cover rounded-full"
                                            />
                                            ) : (
                                            <RxAvatar className="h-8 w-8" />
                                            )}
                                </span>

                                <label htmlFor="file-input"
                                className='ml-5 flex items-center justify-center px-4 py-2 border-gray-300 text-sm text-gray-700 bg-white'>
                                        <span>Upload a file</span>
                                        <input type="file" name="avatar" accept='.jpg,.jpeg,.png' id="file-input" onChange={handleFileInputChange} 
                                        className='sr-only'
                                        />
                                </label>
                            </div>
                        </div>






                        
                        <div className='flex justify-center'>
                            <button type='submit'
                            className='bg-brand-primary w-80 text-white px-4 py-2 rounded-md hover:bg-brand-primary/90 focus:outline-none font-semibold '
                            >
                                Sign up
                            </button>
                        </div>



                        <div className='flex justify-start w-full'>
                              <h4 className="text-brand-charcoal">Already have an account?</h4>
                              <Link to="/login" className="ml-2 text-sm text-brand-primary hover:underline font-medium" >
                                Sign in
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

export default SignUp