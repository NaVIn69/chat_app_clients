import { Typography,AppBar,Box,Toolbar,IconButton, Tooltip, Backdrop } from '@mui/material'
import React, { Suspense, useState,lazy } from 'react'
import { orange } from "../../constants/color"
import { Menu as MenuIcon ,Search as SearchIcon,Add as AddIcon,Group as GroupIcon,Logout as LogoutIcon,Notifications as NotificationIcon } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../constants/config'
import { useDispatch, useSelector } from 'react-redux';
import { userNotExits } from '../../redux/reducers/auth';
import { toast } from 'react-hot-toast';
import { setIsMobile,setSelectedDeleteChat,setIsSearch,setIsNewgroup,setIsNotification } from '../../redux/reducers/misc';
import { Badge } from '@mui/material';
import { resetNotificationCount } from '../../redux/reducers/chat';


const SearchDialog  = lazy(()=>import("../specific/Search"))
const NotificationDialog =lazy(()=>import("../specific/Notifications"))
const NewGroupDialog =lazy(()=>import("../specific/NewGroup"))

const Header = () => {
  const {isSearch,isNewGroup,isNotification} =useSelector((state)=>state.misc);
  const { NotificationCount}= useSelector((state)=>state.chat);
  // console.log("notification count",NotificationCount)

   
  // const [isSearch ,setIsSearch] =useState(false);
  // const [isNewGroup ,setIsNewGroup] =useState(false);
  // const [isNotification ,setIsNotification] =useState(false);
  const dispatch = useDispatch()



    const navigate = useNavigate()

    const handleMobile = ()=>{
     dispatch(setIsMobile(true))
    }

    const openSearch = () =>{
        dispatch(setIsSearch(true))
    }

    const openNewGroup = ()=>{
        dispatch(setIsNewgroup(true))
    }
   
    const openNotification = ()=>{
        dispatch(setIsNotification(true));
        dispatch(resetNotificationCount());

    }
    const navigateToGroup = () =>navigate("/groups");

    const logoutHandler = async () =>{
        // console.log("Logout");
     try {
      const {data} = await axios.get(`${server}/api/v1/user/logout`,{
        withCredentials:true,
      })
      // console.log(data);
      dispatch(userNotExits())
      // here user ka state change ho gya hai , so user null ho gya hai , so jo protected
      // route hai usme user null hai to redirect ho jayega login page pe
      // here toast is used to show the message to the user like logout successfully
      toast.success(data.message)
      
     } catch (error) {
      // here we are seeing jo error aya response me , now response ke data ke message me 
      // dekh rhe hai ki server ne kya message bheja hai 
       toast.error(error?.response?.data?.message)
     }
    }

  return (
   <>
      <Box
      sx={{
        flexGrow:1
      }}
      height ={"4rem"}
      >
        <AppBar position ="static" sx={{
            bgcolor:orange,
        }} >

        <Toolbar>
        <Typography
        variant='h6'
        sx={{
            display:{xs:"none",sm :"block"},
        }}
        >chat App</Typography>    
        <Box
        sx={{
            display:{xs:"block",sm :"none"},
        }}
        >
        <IconButton color="inherit" onClick ={handleMobile} ><MenuIcon /></IconButton>
        </Box>
        <Box sx={{
            flexGrow:1,
        }} />
       <Box>
<IconBtn
title={'Search'}
icon ={<SearchIcon/>}
onClick ={openSearch}
/>

<IconBtn
title={'New Group'}
icon ={<AddIcon/>}
onClick ={openNewGroup}
/>

<IconBtn
title={'Mange Groups'}
icon ={<GroupIcon/>}
onClick ={navigateToGroup}
/>
<IconBtn
 title={'Notification'}
 icon={<NotificationIcon />}
  onClick={openNotification}
  value={NotificationCount}
/>
<IconBtn
title={'Logout'}
icon ={<LogoutIcon/>}
onClick ={logoutHandler}
/>


        </Box>

        </Toolbar>   
        </AppBar>
      </Box>
      {
        isSearch && (
            <Suspense fallback ={<Backdrop open />}>
                <SearchDialog />

            </Suspense>
        )
      }
      {
        isNotification && (
            <Suspense fallback ={<Backdrop open />}>
                <NotificationDialog />

            </Suspense>
        )
      }
      {
        isNewGroup && (
            <Suspense fallback ={<Backdrop open />}>
                <NewGroupDialog />

            </Suspense>
        )
      }
   </>
  )
}
const IconBtn =({ title,icon,onClick,value}) => {
    return (
        <Tooltip title={title}>
       < IconButton color="inherit" size ="large" onClick ={onClick} >
       {
        value ? (<Badge badgeContent={value} color={"error"}>{icon}</Badge>) : (icon)
       }
         
        </IconButton>

        </Tooltip>
    )
}

export default Header