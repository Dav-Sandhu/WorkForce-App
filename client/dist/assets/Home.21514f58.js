import{u as _,r as i,j as e,F as w,_ as p,a as S,b as a}from"./index.8bf178f5.js";function k(r){const o=new Date(r),n=o.getHours(),t=o.getMinutes().toString().padStart(2,"0"),s=n>=12?"PM":"AM";return`${(n%12||12).toString().padStart(2,"0")}:${t} ${s}`}function g(r){const o=new Date(r);let n=new Date-o;n=Math.max(0,n);const t=Math.floor(n/(1e3*60*60)).toString().padStart(2,"0"),s=Math.floor(n%(1e3*60*60)/(1e3*60)).toString().padStart(2,"0"),c=Math.floor(n%(1e3*60)/1e3).toString().padStart(2,"0");return`${t}:${s}:${c}`}function h(){const r=_(),o=r.userInfo.clock_in,n=r.userInfo.clock_out,[t,s]=i.exports.useState(o===null?new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):n===null?"Hours Worked: "+g(o):"");return i.exports.useEffect(()=>{const c=setInterval(()=>{s(o!==null&&n===null?"Hours Worked: "+g(o):new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))},1e3);return()=>clearInterval(c)},[]),e(w,{children:t})}const y=i.exports.lazy(()=>p(()=>import("./WebCamModal.69132914.js"),["assets/WebCamModal.69132914.js","assets/index.8bf178f5.js","assets/index.c4470b89.css","assets/react-webcam.e6d02f5f.js","assets/WebCamModal.28bc8eda.css"])),D=()=>{const[r,o]=i.exports.useState(!1),n=i.exports.useRef(null),t=_(),s=S(),c=t.userInfo.picture,b=t.userInfo.first_name+" "+t.userInfo.last_name,v=t.userInfo.email,I=t.userInfo.employee_number,l=t.userInfo.clock_in,u=t.userInfo.clock_out,x=t.userInfo.is_supervisor;return a("section",{className:"vh-100",style:{backgroundColor:"#eee"},children:[x&&l!==null?e("button",{type:"button",style:{backgroundColor:"#343a40",color:"#FFFFFF"},onClick:()=>s("/admin"),children:"Admin"}):"",l!==null&&u===null?e(h,{}):"",r?e(y,{ref:n,setWebcamActive:o}):"",e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-md-12 col-xl-4",children:e("div",{className:"card",style:{borderRadius:"15px"},children:a("div",{className:"card-body text-center",children:[e("div",{className:"mt-3 mb-4",children:e("img",{src:c,className:"img-fluid profile-picture",loading:"lazy",style:{width:"100px"},onError:m=>{m.target.onerror=null,m.target.src="/default profile picture.jpg"},onClick:()=>{o(!0)}})}),e("h4",{className:"mb-2",children:b}),e("p",{className:"text-muted mb-4",children:v}),a("div",{className:"home-buttons",children:[e("button",{type:"button",className:"btn btn-primary btn-rounded btn-lg",onClick:()=>{l===null?(async()=>{const d=(await p(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest,f=await d(null,"/clockin",sessionStorage.getItem("token"),"post");sessionStorage.removeItem("token"),sessionStorage.setItem("token",f.token),await(await p(()=>import("./TokenLogin.2eb55c78.js"),[])).default(f.token,d,()=>{},t)})():s("/tasks")},children:l!==null?"Tasks":"Clock In"}),l!==null?e("button",{className:"btn btn-danger btn-rounded btn-lg",onClick:()=>{(async()=>{const d=(await p(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest;await d(null,"/clockout",sessionStorage.getItem("token"),"post"),sessionStorage.removeItem("token"),window.location.reload()})()},children:"Clock Out"}):""]}),a("div",{className:"d-flex justify-content-between text-center mt-5 mb-2",children:[a("div",{children:[e("p",{className:"mb-2 mr-3 h5 text-nowrap ",children:"#"+I}),e("p",{className:"text-muted mb-0",children:"Employee Number"})]}),a("div",{children:[e("p",{className:"mb-2 mr-3 h5 text-nowrap ",children:l===null?e(h,{}):k(u===null?l:u)}),e("p",{className:"text-muted mb-0",children:l===null?"Current Time":u===null?"Clocked In":"Clocked Out"})]})]})]})})})})})]})};export{D as default};
