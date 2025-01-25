import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import { incrementNotificationCount, setNewMessageAlert } from "../../redux/reducers/chat";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import { Title } from "../shared/Title";
import ChatList from "../specific/ChatList";
import { Profile } from "../specific/Profile";
import Header from "./Header";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    // here we get the url
    const chatId = params.chatId;
    const deleteMenuAnchor=useRef(null);
    const socket = getSocket();
    const navigate=useNavigate();
    const [onlineUsers,setOnlineusers]=useState([]);

    // console.log(socket.id);

    // chatId from that url
    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const {newMessagesAlert}=useSelector((state)=>state.chat);

    // const { isMobile } = useSelector((state) => state.misc || { isMobile: false });

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    // console.log("applayout mychatquery",data);
    // console.log("chatId applayout",chatId);

   
    // console.log("error from layout");
    // console.log(data);
    // console.log("data from layout",data);
    useEffect(()=>{
        getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
        // here we are saving the data inside the localstroge
    },[newMessagesAlert])

    const handleDeleteChat = (e,chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({chatId,groupChat}));
      deleteMenuAnchor.current=e.currentTarget
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const NewMessageAlertHandler= useCallback((data)=>{
           if(data.chatId===chatId) return;
           // means we have open that same chatId in the chat component

          dispatch(setNewMessageAlert(data));
     
    },[chatId]);

    const NewRequestHandler=useCallback(()=>{
          dispatch(incrementNotificationCount());
    },[dispatch]);

    const refetchHandler=useCallback(()=>{
         refetch()
         navigate("/")
    
},[refetch,navigate]);

const onlineUserListener= useCallback((data)=>{

  setOnlineusers(data);
  // console.log("online users",onlineUsers);
},[])

    const eventhandlers = { [NEW_MESSAGE_ALERT]: NewMessageAlertHandler,
      [NEW_REQUEST]:NewRequestHandler,
      [REFETCH_CHATS]:refetchHandler,
      [ONLINE_USERS]:onlineUserListener,
     };
    useSocketEvents(socket, eventhandlers);
    useErrors([{ isError, error }]);
    // useSocketEvents(socket,eventhandlers);

    return (
      <>
        <Title title={"chat App"} />
        <Header />
        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            // her grid take the 4 colum
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>

          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
