import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../Components/OAuth';

export default function SignUp() {
  const [formData, setFormData]= useState({});
  const [loading, setLoading]= useState(false);
  const [error, setError]= useState(false);
  const [validCred, setValidCred]= useState(true);

  const navigate= useNavigate();

  const handleChange= (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit= async (e) =>{
    e.preventDefault();
    try{
      setValidCred(true);
      setError(false);
      setLoading(true);
      const res= await fetch('/api/auth/signup',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
  
      const data= await res.json();
      setLoading(false);
      console.log(data);
      if(!data.success){
        // setError(true);
        setValidCred(false);
      }else{
        navigate('/signin')
      }

    }catch(error){
      setLoading(false);
      setError(true);
    }

  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder='Username' id='username' onChange={handleChange} className="bg-slate-100 rounded-lg p-3" />
        <input type="email" placeholder='Email' id='email' onChange={handleChange} className="bg-slate-100 rounded-lg p-3" />
        <input type="password" placeholder='password' id='password' onChange={handleChange} className="bg-slate-100 rounded-lg p-3" />
        <button disabled={loading} type='submit' className="p-3 mt-3 uppercase bg-slate-700 text-white rounded-lg hover:opacity-95">{loading? "Loading...":"Sign Up"}</button>
        <OAuth/>
      </form>
      {!validCred && (
        <div className="text-red-500">User already exists</div>
      )}
      {error && (
        <div className="text-red-500">Something went wrong</div>
      )}
      <div className="flex gap-2 mt-5">
        <p>Already have an account ?</p>
        <Link to='/signin'>
          <span className='text-blue-500'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}
