import{r as h,_ as b,b as a,F as u,j as e}from"./index.9c69cc86.js";import{N as w}from"./Navbar.0dda6b56.js";const C=h.exports.lazy(()=>b(()=>import("./Currency.c1c1126b.js"),["assets/Currency.c1c1126b.js","assets/index.9c69cc86.js","assets/index.c4470b89.css"])),x=(o,{type:l,payload:c})=>{switch(l){case"business_name":return{...o,business_name:c};case"logo":return{...o,logo:c};case"contact_name":return{...o,contact_name:c};case"contact_email":return{...o,contact_email:c};case"currency":return{...o,currency:c};case"process_type":return{...o,process_type:c};case"billable":return{...o,billable:!o.billable};case"hourly_rate":return{...o,hourly_rate:parseFloat(c)};case"hourly_wage":return{...o,hourly_wage:parseFloat(c)};case"employee_number":return{...o,employee_number:c};default:return o}},P=()=>{const o=sessionStorage.getItem("token"),[l,c]=h.exports.useReducer(x,{business_name:"",logo:"",contact_name:"",contact_email:"",process_type:"",billable:!1,hourly_rate:0,hourly_wage:0,employee_number:"",currency:"CAD"}),[n,g]=h.exports.useState("employees"),[y,N]=h.exports.useState({customers:[],employees:[],processes:[]}),v=async()=>{const t=(await b(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest,r=await t(null,"/getcustomers",o,"get"),i=await t(null,"/getemployees",o,"get"),d=await t(null,"/getinternalprocesses",o,"get");N({customers:r.output,employees:i.output,processes:d.output})},p=async(s,t)=>{const i=(await b(()=>import("./Alert.c6833733.js"),["assets/Alert.c6833733.js","assets/index.9c69cc86.js","assets/index.c4470b89.css"])).customAlert;s===1?await i(t,"","success"):await i("Something Went Wrong!","Please try again.","error")},_=async(s,t)=>{const i=(await b(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest;if(s==="customers"){const d=await i({business_name:t.business_name,contact_email:t.contact_email},"/deletecustomer",o,"post");await p(d.status,"Customer Deleted!")}else if(s==="processes"){const d=await i({process_type:t.process_type},"/deleteinternalprocess",o,"post");await p(d.status,"Process Deleted!")}else if(s==="employees"){const d=await i({employee_number:t.employee_number,first_name:t.first_name,last_name:t.last_name},"/removeemployee",o,"post");await p(d.status,"Employee Deleted!")}window.location.reload()},f=async()=>{const t=(await b(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest;if(n==="customers"&&l.business_name.length>0&&l.contact_email.length>0&&l.contact_name.length>0&&l.currency.length>0){const r=await t({business_name:l.business_name,logo:l.logo,contact_name:l.contact_name,contact_email:l.contact_email,currency:l.currency},"/addcustomer",o,"post");await p(r.status,"Customer Added!")}else if(n==="processes"&&l.process_type.length>0){const r=await t({process_type:l.process_type,billable:l.billable?1:0,hourly_rate:l.billable?l.hourly_rate:null},"/addinternalprocess",o,"post");await p(r.status,"Process Added!")}else if(n==="employees"&&l.employee_number.length>0){const r=l.employee_number.length>0?await t({employee_number:l.employee_number,hourly_wage:l.hourly_wage},"/updateemployeewage",o,"post"):{status:-1};await p(r.status,"Employee Updated!")}window.location.reload()},m=s=>{c({type:s.target.id,payload:s.target.value})};return h.exports.useEffect(()=>{v()},[]),a(u,{children:[e(w,{}),a("section",{className:"h-100 h-custom update-section",children:[e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:a("div",{className:"col-lg-8 col-xl-6",children:[e("button",{type:"button",className:"btn btn-dark btn-lg mb-1",onClick:()=>{g(s=>s==="employees"?"customers":s==="customers"?"processes":"employees")},children:n==="customers"?"Switch to Processes":n==="employees"?"Switch to Customers":"Switch to Employees"}),e("div",{className:"display-items",children:y[n].map(s=>{const t=s.hasOwnProperty("business_name")?"customers":s.hasOwnProperty("process_type")?"processes":"employees";return e("div",{className:"display-item",children:t==="customers"?e(u,{children:a("div",{className:"card",children:[e("div",{className:"logo-section",children:e("img",{className:"company-logo card-img-top",loading:"lazy",onError:r=>{r.target.onerror=null,r.target.src="/customers.png"},src:s.logo,alt:"Card image cap"})}),a("div",{className:"card-body",children:[e("h5",{className:"card-title overflow-hidden",children:s.business_name}),e("p",{className:"mb-0 overflow-hidden",children:s.contact_name}),e("p",{className:"mb-0 overflow-hidden",children:s.contact_email}),a("p",{className:"mb-0 overflow-hidden",children:["Currency: ",s.currency]}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{_(t,s)},children:"delete"})]})]})}):t==="processes"?a(u,{children:[e("div",{className:"card-header p-4 pb-0",children:e("h3",{className:"mb-0 overflow-hidden",children:s.process_type})}),a("div",{className:"card-body p-4 pt-0",children:[a("p",{className:"mb-0 overflow-hidden",children:["Billable: ",s.billable?"Yes":"No"]}),a("p",{className:"mb-0 overflow-hidden",children:["Hourly Rate: ",s.hourly_rate]}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{_(t,s)},children:"delete"})]})]}):e(u,{children:a("div",{className:"card",children:[e("div",{className:"profile-picture-section",children:e("img",{className:"profile-picture card-img-top",loading:"lazy",src:s.picture,onError:r=>{r.target.onerror=null,r.target.src="/default profile picture.jpg"},alt:"Card image cap"})}),a("div",{className:"card-body",children:[e("h5",{className:"card-title overflow-hidden",children:s.first_name+" "+s.last_name}),e("p",{className:"mb-0 overflow-hidden",children:"#"+s.employee_number}),e("p",{className:"mb-0 overflow-hidden",children:s.email}),e("p",{className:"mb-0 overflow-hidden",children:"Hourly Wage: $"+s.hourly_wage}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{_(t,s)},children:"delete"})]})]})})},t==="customers"?s.business_name+s.contact_email:t==="processes"?s.process_type:s.employee_number)})})]})})}),e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-lg-8 col-xl-6",children:e("div",{className:"card rounded-3",children:a("div",{className:"card-body p-4 p-md-5",children:[e("h3",{className:"mb-4 pb-2 pb-md-0 mb-md-5 px-md-2",children:n==="customers"?"Add Customer":n==="processes"?"Add Proccess":"Update Employee"}),e("form",{className:"px-md-2",children:n==="customers"?a(u,{children:[a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"business_name",className:"form-control",value:l.business_name,onChange:m}),e("label",{className:"form-label",htmlFor:"business_name",children:"Business Name"})]}),a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"logo",className:"form-control",value:l.logo,onChange:m}),e("label",{className:"form-label",htmlFor:"logo",children:"Link to Logo Image"})]}),a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"contact_name",className:"form-control",value:l.contact_name,onChange:m}),e("label",{className:"form-label",htmlFor:"contact_name",children:"Contact Name"})]}),a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"@"})}),e("input",{type:"email",id:"contact_email",className:"form-control",value:l.contact_email,onChange:m})]}),e("label",{className:"form-label",htmlFor:"contact_email",children:"Contact Email"})]}),e("div",{className:"form-outline mb-4",children:e(C,{handleUpdate:m,value:l.currency})})]}):n==="processes"?a(u,{children:[a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"process_type",className:"form-control",value:l.process_type,onChange:m}),e("label",{className:"form-label",htmlFor:"process_type",children:"Process Type"})]}),e("div",{className:"form-outline mb-4",children:a("div",{className:"form-check mb-2",children:[e("input",{className:"form-check-input",type:"checkbox",id:"billable",checked:l.billable,onChange:()=>{c({type:"billable",value:""})}}),e("label",{className:"form-check-label",htmlFor:"billable",children:"Billable?"})]})}),l.billable?a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"$"})}),e("input",{type:"number",step:"0.01",id:"hourly_rate",className:"form-control",value:l.hourly_rate,onChange:m})]}),e("label",{className:"form-label",htmlFor:"hourly_rate",children:"Hourly Rate"})]}):""]}):a(u,{children:[e("div",{className:"form-outline mb-4",children:a("select",{className:"form-select",id:"employee_number",name:"employee_number",value:l.employee_number,onChange:m,children:[e("option",{children:"select employee number"}),y[n].map(s=>e("option",{value:s.employee_number,children:s.employee_number},s.employee_number))]})}),a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"$"})}),e("input",{type:"number",step:"0.01",id:"hourly_wage",className:"form-control",value:l.hourly_wage,onChange:m})]}),e("label",{className:"form-label",htmlFor:"hourly_wage",children:"Hourly Wage"})]})]})}),e("button",{type:"button",className:"btn btn-success btn-lg mb-1",onClick:()=>{f()},children:n==="employees"?"Update":"Add"})]})})})})})]})]})};export{P as default};