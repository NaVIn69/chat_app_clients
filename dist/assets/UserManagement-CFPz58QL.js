import{r as a,M as p,j as s,S as f,W as u,X as c}from"./index-irexueTV.js";import{A as N}from"./AdminLayout-Bi5iCY7q.js";import{T as w}from"./Table-BTKQXWHi.js";import{a as C}from"./Menu-CmgIRgBM.js";import{A as v}from"./Avatar-Cp4DZ0XV.js";import"./IconButton-DwQ1NlaF.js";import"./Modal-CTaQcr3u.js";import"./Typography-JwG0Pq1m.js";import"./ExitToApp-5YtZ6gSP.js";import"./Container-B0pkiVXL.js";import"./TextField-BOKVHMeR.js";import"./isMuiElement-Bv43l1N-.js";import"./Menu-Bt0IaSNa.js";import"./Tooltip-CVusUE4k.js";import"./Toolbar-CXjODSla.js";import"./MenuItem-DnPP-E3C.js";import"./Button-yxfB9dJ-.js";import"./InputAdornment-BnHJggO_.js";import"./CircularProgress-BdQMOYhd.js";const x=[{field:"id",headerName:"ID",headerClassName:"table-header",width:200},{field:"avatar",headerName:"Avatar",headerClassName:"table-header",width:150,renderCell:t=>s.jsx(v,{alt:t.row.name,src:t.row.avatar})},{field:"name",headerName:"Name",headerClassName:"table-header",width:200},{field:"username",headerName:"Username",headerClassName:"table-header",width:200},{field:"friends",headerName:"Friends",headerClassName:"table-header",width:200},{field:"groups",headerName:"Groups",headerClassName:"table-header",width:200},{field:"createdAt",headerName:"Created At",headerClassName:"table-header",width:200}],_=()=>{const[t,d]=a.useState([]),[m,l]=a.useState(!0),[r,h]=a.useState(null),[i,n]=a.useState(null);return a.useEffect(()=>{(async()=>{try{const e=await u.get(`${c}/api/v1/admin/users`,{withCredentials:!0});h(e.data)}catch(e){n(e)}finally{l(!1)}})()},[]),a.useEffect(()=>{var o;r&&d((o=r==null?void 0:r.users)==null?void 0:o.map(e=>({...e,id:e._id,avatar:p(e.avatar,50)})))},[r]),C([{isError:i,error:i}]),s.jsx(N,{children:m?s.jsx(f,{height:"100vh"}):s.jsx(w,{heading:"All Users",columns:x,rows:t})})};export{_ as default};
