// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios"
// import {server} from "../../constants/config"

// const adminLogin=createAsyncThunk("admin/verify",async (secretKey)=>{
   
// console.log("secretKey from thunk admin",secretKey)
//     try {
//         const config={
//             withCredentials: true,
//             headers:{
//                 "Content-Type": "application/json",
//             },
//           }  
//            console.log(`${server}/api/v1/admin/verify`)
//           const {data} =await axios.post(`${server}/api/v1/verify`,{secretKey},config);
//           console.log(data);
        
//           return data.message
        
//     } catch (error) {
//         console.log(error.response.data);
//         throw error.response.data.message;
//     }
    
// }
// )

// export { adminLogin } 

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constants/config";

 const adminLogin = createAsyncThunk(
    "admin/verify",
    async (secretKey, { rejectWithValue }) => {
        try {
            const config = {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            };

            const response = await axios.post(
                `${server}/api/v1/admin/verify`,
                { secretKey },
                config
            );

            if (!response.data) {
                return rejectWithValue("No data received from server");
            }

            return response.data.message;
        } catch (error) {
            // console.error("Admin login error:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to login as admin"
            );
        }
    }
);
const getAdmin = createAsyncThunk(
    "admin/getAdmin",
    async () => {
        try {
            const response = await axios.get(
                `${server}/api/v1/admin/`,
                { withCredentials: true }
            );
            return response?.data?.admin;
        } catch (error) {
            // console.error("Admin Getdata error:", error);
            throw error.response?.data?.message || "Failed to Get data";
        }
    }
);

const adminLogout = createAsyncThunk(
    "admin/logout",  // Changed from "admin/getAdmin" to avoid name conflict
    async () => {
        try {
            const response = await axios.get(
                `${server}/api/v1/admin/logout`,  // Added /logout to match your route
                { withCredentials: true }
            );
            return response.data.message;
        } catch (error) {
            // console.error("Admin logout error:", error);
            throw error.response?.data?.message || "Failed to logout";
        }
    }
);

export { adminLogin, getAdmin, adminLogout };