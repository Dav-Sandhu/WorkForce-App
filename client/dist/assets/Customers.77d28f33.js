import{r as o,_ as n,b,u as h,j as s,F as k,a as x}from"./index.2a58c38f.js";const y=o.exports.lazy(()=>n(()=>import("./Spinner.2a583fae.js"),["assets/Spinner.2a583fae.js","assets/index.2a58c38f.js","assets/index.c4470b89.css"])),f=({selectedJob:m})=>{const r=b();h();const[_,g]=o.exports.useState(!0),[i,d]=o.exports.useState([]),p=e=>{g(!1),d(e)},u=async e=>{const l=(await n(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest;(await l({process_type:m,business_name:e.business_name,contact_email:e.contact_email},"/startjob",sessionStorage.getItem("token"),"post")).status===1?r("/working"):n(()=>import("./Alert.6bfbd2ea.js"),["assets/Alert.6bfbd2ea.js","assets/index.2a58c38f.js","assets/index.c4470b89.css"]).then(async a=>{await a.customAlert("Something Went Wrong!","Please try again later.","error")})};return o.exports.useEffect(()=>{(async()=>{const t=sessionStorage.getItem("token");if(t!==null){const c=(await n(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest,a=await c(null,"/getcustomers",t,"get");a.status===1?p(a.output):r("/")}else r("/login")})()},[]),s(k,{children:_?s(y,{}):i.length===0?s("h5",{className:"text-center text-muted",children:"There are no customers available right now..."}):i.map(e=>x("div",{className:"customer","aria-label":"customer: "+e.business_name,tabindex:"0",onKeyDown:t=>t.key==="Enter"||t.key===" "?u(e):"",onClick:()=>u(e),children:[s("img",{className:"img-fluid company-logo",onError:t=>{t.target.onerror=null,t.target.src="/customers.png"},src:e.logo,alt:"Company Logo"}),s("h5",{className:"text-nowrap",children:e.business_name})]},e.business_name+e.contact_email))})};export{f as default};
