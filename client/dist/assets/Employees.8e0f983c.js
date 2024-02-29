import{r as n,j as e,a as s,F as u,_ as d}from"./index.e4031f32.js";import{N as R}from"./Navbar.9c3b6a29.js";/* empty css               */const L=()=>{const c=sessionStorage.getItem("token"),[p,f]=n.exports.useState([]),[r,w]=n.exports.useState("wage"),[i,k]=n.exports.useState(""),[h,x]=n.exports.useState(0),[b,v]=n.exports.useState(0),[g,y]=n.exports.useState(0),[N,E]=n.exports.useState(""),[_,S]=n.exports.useState(!1),m=async(a,t)=>{const l=(await d(()=>import("./Alert.b3ae36df.js"),["assets/Alert.b3ae36df.js","assets/index.e4031f32.js","assets/index.c4470b89.css"])).customAlert;a===1?await l(t,"","success"):await l("Something Went Wrong!","Please try again.","error")},A=async()=>{const t=(await d(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest,o=await t(null,"/getemployees",c,"get");f(o.output)};return n.exports.useEffect(()=>{A()},[]),e(R,{children:s("section",{className:"update-section",children:[e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-lg-8 col-xl-6",children:e("div",{className:"display-items",children:p.map(a=>e("div",{className:"display-item",children:s("div",{className:"card",children:[e("div",{className:"profile-picture-section",children:e("img",{className:"profile-picture card-img-top",loading:"lazy",src:a.picture,onError:t=>{t.target.onerror=null,t.target.src="/default profile picture.jpg"},alt:"Card image cap"})}),s("div",{className:"card-body",children:[e("h5",{className:"card-title overflow-hidden",children:a.first_name+" "+a.last_name}),a.is_supervisor?e("p",{className:"mb-0 overflow-hidden",children:"Supervisor"}):e("p",{className:"mb-0 overflow-hidden",children:"Employee"}),e("p",{className:"mb-0 overflow-hidden",children:"ADP Number: "+(a.adp_number||"NA")}),e("p",{className:"mb-0 overflow-hidden",children:a.email}),e("p",{className:"mb-0 overflow-hidden",children:"Break Time: "+a.break_time+" min"}),e("p",{className:"mb-0 overflow-hidden",children:"Lunch Time: "+a.lunch_time+" min"}),e("p",{className:"mb-0 overflow-hidden",children:"Hourly Wage: $"+a.hourly_wage}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{(async()=>{const l=(await d(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest,C=await l({employee_number:a.employee_number,first_name:a.first_name,last_name:a.last_name},"/removeemployee",c,"post");await m(C.status,"Employee Deleted!"),window.location.reload()})()},children:"delete"})]})]})},a.employee_number))})})})}),e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-lg-8 col-xl-6",children:e("div",{className:"card rounded-3",children:s("div",{className:"card-body p-4 p-md-5",children:[e("h3",{className:"mb-4 pb-2 pb-md-0 mb-md-5 px-md-2",children:"Update Employee"}),s("form",{className:"px-md-2",children:[e("div",{className:"form-outline mb-4",children:s("select",{className:"form-select",id:"employee_number",name:"employee_number",value:i,onChange:a=>k(a.target.value),children:[e("option",{children:"select employee"}),p.map(a=>e("option",{value:a.employee_number,children:a.first_name+" "+a.last_name+" ("+a.email+")"},a.employee_number))]})}),e("h5",{children:"Select What to Update"}),e("div",{className:"form-outline mb-4",children:s("select",{className:"form-select",id:"select-updated-form",name:"select-updated-form",value:r,onChange:a=>w(a.target.value),children:[e("option",{value:"wage",children:"Hourly Wage"}),e("option",{value:"supervisor",children:"Employee Rank"}),e("option",{value:"break",children:"Break Times"}),e("option",{value:"adp",children:"ADP Number"})]})}),r==="supervisor"?e("div",{className:"form-outline mb-4",children:s("div",{className:"form-check mb-2",children:[e("input",{className:"form-check-input",type:"checkbox",id:"select",checked:_,onChange:()=>S(a=>!a)}),e("label",{className:"form-check-label",htmlFor:"select",children:"Upgrade to Supervisor"})]})}):r==="break"?s(u,{children:[s("div",{className:"input-group mb-3",children:[e("span",{className:"input-group-text",id:"break_time",children:"Break Minutes"}),e("input",{type:"number",className:"form-control",step:"1",value:b,onChange:a=>{const t=parseInt(a.target.value)||0;t>=0?v(t):v(0)}})]}),s("div",{className:"input-group mb-3",children:[e("span",{className:"input-group-text",id:"lunch_time",children:"Lunch Minutes"}),e("input",{type:"number",className:"form-control",step:"1",value:g,onChange:a=>{const t=parseInt(a.target.value)||0;t>=0?y(t):y(0)}})]})]}):r==="adp"?e(u,{children:s("div",{className:"input-group mb-3",children:[e("span",{className:"input-group-text",id:"adp",children:"Update ADP Number"}),e("input",{type:"text",className:"form-control",maxLength:"3",value:N,onChange:a=>E(a.target.value)})]})}):r==="wage"?e(u,{children:s("div",{className:"form-outline mb-4",children:[s("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"$"})}),e("input",{type:"number",step:"0.01",id:"hourly_wage",className:"form-control",value:h,onChange:a=>x(a.target.value)})]}),e("label",{className:"form-label",htmlFor:"hourly_wage",children:"Hourly Wage"})]})}):""]}),e("button",{type:"button",className:"btn btn-success btn-lg mb-1",onClick:()=>{(async()=>{const o=(await d(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest;if(r==="wage"){const l=i.length>0?await o({employee_number:i,hourly_wage:h},"/updateemployeewage",c,"post"):{status:-1};await m(l.status,"Employee Updated!")}else if(r==="supervisor"){const l=_?await o({employee_number:i},"/upgradeuser",c,"post"):await o({employee_number:i},"/downgradeuser",c,"post");await m(l.status,"Employee Updated!")}else if(r==="break"){const l=await o({employee_number:i,break_time:b,lunch_time:g},"/updatebreaktimes",c,"post");await m(l.status,"Employee Updated!")}else if(r==="adp"){const l=await o({employee_number:i,adp_number:N},"/updateadpnumber",c,"post");await m(l.status,"Employee Updated!")}window.location.reload()})()},children:"Update"})]})})})})})]})})};export{L as default};