import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart,signInFailure, signInSuccess } from '../../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../Components/OAuth';

export default function SignIn() {
  const [formData, setFormData]= useState({});
  const {loading, error}= useSelector((state)=>state.user);
  const navigate= useNavigate();
  const dispatch= useDispatch()

  const handleChange= (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit= async (e) =>{
    e.preventDefault();
    try{
      dispatch(signInStart())
      const res= await fetch('/api/auth/signin',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
  
      const data= await res.json();
      console.log(data);
      if(res.status!=200){
        dispatch(signInFailure(data))
      }else{
        navigate('/')
        dispatch(signInSuccess(data))
      }

    }catch(err){
      dispatch(signInFailure());
      console.log(err);
    }

  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* <input type="text" placeholder='Username' id='username' onChange={handleChange} className="bg-slate-100 rounded-lg p-3" /> */}
        <input type="email" placeholder='Email' id='email' onChange={handleChange} className="bg-slate-100 rounded-lg p-3" />
        <input type="password" placeholder='password' id='password' onChange={handleChange} className="bg-slate-100 rounded-lg p-3" />
        <button disabled={loading} type='submit' className="p-3 mt-3 uppercase bg-slate-700 text-white rounded-lg hover:opacity-95">{loading? "Loading...":"Sign In"}</button>
        <OAuth/>
      </form>
      {error && (
        <div className="text-red-500">{error.error || "Something went wrong"}</div>
      )}
      <div className="flex gap-2 mt-5">
        <p>Don't have an account ?</p>
        <Link to='/signup'>
          <span className='text-blue-500'>Sign Up</span>
        </Link>
      </div>
    </div>
  )
}

