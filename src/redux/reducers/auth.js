import { createSlice } from "@reduxjs/toolkit";
import { adminLogin,getAdmin,adminLogout } from "../thunks/admin";
import {toast} from "react-hot-toast"

const initialState = {
  user: null,
  isAdmin: false,
  loader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExits: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExits: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
  extraReducers:(builder)=>{
    // fullfilled pe first wla function chalge 
    // and rejected pe 2nd wala value chalega

    builder
    .addCase(adminLogin.fulfilled,(state,action)=>{
      state.isAdmin=true;
     toast.success(action.payload);
    })
    .addCase(adminLogin.rejected,(state,action)=>{
      state.isAdmin=false;
      // console.log(action);
     toast.error(action.error.message);
    })
    .addCase(getAdmin.fulfilled,(state,action)=>{
      if(action.payload){
      state.isAdmin=true;
      }else{
        state.isAdmin=false;
      }
      // console.log(action);
    //  toast.success(action.payload);
    })
    .addCase(getAdmin.rejected,(state,action)=>{
      state.isAdmin=false;
      // console.log(action);
     toast.error(action.error.message);
    })
    .addCase(adminLogout.fulfilled,(state,action)=>{
      state.isAdmin=false;
     toast.success(action.payload);
    })
    .addCase(adminLogout.rejected,(state,action)=>{
      state.isAdmin=true;
      // console.log(action);
     toast.error(action.error.message);
    })
  },

});

export default authSlice.reducer;
export const { userExits, userNotExits } = authSlice.actions;
