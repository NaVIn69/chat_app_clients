import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  CircularProgress
} from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from "../components/shared/AvatarCard";
import { Link } from "../components/styles/StyledComponents";
import { bgGradient } from "../constants/color";

import { LayoutLoder } from "../components/layout/Loaders";
import UserItem from "../components/shared/UserItem";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from "../redux/api/api";

import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog"));
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog"));


const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const dispatch=useDispatch();
  const {isAddMember}=useSelector((state)=>state.misc);


  const myGroups=useMyGroupsQuery("");
  const groupDetails=useChatDetailsQuery(
    {chatId,populate:true},
    {skip:!chatId}
  );
  const [updateGroup,isLoadingGroupName]= useAsyncMutation(useRenameGroupMutation)

  // when we have the chatId in the url then fetch that groupDetaisl
  
  const [removeMember,isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation)
  // const {addMembers,isLoadingAddMember}= useAsyncMutation(useAddGroupMembersMutation);
  const [deleteGroup,isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)

  const [isMobileMenuOpen, setisMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setgroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [members,setMembers]=useState([]);
  // const members=groupDetails?.data?.chat?.members || [];

  const errors= [{
    isError:myGroups.isError,
  error:myGroups.error,
  },
{
  isError:groupDetails.isError,
  error:groupDetails.error,
}
]
  useErrors(errors);
  


  useEffect(()=>{
    const groupData=groupDetails.data;
    if(groupDetails.data){
      setGroupName(groupData.chat.name);
      setgroupNameUpdatedValue(groupData.chat.name)
      setMembers(groupData.chat.members)
    }

    return ()=>{
      setGroupName("");
      setgroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    }

  },[groupDetails.data])

  const navigateBack = () => {
    navigate("/");
  };
  const handleMobile = () => {
    setisMobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => {
    setisMobileMenuOpen(false);
  };

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating group Name..",{chatId,name:groupNameUpdatedValue,})
   
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
     dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleteing Group...",chatId);
    closeConfirmDeleteHandler();
    navigate("/groups")
  };

  const removeMemberHandler = (userId) => {
     removeMember("Removing Member..",{chatId,userId});
    //  console.log("removed member",userId);
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`group name ${chatId}`);
      setgroupNameUpdatedValue(`group name ${chatId}`);
    }
    //cleanup function
    return () => {
      setGroupName("");
      setgroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            color: "white",
            bgcolor: "primary.main",
            ":hover": {
              bgcolor: "lightBlue",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      spacing={"1rem"}
      padding={"3rem"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setgroupNameUpdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            {/* isLoadinggroup name is true then disable it */}
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton
          disabled={isLoadingGroupName}
           onClick={() => setIsEdit(true)}>
            {" "}
            <EditIcon />{" "}
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <>
      <Stack
        direction={{
          sm: "row",
          xs: "column-reverse",
        }}
        spacing={"1rem"}
        p={{
          sm: "1rem",
          xs: "0",
          md: "1rem 4rem",
        }}
      >
        <Button
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddMemberHandler}
        >
          Add Member
        </Button>
        <Button
          size="large"
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={openConfirmDeleteHandler}
        >
          Delete Group
        </Button>
      </Stack>
    </>
  );
  return myGroups.isLoading ? (<LayoutLoder/>):(
    <>
      <Grid container height={"100vh"}>
        <Grid
          item
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            backgroundImage: bgGradient,
          }}
          sm={4}
        >
          <GroupList myGroup={myGroups?.data?.groups} chatId={chatId} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            padding: "1rem 3rem",
          }}
        >
          {IconBtns}
          {groupName && (
            <>
              {GroupName}
              <Typography>Members</Typography>
              <Stack
                maxWidth={"45rem"}
                width={"100%"}
                boxSizing={"border-box"}
                padding={{
                  sm: "1rem",
                  xs: "0",
                  md: "1rem 4rem",
                }}
                spacing={"2rem"}
                // bgcolor={"bisque"}
                height={"50vh"}
                overflow={"auto"}
              >
                { isLoadingRemoveMember ? <CircularProgress/> :  members?.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem  rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                  />
                ))}
              </Stack>
              {ButtonGroup}
            </>
          )}
        </Grid>

        {isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberDialog chatId={chatId} />
          </Suspense>
        )}

        {confirmDeleteDialog && (
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        )}
        <Drawer
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileClose}
        >
          <GroupList w={"50vw"} myGroup={myGroups?.data?.groups} chatId={chatId} />
        </Drawer>
      </Grid>
    </>
  );
};
const GroupList = ({ w = "100%", myGroup = [], chatId }) => (
  <Stack
    width={w}
    sx={{
      height: "100vh",
      backgroundImage: bgGradient,
      overflow: "auto",
    }}
  >
    {myGroup.length > 0 ? (
      myGroup.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id} />)
    ) : (
      <Typography textAlign={"center"} padding="1rem">
        No groups
      </Typography>
    )}
  </Stack>
);
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId == _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});
export default Groups;
