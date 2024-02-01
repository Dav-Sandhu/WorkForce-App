import{u as k,r as i,j as e,F as y,_,a as S,b as l}from"./index.c817b9de.js";function h(r){const o=new Date(r),n=o.getHours(),t=o.getMinutes().toString().padStart(2,"0"),s=n>=12?"PM":"AM";return`${(n%12||12).toString().padStart(2,"0")}:${t} ${s}`}function g(r){const o=new Date(r);let n=new Date-o;n=Math.max(0,n);const t=Math.floor(n/(1e3*60*60)).toString().padStart(2,"0"),s=Math.floor(n%(1e3*60*60)/(1e3*60)).toString().padStart(2,"0"),a=Math.floor(n%(1e3*60)/1e3).toString().padStart(2,"0");return`${t}:${s}:${a}`}function b(){const r=k(),o=r.userInfo.clock_in,n=r.userInfo.clock_out,[t,s]=i.exports.useState(o===null?new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):n===null?"Hours Worked: "+g(o):"");return i.exports.useEffect(()=>{const a=setInterval(()=>{s(o!==null&&n===null?"Hours Worked: "+g(o):new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))},1e3);return()=>clearInterval(a)},[]),e(y,{children:t})}const T=i.exports.lazy(()=>_(()=>import("./WebCamModal.77f2d15a.js"),["assets/WebCamModal.77f2d15a.js","assets/index.c817b9de.js","assets/index.c4470b89.css","assets/react-webcam.d0556f11.js","assets/WebCamModal.28bc8eda.css"])),H=()=>{const[r,o]=i.exports.useState(!1),n=i.exports.useRef(null),t=k(),s=S(),a=t.userInfo.picture.length>0?t.userInfo.picture:"/default profile picture.jpg",v=t.userInfo.first_name+" "+t.userInfo.last_name,x=t.userInfo.email,I="$"+t.userInfo.hourly_wage+"/hour",d=t.userInfo.employee_number,c=t.userInfo.clock_in,u=t.userInfo.clock_out;return l("section",{className:"vh-100",style:{backgroundColor:"#eee"},children:[c!==null&&u===null?e(b,{}):"",r?e(T,{ref:n,setWebcamActive:o}):"",e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-md-12 col-xl-4",children:e("div",{className:"card",style:{borderRadius:"15px"},children:l("div",{className:"card-body text-center",children:[e("div",{className:"mt-3 mb-4",children:e("img",{src:a,className:"img-fluid profile-picture",loading:"lazy",style:{width:"100px"},onError:m=>{m.target.onerror=null,m.target.src="/default profile picture.jpg"},onClick:()=>{o(!0)}})}),e("h4",{className:"mb-2",children:v}),e("p",{className:"text-muted mb-4",children:x}),l("div",{className:"home-buttons",children:[e("button",{type:"button",className:"btn btn-primary btn-rounded btn-lg",onClick:()=>{c===null?(async()=>{const p=(await _(()=>import("./useDB.4a39d696.js"),[])).makeRequest,N=await p({employee_number:d},"/clockin",null),f={...t.userInfo,clock_in:N.output[0].clock_in};t.setUserInfo(f);const w=await p(f,"/updateToken",null);sessionStorage.removeItem("token"),sessionStorage.setItem("token",w.token)})():s("/tasks")},children:c!==null?"Tasks":"Clock In"}),c!==null?e("button",{className:"btn btn-info btn-rounded btn-lg",onClick:()=>{s("/working")},children:"Agenda"}):""]}),l("div",{className:"d-flex justify-content-between text-center mt-5 mb-2",children:[l("div",{children:[e("p",{className:"mb-2 mr-3 h5 text-nowrap ",children:"#"+d}),e("p",{className:"text-muted mb-0",children:"Employee Number"})]}),l("div",{children:[e("p",{className:"mb-2 mr-3 h5 text-nowrap ",children:c===null?e(b,{}):h(u===null?c:u)}),e("p",{className:"text-muted mb-0",children:c===null?"Current Time":u===null?"Clocked In":"Clocked Out"})]}),l("div",{className:"px-3",children:[e("p",{className:"mb-2 mr-3 h5 text-nowrap ",children:I}),e("p",{className:"text-muted mb-0",children:"Hourly Wage"})]})]})]})})})})})]})};export{H as default};