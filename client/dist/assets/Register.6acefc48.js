import{r as f,u,a as p,j as e,b as l,_ as h}from"./index.5f6fac06.js";const w=(a,{type:m,payload:s})=>{switch(m){case"employee_number":return{...a,employee_number:s};case"password":return{...a,password:s};case"repeat_password":return{...a,repeat_password:s};case"first_name":return{...a,first_name:s};case"last_name":return{...a,last_name:s};case"email":return{...a,email:s};case"hourly_wage":return{...a,hourly_wage:parseFloat(s)};case"picture":return{...a,picture:s};default:return a}},_=()=>{const[a,m]=f.exports.useReducer(w,{employee_number:"",first_name:"",password:"",repeat_password:"",last_name:"",email:"",hourly_wage:0,picture:""}),s=t=>{m({type:t.target.id,payload:t.target.value})},n=u(),o=p();return e("section",{className:"vh-100",style:{backgroundColor:"#eee"},children:e("div",{className:"container h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-lg-12 col-xl-11",children:e("div",{className:"card text-black",style:{borderRadius:"25px"},children:e("div",{className:"card-body p-md-5",children:l("div",{className:"row justify-content-center",children:[l("div",{className:"col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1",children:[e("p",{className:"text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4",children:"Sign up"}),l("form",{className:"mx-1 mx-md-4",onSubmit:t=>{t.preventDefault();const d=async()=>{const c=(await h(()=>import("./useDB.50c6ad0b.js"),[])).makeRequest;if(await c({email:a.email},"/checkemployee",null)){const i=await c(a,"/registeremployee",null);sessionStorage.setItem("token",i.token);const r=await c(null,"/userinfo",i);n.setUserInfo({employee_number:r[0].employee_number,first_name:r[0].first_name,last_name:r[0].last_name,email:r[0].email,password:r[0].password,hourly_wage:r[0].hourly_wage,picture:r[0].picture}),o("/")}else alert("Email already registered!")};a.password===a.repeat_password&&a.password.length>0&&d()},children:[l("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-user fa-lg me-3 fa-fw"}),l("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"text",id:"first_name",className:"form-control",value:a.first_name,onChange:s}),e("label",{className:"form-label",htmlFor:"first_name",children:"First Name"})]})]}),l("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-user fa-lg me-3 fa-fw"}),l("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"text",id:"last_name",className:"form-control",value:a.last_name,onChange:s}),e("label",{className:"form-label",htmlFor:"last_name",children:"Last Name"})]})]}),l("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-envelope fa-lg me-3 fa-fw"}),l("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"email",id:"email",className:"form-control",value:a.email,onChange:s}),e("label",{className:"form-label",htmlFor:"email",children:"Your Email"})]})]}),l("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-envelope fa-lg me-3 fa-fw"}),l("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"password",id:"password",className:"form-control",value:a.password,onChange:s}),e("label",{className:"form-label",htmlFor:"password",children:"Password"})]})]}),l("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-key fa-lg me-3 fa-fw"}),l("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"password",id:"repeat_password",className:"form-control",value:a.repeat_password,onChange:s}),e("label",{className:"form-label",htmlFor:"repeat_password",children:"Repeat your password"})]})]}),l("div",{className:"form-check d-flex justify-content-center mb-5",children:[e("input",{className:"form-check-input me-2",type:"checkbox",value:"",id:"terms"}),l("label",{className:"form-check-label",htmlFor:"terms",children:["I agree all statements in ",e("a",{href:"#!",children:"Terms of service"})]})]}),e("div",{className:"d-flex justify-content-center mx-4 mb-3 mb-lg-4",children:e("input",{type:"submit",className:"btn btn-primary btn-lg",value:"Register"})})]})]}),e("div",{className:"col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2",children:e("img",{src:"https://www.championproducts.com/info/wp-content/uploads/We-Provide-Best-Quality-Products.jpg",className:"img-fluid",alt:"Sample image"})})]})})})})})})})};export{_ as default};
