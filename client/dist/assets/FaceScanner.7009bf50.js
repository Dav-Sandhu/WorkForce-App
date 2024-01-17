import{r as o,_ as r,b as u,F as E,j as e}from"./index.c7de203b.js";const y=o.exports.lazy(()=>r(()=>import("./react-webcam.5ca42950.js").then(n=>n.r),["assets/react-webcam.5ca42950.js","assets/index.c7de203b.js","assets/index.aed92d30.css"])),I=({state:n,dispatch:_,navigate:h,user:f})=>{const[b,w]=o.exports.useState(!1),[v,S]=o.exports.useState(!1),g=o.exports.useRef(null),k=()=>{const s=g.current.getScreenshot();s?(_({type:"image",payload:s}),(async()=>{const p=await r(()=>import("./FaceRecognition.07071ae7.js"),[]),x=await r(()=>import("./useDB.50c6ad0b.js"),[]);await p.loadModels();const i=x.makeRequest,l=await i(null,"/pictures",null);let m=!1,d=0,c=1;for(let t=0;t<l.length;t++)try{let a=await p.compareFaces(s,l[t].picture);m=a<.6?!0:m,d=a<c?t:d,c=a<c?a:c}catch{}if(m){const t=await i({picture:l[d].picture},"/facematch",null);sessionStorage.setItem("token",t.token),(await r(()=>import("./TokenLogin.fa8d08cf.js"),[])).default(t.token,i,h,f)}else alert("face not recognized!"),window.location.reload()})()):(alert("Failed to capture picture, try again!"),window.location.reload())};return u(E,{children:[e("hr",{className:"mt-2 mb-3"}),b?e("div",{className:"image-area",children:n.image===null?u("div",{className:"camera mb-5",onClick:k,children:[e(y,{ref:g,screenshotFormat:"image/jpeg",onUserMedia:()=>{S(!0)},height:"100%",width:"100%",videoConstraints:{facingMode:"user"}}),v?e("div",{className:"scan-text",children:"Scan"}):""]}):u("div",{children:[e("h2",{children:"Loading..."}),e("img",{src:n.image,className:"img-fluid user-picture mb-5"})]})}):e("div",{className:"d-grid gap-2",children:e("button",{className:"btn btn-danger",type:"button",onClick:s=>{w(!0)},children:"Or Scan your face to login!"})})]})};export{I as default};
