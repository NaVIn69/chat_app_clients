import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {
  const dispatch = useDispatch();
  const { isNotification } = useSelector((state) => state.misc);
  const { isLoading, error, isError, data } = useGetNotificationsQuery();
  // console.log("notification query",data);
  // const [acceptRequest]=useAcceptFriendRequestMutation();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);
  // console.log(isNotification);
  const friendRequestHandler = async ({ _id, accept }) => {
    // notification dialog close
    // when we have to acceppt multiple request then we doesn't have to dispatch
    dispatch(setIsNotification(false));
 const res=   await acceptRequest("request is processing...", { requestId: _id, accept });
//  console.log("notification accept request mutation",res);

    //  try {
    //   const res= await acceptRequest("accepting request...",{requestId:_id,accept});
    //   if(res.data?.success){
    //     console.log("Use Socket Here");
    //     toast.success(res.data.message);
    //   }else toast.error(res.data?.error || "Something went wrong"); ;
    //  } catch (error) {
    //   console.log(error);
    //   toast.error("Something went wrong");

    //  }
  };
  useErrors([{ error, isError }]);
  // console.log("Notification", data);

  const closeNotificationhandler = () => {
    dispatch(setIsNotification(false));
  };

  return (
    <Dialog open={isNotification} onClose={closeNotificationhandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {isLoading ? (
          <Skeleton />
        ) : data?.allRequests.length > 0 ? (
          data?.allRequests?.map(({ sender, _id }) => (
            <NotoficationItem sender={sender} _id={_id} handler={friendRequestHandler} key={_id} />
          ))
        ) : (
          <Typography textAlign={"center"}>0 notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};
const NotoficationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
        <Avatar src={avatar} />

        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request,`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
