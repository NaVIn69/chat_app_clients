import { Avatar, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";


const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <Avatar alt={params.row.name} src={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    headerClassName: "table-header",
    width: 200,
  },
];
const UserManagement = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}/api/v1/admin/users`, { withCredentials: true });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
 
  const { stats } = data || {};
  // console.log(data);

  useEffect(() => {
   if(data){
    setRows(
      data?.users?.map((i) => ({ ...i, id: i._id, avatar: transformImage(i.avatar, 50) }))
    );
   }
  }, [data]);
  useErrors([{ isError: error, error: error }]);
  return (
    <AdminLayout>
      {loading ? <Skeleton height={"100vh"}  /> : <Table heading={"All Users"} columns={columns} rows={rows} />}
    </AdminLayout>
  );
};

export default UserManagement;
