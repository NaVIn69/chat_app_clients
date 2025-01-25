import React from 'react'
import {Stack,Avatar,Typography} from "@mui/material"
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import moment from "moment"
import { transformImage } from '../../lib/features';


export const Profile = ({user}) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
    <Avatar 
     src={transformImage(user?.avatar?.url)}
      sx={{
        width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
      }}
    />


    
    <ProfileCard heading={"Bio"} text={user?.bio} />
    <ProfileCard heading={"username"} text={user?.username} Icon={<UserNameIcon/>} />
    <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />}/>
    <ProfileCard heading={"joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalendarIcon/>} />
    </Stack>
  )
}

const ProfileCard=({text,Icon,heading})=> (
<Stack
  direction={"row"}
  alignItems={"centre"}
  spacing={"1rem"}
  color={"white"}
  textAlign={"centre"}
>
  {Icon && Icon}
  <Stack>
  <Typography variant="body1">{text}</Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>


</Stack>
);

