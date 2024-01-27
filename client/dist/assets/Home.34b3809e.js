import{u as I,r as h,j as e,F as v,a as x,b as r,_ as w}from"./index.0f62cba2.js";function g(t){const o=new Date(t),n=o.getHours(),l=o.getMinutes().toString().padStart(2,"0"),s=n>=12?"PM":"AM";return`${(n%12||12).toString().padStart(2,"0")}:${l} ${s}`}function k(t){const o=new Date(t);let n=new Date-o;n=Math.max(0,n);const l=Math.floor(n/(1e3*60*60)).toString().padStart(2,"0"),s=Math.floor(n%(1e3*60*60)/(1e3*60)).toString().padStart(2,"0"),a=Math.floor(n%(1e3*60)/1e3).toString().padStart(2,"0");return`${l}:${s}:${a}`}function b(){const t=I(),o=t.userInfo.clock_in,n=t.userInfo.clock_out,[l,s]=h.exports.useState(o===null?new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):n===null?"Hours Worked: "+k(o):"");return h.exports.useEffect(()=>{const a=setInterval(()=>{s(o!==null&&n===null?"Hours Worked: "+k(o):new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))},1e3);return()=>clearInterval(a)},[]),e(v,{children:l})}const S=()=>{const t=I(),o=x(),n=t.userInfo.picture.length>0?t.userInfo.picture:"/default profile picture.jpg",l=t.userInfo.first_name+" "+t.userInfo.last_name,s=t.userInfo.email,a="$"+t.userInfo.hourly_wage+"/hour",d=t.userInfo.employee_number,c=t.userInfo.clock_in,m=t.userInfo.clock_out;return r("section",{className:"vh-100",style:{backgroundColor:"#eee"},children:[c!==null&&m===null?e(b,{}):"",e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-md-12 col-xl-4",children:e("div",{className:"card",style:{borderRadius:"15px"},children:r("div",{className:"card-body text-center",children:[e("div",{className:"mt-3 mb-4",children:e("img",{src:n,className:"rounded-circle img-fluid profile-picture",loading:"lazy",style:{width:"100px"},onClick:()=>{const i=document.createElement("input");i.type="file",i.accept="image/*",i.onchange=p=>{const u=p.target.files[0];console.log("Uploaded image:",u),u.size<=1*1024*1024?console.log("Successfull upload"):alert("Image cannot be larger than 1 MB")},i.click()}})}),e("h4",{className:"mb-2",children:l}),e("p",{className:"text-muted mb-4",children:s}),r("div",{className:"home-buttons",children:[e("button",{type:"button",className:"btn btn-primary btn-rounded btn-lg",onClick:()=>{c===null?(async()=>{const u=(await w(()=>import("./useDB.4a39d696.js"),[])).makeRequest,N=await u({employee_number:d},"/clockin",null),f={...t.userInfo,clock_in:N.output[0].clock_in};t.setUserInfo(f);const _=await u(f,"/updateToken",null);sessionStorage.removeItem("token"),sessionStorage.setItem("token",_.token)})():o("/tasks")},children:c!==null?"Tasks":"Clock In"}),c!==null?e("button",{className:"btn btn-info btn-rounded btn-lg",onClick:()=>{o("/working")},children:"Agenda"}):""]}),r("div",{className:"d-flex justify-content-between text-center mt-5 mb-2",children:[r("div",{children:[e("p",{className:"mb-2 mr-3 h5 text-nowrap ",children:"#"+d}),e("p",{className:"text-muted mb-0",children:"Employee Number"})]}),r("div",{children:[e("p",{className:"mb-2 mr-3 h5 text-nowrap ",children:c===null?e(b,{}):g(m===null?c:m)}),e("p",{className:"text-muted mb-0",children:c===null?"Current Time":m===null?"Clocked In":"Clocked Out"})]}),r("div",{className:"px-3",children:[e("p",{className:"mb-2 mr-3 h5 text-nowrap ",children:a}),e("p",{className:"text-muted mb-0",children:"Hourly Wage"})]})]})]})})})})})]})};export{S as default};
