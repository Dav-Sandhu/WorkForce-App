import{r as o,_ as a,a as f,u as x,j as s,F as y,b as E}from"./index.7f1f0c26.js";const b=o.exports.lazy(()=>a(()=>import("./Spinner.e340b526.js"),["assets/Spinner.e340b526.js","assets/index.7f1f0c26.js","assets/index.c4470b89.css"])),k=({selectedJob:l})=>{const n=f(),c=x(),[m,_]=o.exports.useState(!0),[i,g]=o.exports.useState([]),p=e=>{_(!1),g(e)};return o.exports.useEffect(()=>{(async()=>{const t=sessionStorage.getItem("token");if(t!==null){const r=(await a(()=>import("./useDB.4a39d696.js"),[])).makeRequest,u=await r(null,"/getcustomers",t);u.status===1?p(u.output):n("/")}else n("/login")})()},[]),s(y,{children:m?s(b,{}):i.length===0?s("h5",{className:"text-center text-muted",children:"There are no customers available right now..."}):i.map(e=>E("div",{className:"customer",onClick:()=>{(async()=>{const r=(await a(()=>import("./useDB.4a39d696.js"),[])).makeRequest;(await r({employee_number:c.userInfo.employee_number,process_type:l,business_name:e.business_name,contact_email:e.contact_email},"/startjob",null)).status===1?n("/working"):a(()=>import("./Alert.5136f4c4.js"),["assets/Alert.5136f4c4.js","assets/index.7f1f0c26.js","assets/index.c4470b89.css"]).then(async h=>{await h.customAlert("Something Went Wrong!","Please try again later.","error")})})()},children:[s("img",{className:"img-fluid company-logo",onError:t=>{t.target.onerror=null,t.target.src="/customers.png"},src:e.logo,alt:"Company Logo"}),s("h5",{className:"text-nowrap",children:e.business_name})]},e.business_name+e.contact_email))})};export{k as default};