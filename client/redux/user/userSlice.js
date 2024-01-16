import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    currentUser : null,
    loading: false,
    error: false,
}

const userSlice= createSlice({
    name: 'user',
    initialState,
    reducers:{
        signInStart : (state)=>{
            state.loading = true;
        },
        signInSuccess: (state, action)=>{
            state.currentUser= action.payload;
            state.loading= false;
            state.error= false;
        },
        signInFailure: (state, action)=>{
            state.loading= false;
            state.error= action.payload || {error: "failed to fetch"};
        },
        updateUserStart: (state) =>{
            state.loading = true;
        },
        updateUserSuccess: (state, action) =>{
            state.loading= false;
            state.error = false;
            state.currentUser= action.payload;
        },
        updateUserFailure: (state, action) =>{
            state.loading= false;
            state.error= action.payload || {error : "failed to fetch"}
        },
        deleteUserStart: (state) =>{
            state.loading = true;
        },
        deleteUserSuccess: (state) =>{
            state.loading= false;
            state.error = false;
            state.currentUser= null;
        },
        deleteUserFailure: (state, action) =>{
            state.loading= false;
            state.error= action.payload || {error : "failed to fetch"}
        },
        signOut: (state)=>{
            state.currentUser= null;
            state.error= false;
            state.loading= false;
        }
    }
})


export const {signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserSuccess, updateUserStart, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut} = userSlice.actions;
export default userSlice.reducer;