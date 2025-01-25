import { Typography, Stack, Box } from "@mui/material";
import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat,
  newMessageAlert,
  sameSender,
  isOnline,
  index = 0,
  handleDeleteChat,
  key,
}) => {
  return (
    <Link
      sx={{
        padding: "0",
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
      key={_id}
        initial={{opacity:0,y:"-100%"}}
        whileInView={{opacity:1,y:0}}
        exit={{ opacity: 0, y: "100%" }}
        transition={{delay:0.1*index}}
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "centre",
          padding: "1rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
          padding: "1rem",
        }}
      >
        {/* avatarCard */}
        <AvatarCard avatar={avatar} />

        {/* here we show the new message count */}
        <Stack>
          <Typography>{name}</Typography>
          {newMessageAlert && <Typography>{newMessageAlert.count} New Message</Typography>}
        </Stack>
        {
          // user is online the here we show the green dot
          isOnline && (
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
                position: "absolute",
                top: "50%",
                right: "1rem",
                transform: "translateY(-50%)",
              }}
            />
          )
        }
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
