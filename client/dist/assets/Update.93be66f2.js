import{r as m,_ as d,b as a,F as i,j as e}from"./index.40598bcc.js";import{N as f}from"./Navbar.bd88b8d1.js";const v=m.exports.lazy(()=>d(()=>import("./Currency.37decb01.js"),["assets/Currency.37decb01.js","assets/index.40598bcc.js","assets/index.c4470b89.css"])),w=(s,{type:u,payload:t})=>{switch(u){case"business_name":return{...s,business_name:t};case"logo":return{...s,logo:t};case"contact_name":return{...s,contact_name:t};case"contact_email":return{...s,contact_email:t};case"currency":return{...s,currency:t};case"process_type":return{...s,process_type:t};case"billable":return{...s,billable:!s.billable};case"hourly_rate":return{...s,hourly_rate:parseFloat(t)};case"hourly_wage":return{...s,hourly_wage:parseFloat(t)};case"employee_number":return{...s,employee_number:t};default:return s}},k=()=>{const[s,u]=m.exports.useReducer(w,{business_name:"",logo:"",contact_name:"",contact_email:"",process_type:"",billable:!1,hourly_rate:0,hourly_wage:0,employee_number:""}),[t,y]=m.exports.useState("customers"),[b,p]=m.exports.useState([]),g=async()=>{const o=(await d(()=>import("./useDB.4a39d696.js"),[])).makeRequest,c=sessionStorage.getItem("token");if(t==="customers"){const n=await o(null,"/getcustomers",c);p(n.output)}else if(t==="processes"){const n=await o(null,"/getinternalprocesses",c);p(n.output)}else if(t==="employees"){const n=await o(null,"/getemployees",c);p(n.output)}};m.exports.useEffect(()=>{g()},[t]);const h=async(l,o)=>{const n=(await d(()=>import("./useDB.4a39d696.js"),[])).makeRequest;l==="customers"?(await n({business_name:o.business_name,contact_email:o.contact_email},"/deletecustomer",null)).status===1?alert("Customer Deleted"):alert("Something went wrong"):l==="processes"?(await n({process_type:o.process_type},"/deleteinternalprocess",null)).status===1?alert("Process Deleted"):alert("Something went wrong"):l==="employees"&&((await n({employee_number:o.employee_number},"/removeemployee",null)).status===1?alert("Employee Deleted"):alert("Something went wrong")),window.location.reload()},N=async()=>{const o=(await d(()=>import("./useDB.4a39d696.js"),[])).makeRequest;t==="customers"?(await o({business_name:s.business_name,logo:s.logo,contact_name:s.contact_name,contact_email:s.contact_email,currency:s.currency},"/addcustomer",null)).status===1?alert("Customer Added"):alert("Something went wrong"):t==="processes"?(await o({process_type:s.process_type,billable:s.billable?1:0,hourly_rate:s.billable?s.hourly_rate:null},"/addinternalprocess",null)).status===1?alert("Process Added"):alert("Something went wrong"):t==="employees"&&((s.employee_number.length>0?await o({employee_number:s.employee_number,hourly_wage:s.hourly_wage},"/updateemployeewage",null):{status:-1}).status===1?alert("Employee updated!"):alert("Something went wrong")),window.location.reload()},r=l=>{u({type:l.target.id,payload:l.target.value})};return a(i,{children:[e(f,{}),a("section",{className:"h-100 h-custom update-section",children:[e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:a("div",{className:"col-lg-8 col-xl-6",children:[e("button",{type:"button",className:"btn btn-dark btn-lg mb-1",onClick:()=>{y(l=>l==="employees"?"customers":l==="customers"?"processes":"employees")},children:t==="customers"?"Switch to Processes":t==="employees"?"Switch to Customers":"Switch to Employees"}),e("div",{className:"display-items",children:b.map(l=>{const o=l.hasOwnProperty("business_name")?"customers":l.hasOwnProperty("process_type")?"processes":"employees";return e("div",{className:"display-item",children:o==="customers"?e(i,{children:a("div",{className:"card",children:[e("div",{className:"logo-section",children:e("img",{className:"company-logo card-img-top",src:l.logo,alt:"Card image cap"})}),a("div",{className:"card-body",children:[e("h5",{className:"card-title overflow-hidden",children:l.business_name}),e("p",{className:"mb-0 overflow-hidden",children:l.contact_name}),e("p",{className:"mb-0 overflow-hidden",children:l.contact_email}),a("p",{className:"mb-0 overflow-hidden",children:["Currency: ",l.currency]}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{h(o,l)},children:"delete"})]})]})}):o==="processes"?a(i,{children:[e("div",{className:"card-header p-4 pb-0",children:e("h3",{className:"mb-0 overflow-hidden",children:l.process_type})}),a("div",{className:"card-body p-4 pt-0",children:[a("p",{className:"mb-0 overflow-hidden",children:["Billable: ",l.billable?"Yes":"No"]}),a("p",{className:"mb-0 overflow-hidden",children:["Hourly Rate: ",l.hourly_rate]}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{h(o,l)},children:"delete"})]})]}):e(i,{children:a("div",{className:"card",children:[e("div",{className:"profile-picture-section",children:e("img",{className:"profile-picture card-img-top",src:l.picture.length>0?l.picture:"/default profile picture.jpg",alt:"Card image cap"})}),a("div",{className:"card-body",children:[e("h5",{className:"card-title overflow-hidden",children:l.first_name+" "+l.last_name}),e("p",{className:"mb-0 overflow-hidden",children:"#"+l.employee_number}),e("p",{className:"mb-0 overflow-hidden",children:l.email}),e("p",{className:"mb-0 overflow-hidden",children:"Hourly Wage: $"+l.hourly_wage}),e("button",{type:"button",className:"btn btn-danger",onClick:()=>{h(o,l)},children:"delete"})]})]})})},o==="customers"?l.business_name+l.contact_email:o==="processes"?l.process_type:l.employee_number)})})]})})}),e("div",{className:"container py-5 h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-lg-8 col-xl-6",children:e("div",{className:"card rounded-3",children:a("div",{className:"card-body p-4 p-md-5",children:[e("h3",{className:"mb-4 pb-2 pb-md-0 mb-md-5 px-md-2",children:t==="customers"?"Add Customer":t==="processes"?"Add Proccess":"Update Employee"}),e("form",{className:"px-md-2",children:t==="customers"?a(i,{children:[a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"business_name",className:"form-control",value:s.business_name,onChange:r}),e("label",{className:"form-label",htmlFor:"business_name",children:"Business Name"})]}),a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"logo",className:"form-control",value:s.logo,onChange:r}),e("label",{className:"form-label",htmlFor:"logo",children:"Link to Logo Image"})]}),a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"contact_name",className:"form-control",value:s.contact_name,onChange:r}),e("label",{className:"form-label",htmlFor:"contact_name",children:"Contact Name"})]}),a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"@"})}),e("input",{type:"email",id:"contact_email",className:"form-control",value:s.contact_email,onChange:r})]}),e("label",{className:"form-label",htmlFor:"contact_email",children:"Contact Email"})]}),e("div",{className:"form-outline mb-4",children:e(v,{handleUpdate:r,value:s.currency})})]}):t==="processes"?a(i,{children:[a("div",{className:"form-outline mb-4",children:[e("input",{type:"text",id:"process_type",className:"form-control",value:s.process_type,onChange:r}),e("label",{className:"form-label",htmlFor:"process_type",children:"Process Type"})]}),e("div",{className:"form-outline mb-4",children:a("div",{className:"form-check mb-2",children:[e("input",{className:"form-check-input",type:"checkbox",id:"billable",checked:s.billable,onChange:()=>{u({type:"billable",value:""})}}),e("label",{className:"form-check-label",htmlFor:"billable",children:"Billable?"})]})}),s.billable?a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"$"})}),e("input",{type:"number",step:"0.01",id:"hourly_rate",className:"form-control",value:s.hourly_rate,onChange:r})]}),e("label",{className:"form-label",htmlFor:"hourly_rate",children:"Hourly Rate"})]}):""]}):a(i,{children:[e("div",{className:"form-outline mb-4",children:a("select",{className:"form-select",id:"employee_number",name:"employee_number",value:s.employee_number,onChange:r,children:[e("option",{children:"select employee number"}),b.map(l=>e("option",{value:l.employee_number,children:l.employee_number},l.employee_number))]})}),a("div",{className:"form-outline mb-4",children:[a("div",{className:"input-group mb-2",children:[e("div",{className:"input-group-prepend",children:e("div",{className:"input-group-text",children:"$"})}),e("input",{type:"number",step:"0.01",id:"hourly_wage",className:"form-control",value:s.hourly_wage,onChange:r})]}),e("label",{className:"form-label",htmlFor:"hourly_wage",children:"Hourly Wage"})]})]})}),e("button",{type:"button",className:"btn btn-success btn-lg mb-1",onClick:()=>{N()},children:t==="employees"?"Update":"Add"})]})})})})})]})]})};export{k as default};
