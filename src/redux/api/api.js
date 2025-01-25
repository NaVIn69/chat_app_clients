import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/`,
    // credentials: "include", // Ensure credentials are always included for all requests
  }),
  // here all the builder is return the object
  tagTypes: ["Chat", "User", "Message"], // This allows caching of data and enables automatic updates
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/my",
        credentials: "include",
      }),
      providesTags: ["Chat"], // Specifies tags for cache invalidation
    }),
    searchUser: builder.query({
      // when dialog open , the we have to give name we are searching
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      // in ProvidesTagsa we have to give the database
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/sendRequest",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
      // when dialog open , the we have to give name we are searching
      query: () => ({
        url: `user/notifications`,
        credentials: "include",
      }),
      // in ProvidesTagsa we have to give the database
      keepUnusedDataFor: 0,
      // means no caching , we are doing
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptrequest",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
      // beacause , we have to refetch chat
      // jaise rquest accept krenge the chat refetch ho jayega
    }),
    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";
       
        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        body: data,
        credentials: "include",
      }),
  }),
  myGroups:builder.query({
    query:()=>({
    url:"chat/my/groups",
    credentials:"include",
     }),
      providesTags:["Chat"],
   }),
   availableFriends: builder.query({
    query: (chatId ) => {
      let url = `user/friends`;
      if (chatId) url += `?chatId=${chatId}`;
      return {
        url,
        credentials: "include",
      }
    },
    providesTags: ["Chat"],
  }),
  newGroup: builder.mutation({
    query: ({name,members}) => ({
      url: "chat/new",
      method: "POST",
      // here we are sending the jsong data 
      body: {name,members},
      credentials: "include",
    }),
    invalidatesTags: ["Chat"],
    // beacause , we have to refetch chat
    // jaise rquest accept krenge the chat refetch ho jayega
  }),
  renameGroup: builder.mutation({
    query: ({chatId,name}) => ({
      url: `chat/${chatId}`,
      method: "PUT",
      body: {name},
      credentials: "include",
    }),
    invalidatesTags: ["Chat"],
    // beacause , we have to refetch chat
    // jaise rquest accept krenge the chat refetch ho jayega
  }),
  removeGroupMember: builder.mutation({
    query: ({chatId,userId}) => ({
      url: `chat/removemember`,
      method: "PUT",
      body: {chatId,userId},
      credentials: "include",
    }),
    invalidatesTags: ["Chat"],
    // beacause , we have to refetch chat
    // jaise rquest accept krenge the chat refetch ho jayega
  }),
  addGroupMembers: builder.mutation({
    query: ({chatId,members}) => ({
      url: `chat/addmembers`,
      method: "PUT",
      body: {chatId,members},
      credentials: "include",
    }),
    invalidatesTags: ["Chat"],
    // beacause , we have to refetch chat
    // jaise rquest accept krenge the chat refetch ho jayega
  }), 
  leavegroup: builder.mutation({
    query: (chatId) => ({
      url: `chat/leave/${chatId}`,
      method: "DELETE",
 
      credentials: "include",
    }),
    invalidatesTags: ["Chat"],
    // beacause , we have to refetch chat
    // jaise rquest accept krenge the chat refetch ho jayega
  }),
  deleteChat: builder.mutation({
    query: (chatId) => ({
      url: `chat/${chatId}`,
      method: "DELETE",
      credentials: "include",
    }),
    invalidatesTags: ["Chat"],
  }),
    
})
})

export default api;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useSendAttachmentsMutation,
  useMyGroupsQuery, 
  useAvailableFriendsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useRemoveGroupMemberMutation,
  useAddGroupMembersMutation,
  useDeleteChatMutation,
  useLeavegroupMutation,

} = api;
// here use doing Lazy then , we have to trigger that when we want, not on the time of page monut
// useMyChatsQuery load , when my page mount for the first time

/// by usign this api,js file we are getting the data from the backend
// by hitting theri end point
