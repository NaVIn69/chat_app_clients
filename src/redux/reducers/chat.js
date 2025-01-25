import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";
// here we are creating the reducer for the dialog box in the frontend

// these are variable from which we trigger the state change
const initialState = {
  NotificationCount:0,
  newMessagesAlert:getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,get:true}) ||[
    {
      chatId:"",
      count:0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotificationCount:(state)=>{
        state.NotificationCount=state.NotificationCount+1;
    },
    resetNotificationCount:(state)=>{
        state.NotificationCount=0;
    },
    setNewMessageAlert:(state,action)=>{
      const index=state.newMessagesAlert.findIndex((item)=>item.chatId===action.payload.chatId)
      if(index!=-1){
        state.newMessagesAlert[index].count+=1;
      }else{
        state.newMessagesAlert.push({
            chatId:action.payload.chatId,
            count:1,
        })
      }
    },
    removeNewMessageAlert:(state,action)=>{
      // jisk bhi chat open kr rhe hai uka sirf hame new_messagealert remove krna hai
      // 
      state.newMessagesAlert=state.newMessagesAlert.filter((item)=>item.chatId!==action.payload);
    }
       
  },
});

export default chatSlice.reducer;
export const {
  incrementNotificationCount,
  resetNotificationCount,
  setNewMessageAlert,
  removeNewMessageAlert
} = chatSlice.actions;
