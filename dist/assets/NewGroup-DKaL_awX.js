import{b as G,u as v,b0 as y,r as C,j as e,o as n,S as M,b1 as S,_ as c,R as A}from"./index-irexueTV.js";import{U as T}from"./UserItem-BK1VO4-t.js";import{z as k}from"./index-DH6ci2QH.js";import{b as D,a as E}from"./Menu-CmgIRgBM.js";import{D as H,a as _}from"./DialogTitle-BbWngXSl.js";import{T as z}from"./TextField-BOKVHMeR.js";import{T as B}from"./Typography-JwG0Pq1m.js";import{B as m}from"./Button-yxfB9dJ-.js";import"./ListItem-CrKAa2bw.js";import"./Menu-Bt0IaSNa.js";import"./Modal-CTaQcr3u.js";import"./isMuiElement-Bv43l1N-.js";import"./Avatar-Cp4DZ0XV.js";import"./IconButton-DwQ1NlaF.js";import"./Delete-BaecR_Mp.js";const $=()=>{var l;const u=G(),{isNewGroup:p}=v(r=>r.misc),s=k(""),{isError:d,error:x,isLoading:h,data:o}=y(),[t,b]=C.useState([]),[f,g]=D(S);E([{isError:d,error:x}]);const j=r=>{b(i=>i.includes(r)?i.filter(N=>N!==r):[...i,r])},w=async()=>{if(!s.value)return c.error("Group Name is required");if(t.length<=3)return c.error("Please Select Atleast 3 Members");await f("Creating New Group..",{name:s.value,members:t}),a()},a=()=>{u(A(!1))};return e.jsx(H,{open:p,onClose:a,children:e.jsxs(n,{p:{xs:"1rem",sm:"3rem"},width:"25rem",spacing:"2rem",children:[e.jsx(_,{textAlign:"center",variant:"h4",children:"New Group"}),e.jsx(z,{label:"Group Name",value:s.value,onChange:s.changeHandler}),e.jsx(B,{variant:"body1",children:"Members"}),e.jsx(n,{children:h?e.jsx(M,{}):(l=o==null?void 0:o.friends)==null?void 0:l.map(r=>e.jsx(T,{user:r,handler:j,isAdded:t.includes(r._id)},r._id))}),e.jsxs(n,{direction:"row",justifyContent:"space-evenly",children:[e.jsx(m,{variant:"outlined",color:"error",size:"large",onClick:a,children:"cancle"}),e.jsx(m,{variant:"contained",size:"large",onClick:w,disabled:g,children:"Create"})]})]})})};export{$ as default};
