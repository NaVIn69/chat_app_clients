import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";

const AddMemberDialog = ({ chatId }) => {
  const dispatch=useDispatch();
  const {isAddMember}=useSelector((state)=>state.misc);
    const [addMembers,isLoadingAddMember]= useAsyncMutation(useAddGroupMembersMutation);
    const {isLoading,data,isError,error}=useAvailableFriendsQuery(chatId);


;



  const [selectedMembers, setSelectedMembers] = useState([]);
  

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((currelement) => currelement !== id) : [...prev, id]
    );
  };

  //  const addFriendHandler= (id)=>{
  //     addMember(id,chatId)
  //  }
  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...",{chatId,members:selectedMembers})
      
    closeHandler();

  };

  const closeHandler = () => {
  
    dispatch(setIsAddMember(false));
  };
  useErrors([{isError,error}])

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          { isLoading ? (<Skeleton/>): data?.friends.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friend</Typography>
          )}
        </Stack>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
          <Button onClick={closeHandler} color="error" variant="outlined">
            cancle
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMember}
          >
            Submit Change
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
