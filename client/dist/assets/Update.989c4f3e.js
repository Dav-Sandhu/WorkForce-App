import{r as d,_ as p,b as a,F as i,j as e}from"./index.3f21815a.js";import{N as v}from"./Navbar.7b6ab3c5.js";const w=d.exports.lazy(()=>p(()=>import("./Currency.7992d867.js"),["assets/Currency.7992d867.js","assets/index.3f21815a.js","assets/index.c4470b89.css"])),C=(l,{type:h,payload:t})=>{switch(h){case"business_name":return{...l,business_name:t};case"logo":return{...l,logo:t};case"contact_name":return{...l,contact_name:t};case"contact_email":return{...l,contact_email:t};case"currency":return{...l,currency:t};case"process_type":return{...l,process_type:t};case"billable":return{...l,billable:!l.billable};case"hourly_rate":return{...l,hourly_rate:parseFloat(t)};case"hourly_wage":return{...l,hourly_wage:parseFloat(t)};case"employee_number":return{...l,employee_number:t};default:return l}},E=()=>{const[l,h]=d.exports.useReducer(C,{business_name:"",logo:"",contact_name:"",contact_email:"",process_type:"",billable:!1,hourly_rate:0,hourly_wage:0,employee_number:"",currency:"CAD"}),[t,N]=d.exports.useState("customers"),[y,b]=d.exports.useState([]),g=async()=>{const o=(await p(()=>import("./useDB.4a39d696.js"),[])).makeRequest,n=sessionStorage.getItem("token");if(t==="customers"){const c=await o(null,"/getcustomers",n);b(c.output)}else if(t==="processes"){const c=await o(null,"/getinternalprocesses",n);b(c.output)}else if(t==="employees"){const c=await o(null,"/getemployees",n);b(c.output)}};d.exports.useEffect(()=>{g()},[t]);const m=async(s,o)=>{const c=(await p(()=>import("./Alert.4ea9295f.js"),["assets/Alert.4ea9295f.js","assets/index.3f21815a.js","assets/index.c4470b89.css"])).customAlert;s===1?await c(o,"","success"):await c("Something Went Wrong!","Please try again.","error")},_=async(s,o)=>{const c=(await p(()=>import("./useDB.4a39d696.js"),[])).makeRequest;if(s==="customers"){const u=await c({business_name:o.business_name,contact_email:o.contact_email},"/deletecustomer",null);await m(u.status,"Customer Deleted!")}else if(s==="processes"){const u=await c({process_type:o.process_type},"/deleteinternalprocess",null);await m(u.status,"Process Deleted!")}else if(s==="employees"){const u=await c({employee_number:o.employee_number},"/removeemployee",null);await m(u.status,"Employee Deleted!")}window.location.reload()},f=async()=>{const o=(await p(()=>import("./useDB.4a39d696.js"),[])).makeRequest;if(t==="customers"&&l.business_name.length>0&&l.contact_email.length>0&&l.contact_name.length>0&&l.currency.length>0){const n=await o({business_name:l.business_name,logo:l.logo,contact_name:l.contact_name,contact_email:l.contact_email,currency:l.currency},"/addcustomer",null);await m(n.status,"Customer Added!")}else if(t==="processes"&&l.process_type.length>0){const n=await o({process_type:l.process_type,billable:l.billable?1:0,hourly_rate:l.billable?l.hourly_rate:null},"/addinternalprocess",null);await m(n.status,"Process Added!")}else if(t==="employees"&&l.employee_number.length>0){const n=l.employee_number.length>0?await o({employee_number:l.employee_number,hourly_wage:l.hourly_wage},"/updateemployeewage",null):{status:-1};await m(n.status,"Employee Updated!")}window.location.reload()},r=s=>{h({type:s.target.id,payload:s.target.value})};return a(i,{children:[e(v,{}),a("section",{className:"h-100 h-custom update-section",children:[e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:a("div",{className:"col-lg-8 col-xl-6",children:[e("button",{type:"button",className:"btn btn-dark btn-lg mb-1",onClick:()=>{N(s=>s==="employees"?"customers":s==="customers"?"processes":"employees")},children:t==="customers"?"Switch to Processes":t==="employees"?"Switch to Customers":"Switch to Employees"}),e("div",{className:"display-items",children:y.map(s=>{const o=s.hasOwnProperty("business_name")?"customers":s.hasOwnProperty("process_type")?"processes":"employees";return e("div",{className:"display-item",children:o==="customers"?e(i,{children:a("div",{className:"card",children:[e("div",{className:"logo-section",children:e("img",{className:"company-logo card-img-top",src:s.logo,alt:"Card image cap"})}),a("div",{className:"card-body",children:[e("h5",{className:"card-title overflow-hidden",children:s.business_name}),e("p",{className:"mb-0 overflow-hidden",children:s.contact_name}),e("p",{className:"mb-0 overflow-hidden",children:s.contact_email}),a("p",{className:"mb-0 overflow-hidden",children:["Currency: ",s.currency]}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{_(o,s)},children:"delete"})]})]})}):o==="processes"?a(i,{children:[e("div",{className:"card-header p-4 pb-0",children:e("h3",{className:"mb-0 overflow-hidden",children:s.process_type})}),a("div",{className:"card-body p-4 pt-0",children:[a("p",{className:"mb-0 overflow-hidden",children:["Billable: ",s.billable?"Yes":"No"]}),a("p",{className:"mb-0 overflow-hidden",children:["Hourly Rate: ",s.hourly_rate]}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{_(o,s)},children:"delete"})]})]}):e(i,{children:a("div",{className:"card",children:[e("div",{className:"profile-picture-section",children:e("img",{className:"profile-picture card-img-top",src:s.picture.length>0?s.picture:"/default profile picture.jpg",alt:"Card image cap"})}),a("div",{className:"card-body",children:[e("h5",{className:"card-title overflow-hidden",children:s.first_name+" "+s.last_name}),e("p",{className:"mb-0 overflow-hidden",children:"#"+s.employee_number}),e("p",{className:"mb-0 overflow-hidden",children:s.email}),e("p",{className:"mb-0 overflow-hidden",children:"Hourly Wage: $"+s.hourly_wage}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{_(o,s)},children:"delete"})]})]})})},o==="customers"?s.business_name+s.contact_email:o==="processes"?s.process_type:s.employee_number)})})]})})}),e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-lg-8 col-xl-6",children:e("div",{className:"card rounded-3",children:a("div",{className:"card-body p-4 p-md-5",children:[e("h3",{className:"mb-4 pb-2 pb-md-0 mb-md-5 px-md-2",children:t==="customers"?"Add Customer":t==="processes"?"Add Proccess":"Update Employee"}),e("form",{className:"px-md-2",children:t==="customers"?a(i,{children:[a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"business_name",className:"form-control",value:l.business_name,onChange:r}),e("label",{className:"form-label",htmlFor:"business_name",children:"Business Name"})]}),a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"logo",className:"form-control",value:l.logo,onChange:r}),e("label",{className:"form-label",htmlFor:"logo",children:"Link to Logo Image"})]}),a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"contact_name",className:"form-control",value:l.contact_name,onChange:r}),e("label",{className:"form-label",htmlFor:"contact_name",children:"Contact Name"})]}),a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"@"})}),e("input",{type:"email",id:"contact_email",className:"form-control",value:l.contact_email,onChange:r})]}),e("label",{className:"form-label",htmlFor:"contact_email",children:"Contact Email"})]}),e("div",{className:"form-outline mb-4",children:e(w,{handleUpdate:r,value:l.currency})})]}):t==="processes"?a(i,{children:[a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"process_type",className:"form-control",value:l.process_type,onChange:r}),e("label",{className:"form-label",htmlFor:"process_type",children:"Process Type"})]}),e("div",{className:"form-outline mb-4",children:a("div",{className:"form-check mb-2",children:[e("input",{className:"form-check-input",type:"checkbox",id:"billable",checked:l.billable,onChange:()=>{h({type:"billable",value:""})}}),e("label",{className:"form-check-label",htmlFor:"billable",children:"Billable?"})]})}),l.billable?a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"$"})}),e("input",{type:"number",step:"0.01",id:"hourly_rate",className:"form-control",value:l.hourly_rate,onChange:r})]}),e("label",{className:"form-label",htmlFor:"hourly_rate",children:"Hourly Rate"})]}):""]}):a(i,{children:[e("div",{className:"form-outline mb-4",children:a("select",{className:"form-select",id:"employee_number",name:"employee_number",value:l.employee_number,onChange:r,children:[e("option",{children:"select employee number"}),y.map(s=>e("option",{value:s.employee_number,children:s.employee_number},s.employee_number))]})}),a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"$"})}),e("input",{type:"number",step:"0.01",id:"hourly_wage",className:"form-control",value:l.hourly_wage,onChange:r})]}),e("label",{className:"form-label",htmlFor:"hourly_wage",children:"Hourly Wage"})]})]})}),e("button",{type:"button",className:"btn btn-success btn-lg mb-1",onClick:()=>{f()},children:t==="employees"?"Update":"Add"})]})})})})})]})]})};export{E as default};
