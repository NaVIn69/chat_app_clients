import { Avatar, Box, Skeleton, Stack } from '@mui/material';
import axios from "axios";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import RenderAttachment from '../../components/shared/RenderAttachment';
import Table from '../../components/shared/Table';
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from '../../lib/features';

const columns=[
  {
     field:"id",
     headerName:"ID",
     headerClassName:"table-header",
     width:200,
  },
  {
   field:"attachments",
   headerName:"Attachments",
   headerClassName:"table-header",
   width:200,
   renderCell:(params) =>{
      const {attachments} = params.row;

      return attachments?.length>0 ? (
         attachments.map((i)=>{
          const url =i.url;
          // const name=i.name;
          const file=fileFormat(url)
              return <Box>
                <a href={url}
                 download
                 target='_blank'
                 style={{
                  //  display:"flex",
                  //  alignItems:"center",
                  //  justifyContent:"center",
                  //  textDecoration:"none",
                   color:"black",
                 }}
                >
              {RenderAttachment(file,url)}
                </a>
              </Box>
         })
      )
      
      :("No attachments");

    // return <Avatar alt={params.row.name} src={params.row.avatar}
    
   },
},
  {
      
     field:"sender",
     headerName:"Sent By",
     headerClassName:"table-header",
     width:150,
     renderCell:(params)=> ( 
     <Stack  direction={"row"} spacing={"1rem"} alignItems={"center"}>
       <Avatar alt={params.row.name} src={params.row.sender.avatar}/>
       <span>{params.row.sender.name}</span>
     </Stack> )
  },
  {
   field:"chat",
   headerName:"Chat",
   headerClassName:"table-header",
   width:220,
  },
  {
   field:"groupChat",
   headerName:"Group Chat",
   headerClassName:"table-header",
   width:100,
  },
  
  {
     field:"createdAt",
     headerName:"Time",
     headerClassName:"table-header",
     width:250,
  }

];
const MessageMangement = () => {
  const [rows,setRows]=useState([])
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}/api/v1/admin/messages`, { withCredentials: true });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
 
  // const { stats } = data || {};
  // console.log(data);

  useEffect(()=>{
    if(data){
    setRows(data?.messages?.map(i=>(
      {
       ...i,
       id:i._id,
       sender:{
        name:i?.sender?.name,
        avatar:transformImage(i?.sender?.avatar,50),
       },
       createdAt:moment(i.createdAt).format("MMMM Da YYYY,h:mm:ss a"),
      }
    )))
  }
  },[data])
  useErrors([{isError:error,error:error}])

  return (
    <AdminLayout>
      {
        loading ? (<Skeleton height={"100vh"} />):( <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={150} />)
      }
    </AdminLayout>
  )
}

export default MessageMangement