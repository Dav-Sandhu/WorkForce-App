import{r,_ as i,u as k,j as t,F as p,b as a}from"./index.598a30c5.js";const f=r.exports.lazy(()=>i(()=>import("./UserButton.f4a3c48a.js"),["assets/UserButton.f4a3c48a.js","assets/index.598a30c5.js","assets/index.c4470b89.css","assets/UserButton.d52919d1.css"])),v=r.exports.lazy(()=>i(()=>import("./Spinner.b4096bf6.js"),["assets/Spinner.b4096bf6.js","assets/index.598a30c5.js","assets/index.c4470b89.css"])),E=()=>{const[d,b]=r.exports.useState(!0),[u,g]=r.exports.useState([]),n=k().userInfo.employee_number,c=async()=>{const o=(await i(()=>import("./useDB.4a39d696.js"),[])).makeRequest,s=await o({employee_number:n},"/getunfinishedprocesses",sessionStorage.getItem("token")),l=await o({employee_number:n},"/getbreaks",sessionStorage.getItem("token")),_=[...s.output,...l.output];_.sort((y,w)=>new Date(y.start)-new Date(w.start)),b(!1),g(_)},h=async e=>{const s=(await i(()=>import("./useDB.4a39d696.js"),[])).makeRequest;(e.break_type?await s({employee_number:n,start:e.start},"/endbreak",null):await s({employee_number:n,process_type:e.process_type,business_name:e.business_name,contact_email:e.contact_email,start:e.start},"/finishjob",null)).status===1?c():alert("Something went wrong: please try again later")},m=async e=>{const s=(await i(()=>import("./useDB.4a39d696.js"),[])).makeRequest;(e.break_type?await s({employee_number:n,break_type:e.break_type,start:e.start},"/deletebreak",null):await s({employee_number:n,process_type:e.process_type,business_name:e.business_name,contact_email:e.contact_email,start:e.start},"/deletejob",null)).status===1?c():alert("Something went wrong: please try again later")};return r.exports.useEffect(()=>{c()},[]),t(p,{children:d?t(v,{}):a(p,{children:[t(f,{})," ",t("br",{}),a("div",{className:"working-container",children:[t("h1",{className:"jobs-title fw-bold fs-25 mb-4 text-center text-dark title",children:"Currently Working On"}),u.length===0?t("h5",{className:"text-center text-muted",children:"You are not working on anything..."}):u.map(e=>{const o=new Date(e.start),s=e.break_type?e.break_type:e.business_name+": "+e.process_type;return a("div",{className:"ongoing-task mb-4",children:[a("div",{className:"work-information",children:[t("button",{type:"button",className:"close-button-left btn-close",onClick:()=>{m(e)}}),a("div",{className:"work-description",children:[t("h3",{children:s}),t("p",{children:o.toLocaleString()})]}),t("button",{type:"button",className:"close-button-right btn btn-light",onClick:()=>{m(e)},children:"Remove"})]}),t("button",{className:"finish-button btn btn-danger",onClick:()=>{h(e)},children:"Finished"})]},e.start)})]})]})})};export{E as default};
