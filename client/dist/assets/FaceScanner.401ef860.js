import{r as n,_ as o,b as s,F as b,j as e}from"./index.f2880c19.js";const S=n.exports.lazy(()=>o(()=>import("./react-webcam.023e4fba.js").then(a=>a.r),["assets/react-webcam.023e4fba.js","assets/index.f2880c19.js","assets/index.aed92d30.css"])),y=({state:a,dispatch:m,navigate:d,user:u})=>{const[g,p]=n.exports.useState(!1),[_,h]=n.exports.useState(!1),c=n.exports.useRef(null),f=()=>{const t=c.current.getScreenshot();t?(m({type:"image",payload:t}),(async()=>{const r=(await o(()=>import("./useDB.4a39d696.js"),[])).makeRequest,i=await r({image:t},"/facematch",null);if(i.status===1){const l=i.token;sessionStorage.setItem("token",l),(await o(()=>import("./TokenLogin.fa3ff8bd.js"),[])).default(l,r,()=>d("/"),u)}else alert("face not recognized!"),window.location.reload()})()):(alert("Failed to capture picture, try again!"),window.location.reload())};return s(b,{children:[e("hr",{className:"mt-2 mb-3"}),g?e("div",{className:"image-area",children:a.image===null?s("div",{className:"camera mb-5",onClick:f,children:[e(S,{ref:c,screenshotFormat:"image/jpeg",onUserMedia:()=>{h(!0)},height:"100%",width:"100%",videoConstraints:{facingMode:"user"}}),_?e("div",{className:"scan-text",children:"Scan"}):""]}):s("div",{children:[e("h2",{children:"Loading..."}),e("img",{src:a.image,className:"img-fluid user-picture mb-5"})]})}):e("div",{className:"d-grid gap-2",children:e("button",{className:"btn btn-danger",type:"button",onClick:t=>{p(!0)},children:"Or Scan your face to login!"})})]})};export{y as default};
