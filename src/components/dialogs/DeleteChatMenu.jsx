
import React,{useEffect} from 'react'
import { Menu,Stack, Typography ,} from '@mui/material'
import { useSelector } from 'react-redux';
import {setIsDeleteMenu} from "../../redux/reducers/misc"
import {ExitToApp as ExitToAppIcon,Delete as DeleteIcon} from "@mui/icons-material"
import {useNavigate} from "react-router-dom"
import { useAsyncMutation } from '../../hooks/hook';
import { useDeleteChatMutation,useLeavegroupMutation } from '../../redux/api/api';

 const DeleteChatMenu = ({dispatch,deleteMenuAnchor}) => {

    const {isDeleteMenu,selectedDeleteChat} = useSelector((state)=>state.misc);

    const isGroup=selectedDeleteChat.groupChat   

    const navigate=useNavigate();

    const [deleteChat, ,deleteChatdata] = useAsyncMutation(useDeleteChatMutation);
    const[LeaveGroup, ,leaveGroupData] =useAsyncMutation(useLeavegroupMutation);
 
    const closeHandler = () =>{

    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current=null;
    //  jo bhi chatdelete ho rha hai uks anchore null kr denge
   };  


   const leaveGroupHandler = () =>{
    closeHandler();
       LeaveGroup("Leaving Group...",selectedDeleteChat.chatId)
   }

   const deleteChatHandler= ()=>{
    
    closeHandler();
    deleteChat("deleting Chat...",selectedDeleteChat.chatId);

   }
 useEffect(()=>{

   if(deleteChatdata || leaveGroupData) navigate("/")

 },[deleteChatdata,leaveGroupData])

  return (
   <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor.current}
     anchorOrigin={{
         vertical:"bottom",
         horizontal:"right",
     }}
     transformOrigin={{
        vertical:"center",
        horizontal:"center",
     }}
   >
      <Stack
      sx={{
        width:"10rem",
        padding:"0.5rem",
        cursor:"pointer",
      }}
      direction={"row"}
      alignItems={"center"}
      spacing={"0.5rem"}
      onClick={isGroup?leaveGroupHandler:deleteChatHandler}
      >
    {
        selectedDeleteChat.groupChat ? 
        (<> <ExitToAppIcon/> <Typography>Leave Group</Typography> </>)
        :(<><DeleteIcon/><Typography>Delete Chat</Typography></>)
    }

      </Stack>
   </Menu>
  )
}

export default DeleteChatMenu
