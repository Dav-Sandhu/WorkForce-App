import{r as o,_ as a,b as r,j as s}from"./index.2392434d.js";import{N as b}from"./Navbar.10ad9d14.js";const h=o.exports.lazy(()=>a(()=>import("./JobsModal.06d2c141.js"),["assets/JobsModal.06d2c141.js","assets/index.2392434d.js","assets/index.c4470b89.css","assets/JobsModal.8b32c559.css"])),x=()=>{const[l,u]=o.exports.useState([]),[m,i]=o.exports.useState([]),[c,n]=o.exports.useState(!1),[p,d]=o.exports.useState(""),_=async()=>{const e=(await a(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest,g=await e(null,"/getemployees",sessionStorage.getItem("token"),"get"),y=await e(null,"/getrequests",sessionStorage.getItem("token"),"get");u(g.output),i(y.output)};return o.exports.useEffect(()=>{_()},[]),r(b,{children:[c?s(h,{employee_number:p,setShowJobs:n}):"",r("div",{className:"employees_list",children:[s("h1",{children:"Assign Jobs"}),l.map(t=>r("div",{className:"employee",children:[r("div",{className:"left-section",children:[s("img",{className:"profile-picture",loading:"lazy",onError:e=>{e.target.onerror=null,e.target.src="/default profile picture.jpg"},src:t.picture}),s("h3",{children:t.first_name+" "+t.last_name}),s("p",{children:"#"+t.employee_number}),m.some(e=>e.employee_number===t.employee_number)?s("p",{className:"request",children:"Job Requested"}):""]}),s("div",{className:"right-section",children:s("button",{type:"button",className:"btn btn-dark",onClick:()=>{d(t.employee_number),n(e=>!e)},children:"Assign"})})]},t.employee_number))]})]})};export{x as default};
