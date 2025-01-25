import React, { Fragment, useRef, useState, useEffect, useCallback } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor, orange } from "../constants/color";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";

import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import { NEW_MESSAGE, START_TYPING,STOP_TYPING,ALERT,CHAT_JOINED,CHAT_LEAVED } from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessageAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef=useRef(null);
  const navigate=useNavigate();
  const socket = getSocket();
  // console.log("user",user);

  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setfileMenuAnchor] = useState(null);
  // for displaying the attachemen menu we use the fileMenuanchor 
  const [IamTyping,setIamTyping]=useState(false);
  const [userTyping,setuserTyping]=useState(false);
  const typingTimeout=useRef(null);
  // const socket = getSocket();
  // console.log("chatId from Chat chat.jsx",chatId);
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  // when we change any thing in url then this give me the error
  // console.log("chatDetails",chatDetails);
  // console.log("chatDetails",socket);

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  // here we use that hook who hit my backend from get data from their
  //  console.log("oldMessageChunk",oldMessagesChunk.data)
// 
  //  console.log("chatDetails",chatDetails);
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.message
  );
  // console.log("oldMessage", oldMessages);
  // old message tell me message of every single Page

  const members = chatDetails?.data?.chat?.members;
  // console.log("members from chat.jsx",members);
  // const memberswithId=members.map((i)=>i._id);
  // consle.log("members with id",memberswithId);

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  //  console.log("old message chunk", oldMessages);
  // when we are typing the message on the input Box then this event trigger
  const messageOnChange = (e)=>{
    setMessage(e.target.value);
    if(!IamTyping){
    socket.emit(START_TYPING,{members,chatId});
    setIamTyping(true);
    
    // when i am typing the socket send the event to the use like i am typing
    // when i stop typing  then , we use the timeout for that
    }
    if(typingTimeout.current) clearTimeout(typingTimeout.current);
   typingTimeout.current= setTimeout(()=>{
     socket.emit(STOP_TYPING,{members,chatId});
     setIamTyping(false);
     // setuserTyping(false);

    },[1000]);


 }
  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setfileMenuAnchor(e.currentTarget);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    // from here we have to emit the event
    if (!message.trim()) return;
    // emiting message to the server4

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };
  useEffect(()=>{

  
    socket.emit(CHAT_JOINED,{userId:user._id,members})
    // console.log("members",members);

   dispatch(removeNewMessageAlert(chatId))
  return ()=>{
  setMessages([]);
  setMessage("");
  setOldMessages([]);
  setPage(1);
 
  socket.emit(CHAT_LEAVED,{userId:user._id,members})
  
}

  },[chatId]);

  useEffect(()=>{
      if(bottomRef.current)
        bottomRef.current.scrollIntoView({behavior:"smooth"});

  },[messages])

  useEffect(()=>{
  if(chatDetails.isError) return navigate("/")

  },[chatDetails.isError])

  const NewMessageHandler = useCallback((data) => {
    if(data.chatId!==chatId) return ;
    // console.log(data);
    setMessages((prev) => [...prev, data.message]);
  },[chatId]);

  const startTypingListener = useCallback(
       (data)=>{
        if(data.chatId!==chatId) return 
        // console.log("start_typing",data);
        setuserTyping(true);
       },
  [chatId]);

  const stopTypingListener = useCallback(
    (data)=>{
     if(data.chatId!==chatId) return 
    //  console.log("stop_typing",data);
     setuserTyping(false);
    },
[chatId]);

const alertListener = useCallback(
  (data)=>{
   const messageForAlert={
         content :data,
             // here using this uuid() we generate the random id
            
             sender:{
                 _id:"dbvfdbsnjfvbff",
                 name:"Admin"
             },
             chat :chatId,
             createdAt : new Date().toISOString(),
          };
        setMessages((prev)=>[...prev,messageForAlert])
  },
[chatId]);

  const eventhandler = {
    [ALERT]:alertListener,
     [NEW_MESSAGE]: NewMessageHandler,
     [START_TYPING]:startTypingListener,
     [STOP_TYPING]:stopTypingListener,
   };
  useSocketEvents(socket, eventhandler);

  useErrors(errors);
  // console.log("message",messages);

  const allMessages = [...oldMessages, ...messages];
 
  

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
        {
         userTyping && <TypingLoader/>
        }
        <div ref={bottomRef}/>
      </Stack>
      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
          
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
            // ref={FileMenuRef}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type Message here..."
            value={message}
            onChange={messageOnChange}
          />
          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);
// export default AppLayout(Chat);
