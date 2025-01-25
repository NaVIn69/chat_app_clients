import { useInputValidation } from '6pp';
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { setIsNewgroup } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';
  const NewGroup = () => {
    const dispatch = useDispatch();
    const {isNewGroup} =useSelector((state)=>state.misc);
  const groupName= useInputValidation("");
  const {isError,error,isLoading,data}=useAvailableFriendsQuery();
  

  const [selectedMembers,setSelectedMembers]=useState([])

  const [newGroup,isLoadingNewGroup]=useAsyncMutation(useNewGroupMutation);

  const errors=[{isError,error}]
  
  // console.log(data);

  const selectMemberHandler = (id)=>{
      setSelectedMembers((prev)=>prev.includes(id) ? prev.filter((currelement)=>(currelement !== id)):[...prev,id]);
  };
 

  const submitHandler =  ()=>{
   if(!groupName.value) return toast.error("Group Name is required");
   if(selectedMembers.length<2) return toast.error("Please Select Atleast 2 Members")

    // creating Groups
     newGroup("Creating New Group..",{name:groupName.value,members:selectedMembers})

   closeHandler();
  };

  const closeHandler = () =>{dispatch(setIsNewgroup(false))};
  useErrors(errors);
  
  return (
    <Dialog open ={isNewGroup} onClose={closeHandler}>
    <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
       <DialogTitle textAlign={"center"} variant="h4" >New Group</DialogTitle>

       <TextField label={"Group Name"} value={groupName.value} onChange={groupName.changeHandler} />

       <Typography variant="body1">
        Members
       </Typography>
   
      <Stack>
          { isLoading ?(<Skeleton/>) : 
          (data?.friends?.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}
            />
          )))}
        
      </Stack>
      <Stack direction={"row"} justifyContent={"space-evenly"}>
           <Button variant="outlined" color="error" size='large' onClick ={closeHandler} >cancle</Button>
           <Button variant="contained" size='large' onClick={submitHandler} disabled={isLoadingNewGroup} >Create</Button>
      </Stack>
     </Stack>
   </Dialog>
  );
};
export default NewGroup