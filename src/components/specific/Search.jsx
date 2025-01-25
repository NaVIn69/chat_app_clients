import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { sampleUsers } from '../../constants/sampleData';
import { useAsyncMutation } from "../../hooks/hook";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

 

const Search= ()=>{
  const dispatch=useDispatch();

  const {isSearch} =useSelector((state)=>state.misc);

  const [searchUser] =useLazySearchUserQuery();
  const [sendFriendRequest,isLoadingSendFriendRequest]=useAsyncMutation(useSendFriendRequestMutation)
  // searchUser is function we want to call when i want, we call searchUser ,using the useEffect


  const search=useInputValidation("") // when that value change then we have to call the UseEffect

  const SearchClosehandler =()=> dispatch(setIsSearch(false))

  const addFriendHandler= async (id)=>{
  //  / console.log("addfriendhandler invoke",id)
   await sendFriendRequest("sending Friend Request...",{userId:id});
   
  }
  // let isLoadingSendFriendRequest=false;
  const [users,setUsers]=useState([]);
  // console.log("user from search.jsx",users);

  useEffect(()=>{


   const timeOutid= setTimeout(()=>{
    searchUser(search.value)
     .then(({data})=>setUsers(data.users))
     .catch((e)=>console.log(e))

   },1000)


    // jaise jasie koi bhi value likhunga then useeffect call hote jayega , that take time to much
    // then here we use debouncing concept measn, after completing my sentence then  we have start
    // searching , we stop writting then uske 0.5sec badd start kre searching
    return ()=>{
      clearTimeout(timeOutid)
    }

  },[search.value])
  



  return (
    <Dialog open={isSearch}  onClose={SearchClosehandler}>
          <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
}
export default Search
