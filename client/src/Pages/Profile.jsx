import {React, useEffect, useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from '../../redux/user/userSlice';

export default function Profile() {
  const navigate= useNavigate();
  const {currentUser, loading, error}= useSelector(state => state.user);
  const fileRef= useRef(null);
  const [image, setImage]= useState(undefined);
  const [imageError, setImageError]= useState(false);
  const [formData, setFormData]= useState({});
  const [imageProgress, setImageProgress]= useState(0);
  const [updateSuccess, setUpdateSuccess]= useState(false);
  const dispatch= useDispatch();
  console.log(imageProgress);
  const fileUpload= async (image)=>{
    const storage= getStorage(app);
    console.log(image);
    const filename= new Date().getTime() + image.name;
    const storageRef= ref(storage, filename);
    const uploadTask= uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) =>{
        const progress= Math.floor((snapshot.bytesTransferred / snapshot.totalBytes)* 100);
        setImageProgress(progress); 
      },
      (error)=> {
        setImageError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
          setFormData({...formData, photo: downloadUrl});
        })
      }
    )
  }

  useEffect(()=>{
    fileUpload(image);
  },[image])

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit =async (e) =>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res= await fetch(`/api/user/update/${currentUser._id}`, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data= await res.json();
      console.log(data);
      if(res.status!=200){
        dispatch(updateUserFailure(data))
      }else{
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      }
    }catch(err){
      dispatch(updateUserFailure());
      console.log(err);
    }
  }

  const handleDeleteAccount = async (e)=>{
    e.preventDefault();
    try{
      dispatch(deleteUserStart());
      const res= await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      });
      const data= await res.json();
      if(res.status!=200){
        dispatch(deleteUserFailure(data))
      }else{
        dispatch(deleteUserSuccess());
        navigate('/');
      }

    }catch(error){
      dispatch(deleteUserFailure());
      console.log(error);
    }
  }

  const handleSignOut= async (e)=>{
    e.preventDefault();
    try{
      await fetch('/api/auth/signout',{
        method: 'GET',
      });
      dispatch(signOut());
    }
    catch(error){
      console.log(error);
    }
  }
  
  console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e)=>{setImage(e.target.files[0])}}/>
        <img src={currentUser.photo} alt="" onClick={()=>{ fileRef.current.click() }} className="h-24 w-24 mt-2 self-center cursor-pointer rounded-full object-cover" />
        <p className="self-center text-sm">
          {imageError? 
            <span className="text-red-700">Error uploading image !</span> 
            : (imageProgress>0 && imageProgress<100) ?
                 <span className='text-slate-700'>{`Uploading image ... ${imageProgress} %`}</span> 
                 : imageProgress===100 ? <span className='text-green-500'>Uploaded successfully</span>
                      : ""}
        </p>
        <input type="text" onChange={handleChange} id="username" placeholder='Username' defaultValue={currentUser.username} className="bg-slate-100 p-3 rounded-lg" />
        <input type="email" onChange={handleChange} id="email" placeholder='Email' defaultValue={currentUser.email} className="bg-slate-100 p-3 rounded-lg" />
        <input type="password" onChange={handleChange} id="password" placeholder='Password' className="bg-slate-100 p-3 rounded-lg" />
        <button type="submit" disabled={loading} className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading? "Loading...": "Update"}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteAccount} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
        <p className="text-md mt-4 text-center font-bold text-red-700">{error && "Something went wrong !"}</p>
        <p className="text-md mt-4 text-center font-bold text-green-700">{updateSuccess && "User updated successfully :)"}</p>
    </div>
  )
}
