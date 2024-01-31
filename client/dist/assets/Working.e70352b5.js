import{r as c,_ as n,u as k,j as t,F as p,b as i}from"./index.3f21815a.js";const f=c.exports.lazy(()=>n(()=>import("./UserButton.a1163ad5.js"),["assets/UserButton.a1163ad5.js","assets/index.3f21815a.js","assets/index.c4470b89.css","assets/UserButton.d52919d1.css"])),E=c.exports.lazy(()=>n(()=>import("./Spinner.a949e481.js"),["assets/Spinner.a949e481.js","assets/index.3f21815a.js","assets/index.c4470b89.css"])),x=()=>{const[d,b]=c.exports.useState(!0),[_,g]=c.exports.useState([]),o=k().userInfo.employee_number,u=async()=>{const r=(await n(()=>import("./useDB.4a39d696.js"),[])).makeRequest,s=await r({employee_number:o},"/getunfinishedprocesses",sessionStorage.getItem("token")),l=await r({employee_number:o},"/getbreaks",sessionStorage.getItem("token")),a=[...s.output,...l.output];a.sort((y,w)=>new Date(y.start)-new Date(w.start)),b(!1),g(a)},h=async e=>{const s=(await n(()=>import("./useDB.4a39d696.js"),[])).makeRequest;(e.break_type?await s({employee_number:o,start:e.start},"/endbreak",null):await s({employee_number:o,process_type:e.process_type,business_name:e.business_name,contact_email:e.contact_email,start:e.start},"/finishjob",null)).status===1?u():n(()=>import("./Alert.4ea9295f.js"),["assets/Alert.4ea9295f.js","assets/index.3f21815a.js","assets/index.c4470b89.css"]).then(async a=>{await a.customAlert("Something Went Wrong!","Please try again later.","error")})},m=async e=>{const s=(await n(()=>import("./useDB.4a39d696.js"),[])).makeRequest;(e.break_type?await s({employee_number:o,break_type:e.break_type,start:e.start},"/deletebreak",null):await s({employee_number:o,process_type:e.process_type,business_name:e.business_name,contact_email:e.contact_email,start:e.start},"/deletejob",null)).status===1?u():n(()=>import("./Alert.4ea9295f.js"),["assets/Alert.4ea9295f.js","assets/index.3f21815a.js","assets/index.c4470b89.css"]).then(async a=>{await a.customAlert("Something Went Wrong!","Please try again later.","error")})};return c.exports.useEffect(()=>{u()},[]),t(p,{children:d?t(E,{}):i(p,{children:[t(f,{})," ",t("br",{}),i("div",{className:"working-container",children:[t("h1",{className:"jobs-title fw-bold fs-25 mb-4 text-center text-dark title",children:"Currently Working On"}),_.length===0?t("h5",{className:"text-center text-muted",children:"You are not working on anything..."}):_.map(e=>{const r=new Date(e.start),s=e.break_type?e.break_type:e.business_name+": "+e.process_type;return i("div",{className:"ongoing-task mb-4",children:[i("div",{className:"work-information",children:[t("button",{type:"button",className:"close-button-left btn-close",onClick:()=>{m(e)}}),i("div",{className:"work-description",children:[t("h3",{children:s}),t("p",{children:r.toLocaleString()})]}),t("button",{type:"button",className:"close-button-right btn btn-light",onClick:()=>{m(e)},children:"Remove"})]}),t("button",{className:"finish-button btn btn-danger",onClick:()=>{h(e)},children:"Finished"})]},e.start)})]})]})})};export{x as default};
