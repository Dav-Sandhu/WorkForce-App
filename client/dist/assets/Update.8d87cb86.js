import{r as d,_ as p,b as a,F as i,j as e}from"./index.c9c6fab8.js";import{N as w}from"./Navbar.d90219ce.js";const C=d.exports.lazy(()=>p(()=>import("./Currency.7a082ef4.js"),["assets/Currency.7a082ef4.js","assets/index.c9c6fab8.js","assets/index.c4470b89.css"])),x=(l,{type:h,payload:t})=>{switch(h){case"business_name":return{...l,business_name:t};case"logo":return{...l,logo:t};case"contact_name":return{...l,contact_name:t};case"contact_email":return{...l,contact_email:t};case"currency":return{...l,currency:t};case"process_type":return{...l,process_type:t};case"billable":return{...l,billable:!l.billable};case"hourly_rate":return{...l,hourly_rate:parseFloat(t)};case"hourly_wage":return{...l,hourly_wage:parseFloat(t)};case"employee_number":return{...l,employee_number:t};default:return l}},P=()=>{const[l,h]=d.exports.useReducer(x,{business_name:"",logo:"",contact_name:"",contact_email:"",process_type:"",billable:!1,hourly_rate:0,hourly_wage:0,employee_number:"",currency:"CAD"}),[t,y]=d.exports.useState("employees"),[_,g]=d.exports.useState({customers:[],employees:[],processes:[]}),N=async()=>{const o=(await p(()=>import("./useDB.4a39d696.js"),[])).makeRequest,r=sessionStorage.getItem("token"),c=await o(null,"/getcustomers",r),m=await o(null,"/getemployees",r),f=await o(null,"/getinternalprocesses",r);g({customers:c.output,employees:m.output,processes:f.output})},u=async(s,o)=>{const c=(await p(()=>import("./Alert.dcb17d97.js"),["assets/Alert.dcb17d97.js","assets/index.c9c6fab8.js","assets/index.c4470b89.css"])).customAlert;s===1?await c(o,"","success"):await c("Something Went Wrong!","Please try again.","error")},b=async(s,o)=>{const c=(await p(()=>import("./useDB.4a39d696.js"),[])).makeRequest;if(s==="customers"){const m=await c({business_name:o.business_name,contact_email:o.contact_email},"/deletecustomer",null);await u(m.status,"Customer Deleted!")}else if(s==="processes"){const m=await c({process_type:o.process_type},"/deleteinternalprocess",null);await u(m.status,"Process Deleted!")}else if(s==="employees"){const m=await c({employee_number:o.employee_number,first_name:o.first_name,last_name:o.last_name},"/removeemployee",null);await u(m.status,"Employee Deleted!")}window.location.reload()},v=async()=>{const o=(await p(()=>import("./useDB.4a39d696.js"),[])).makeRequest;if(t==="customers"&&l.business_name.length>0&&l.contact_email.length>0&&l.contact_name.length>0&&l.currency.length>0){const r=await o({business_name:l.business_name,logo:l.logo,contact_name:l.contact_name,contact_email:l.contact_email,currency:l.currency},"/addcustomer",null);await u(r.status,"Customer Added!")}else if(t==="processes"&&l.process_type.length>0){const r=await o({process_type:l.process_type,billable:l.billable?1:0,hourly_rate:l.billable?l.hourly_rate:null},"/addinternalprocess",null);await u(r.status,"Process Added!")}else if(t==="employees"&&l.employee_number.length>0){const r=l.employee_number.length>0?await o({employee_number:l.employee_number,hourly_wage:l.hourly_wage},"/updateemployeewage",null):{status:-1};await u(r.status,"Employee Updated!")}window.location.reload()},n=s=>{h({type:s.target.id,payload:s.target.value})};return d.exports.useEffect(()=>{N()},[]),a(i,{children:[e(w,{}),a("section",{className:"h-100 h-custom update-section",children:[e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:a("div",{className:"col-lg-8 col-xl-6",children:[e("button",{type:"button",className:"btn btn-dark btn-lg mb-1",onClick:()=>{y(s=>s==="employees"?"customers":s==="customers"?"processes":"employees")},children:t==="customers"?"Switch to Processes":t==="employees"?"Switch to Customers":"Switch to Employees"}),e("div",{className:"display-items",children:_[t].map(s=>{const o=s.hasOwnProperty("business_name")?"customers":s.hasOwnProperty("process_type")?"processes":"employees";return e("div",{className:"display-item",children:o==="customers"?e(i,{children:a("div",{className:"card",children:[e("div",{className:"logo-section",children:e("img",{className:"company-logo card-img-top",loading:"lazy",onError:r=>{r.target.onerror=null,r.target.src="/customers.png"},src:s.logo,alt:"Card image cap"})}),a("div",{className:"card-body",children:[e("h5",{className:"card-title overflow-hidden",children:s.business_name}),e("p",{className:"mb-0 overflow-hidden",children:s.contact_name}),e("p",{className:"mb-0 overflow-hidden",children:s.contact_email}),a("p",{className:"mb-0 overflow-hidden",children:["Currency: ",s.currency]}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{b(o,s)},children:"delete"})]})]})}):o==="processes"?a(i,{children:[e("div",{className:"card-header p-4 pb-0",children:e("h3",{className:"mb-0 overflow-hidden",children:s.process_type})}),a("div",{className:"card-body p-4 pt-0",children:[a("p",{className:"mb-0 overflow-hidden",children:["Billable: ",s.billable?"Yes":"No"]}),a("p",{className:"mb-0 overflow-hidden",children:["Hourly Rate: ",s.hourly_rate]}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{b(o,s)},children:"delete"})]})]}):e(i,{children:a("div",{className:"card",children:[e("div",{className:"profile-picture-section",children:e("img",{className:"profile-picture card-img-top",loading:"lazy",src:s.picture,onError:r=>{r.target.onerror=null,r.target.src="/default profile picture.jpg"},alt:"Card image cap"})}),a("div",{className:"card-body",children:[e("h5",{className:"card-title overflow-hidden",children:s.first_name+" "+s.last_name}),e("p",{className:"mb-0 overflow-hidden",children:"#"+s.employee_number}),e("p",{className:"mb-0 overflow-hidden",children:s.email}),e("p",{className:"mb-0 overflow-hidden",children:"Hourly Wage: $"+s.hourly_wage}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{b(o,s)},children:"delete"})]})]})})},o==="customers"?s.business_name+s.contact_email:o==="processes"?s.process_type:s.employee_number)})})]})})}),e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-lg-8 col-xl-6",children:e("div",{className:"card rounded-3",children:a("div",{className:"card-body p-4 p-md-5",children:[e("h3",{className:"mb-4 pb-2 pb-md-0 mb-md-5 px-md-2",children:t==="customers"?"Add Customer":t==="processes"?"Add Proccess":"Update Employee"}),e("form",{className:"px-md-2",children:t==="customers"?a(i,{children:[a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"business_name",className:"form-control",value:l.business_name,onChange:n}),e("label",{className:"form-label",htmlFor:"business_name",children:"Business Name"})]}),a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"logo",className:"form-control",value:l.logo,onChange:n}),e("label",{className:"form-label",htmlFor:"logo",children:"Link to Logo Image"})]}),a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"contact_name",className:"form-control",value:l.contact_name,onChange:n}),e("label",{className:"form-label",htmlFor:"contact_name",children:"Contact Name"})]}),a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"@"})}),e("input",{type:"email",id:"contact_email",className:"form-control",value:l.contact_email,onChange:n})]}),e("label",{className:"form-label",htmlFor:"contact_email",children:"Contact Email"})]}),e("div",{className:"form-outline mb-4",children:e(C,{handleUpdate:n,value:l.currency})})]}):t==="processes"?a(i,{children:[a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"process_type",className:"form-control",value:l.process_type,onChange:n}),e("label",{className:"form-label",htmlFor:"process_type",children:"Process Type"})]}),e("div",{className:"form-outline mb-4",children:a("div",{className:"form-check mb-2",children:[e("input",{className:"form-check-input",type:"checkbox",id:"billable",checked:l.billable,onChange:()=>{h({type:"billable",value:""})}}),e("label",{className:"form-check-label",htmlFor:"billable",children:"Billable?"})]})}),l.billable?a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"$"})}),e("input",{type:"number",step:"0.01",id:"hourly_rate",className:"form-control",value:l.hourly_rate,onChange:n})]}),e("label",{className:"form-label",htmlFor:"hourly_rate",children:"Hourly Rate"})]}):""]}):a(i,{children:[e("div",{className:"form-outline mb-4",children:a("select",{className:"form-select",id:"employee_number",name:"employee_number",value:l.employee_number,onChange:n,children:[e("option",{children:"select employee number"}),_[t].map(s=>e("option",{value:s.employee_number,children:s.employee_number},s.employee_number))]})}),a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"$"})}),e("input",{type:"number",step:"0.01",id:"hourly_wage",className:"form-control",value:l.hourly_wage,onChange:n})]}),e("label",{className:"form-label",htmlFor:"hourly_wage",children:"Hourly Wage"})]})]})}),e("button",{type:"button",className:"btn btn-success btn-lg mb-1",onClick:()=>{v()},children:t==="employees"?"Update":"Add"})]})})})})})]})]})};export{P as default};
