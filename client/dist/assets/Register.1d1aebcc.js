import{r as c,u as w,a as N,j as e,F as v,b as s,_ as n}from"./index.cc858317.js";const b=(a,{type:o,payload:l})=>{switch(o){case"employee_number":return{...a,employee_number:l};case"password":return{...a,password:l};case"repeat_password":return{...a,repeat_password:l};case"first_name":return{...a,first_name:l};case"last_name":return{...a,last_name:l};case"email":return{...a,email:l};case"hourly_wage":return{...a,hourly_wage:parseFloat(l)};case"picture":return{...a,picture:l};default:return a}},k=()=>{const[a,o]=c.exports.useReducer(b,{employee_number:"",first_name:"",password:"",repeat_password:"",last_name:"",email:"",hourly_wage:0,picture:""}),[l,_]=c.exports.useState(!1),t=r=>{o({type:r.target.id,payload:r.target.value})},d=w(),f=N();return c.exports.useEffect(()=>{const r=sessionStorage.getItem("token");r!==null&&((async()=>{const p=await n(()=>import("./useDB.6537f46e.js"),[]);(await(await n(()=>import("./TokenLogin.941dfcc1.js"),[])).default(r,p.makeRequest,()=>f("/"),d)).status===-1&&(sessionStorage.removeItem("token"),window.location.reload())})(),_(!0))},[]),e(v,{children:l?e("div",{class:"spinner-border",role:"status",children:e("span",{class:"visually-hidden",children:"Loading..."})}):e("section",{className:"vh-100",style:{backgroundColor:"#eee"},children:e("div",{className:"container h-100",children:e("div",{className:"row d-flex justify-content-center align-items-center h-100",children:e("div",{className:"col-lg-12 col-xl-11",children:e("div",{className:"card text-black",style:{borderRadius:"25px"},children:e("div",{className:"card-body p-md-5",children:s("div",{className:"row justify-content-center",children:[s("div",{className:"col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1",children:[e("p",{className:"text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4",children:"Sign up"}),s("form",{className:"mx-1 mx-md-4",onSubmit:r=>{r.preventDefault();const u=async()=>{const i=(await n(()=>import("./useDB.6537f46e.js"),[])).makeRequest,m=await i({email:a.email},"/checkemployee",null);if(m.status===1&&m.found){const h=await i(a,"/registeremployee",null);if(h.status===1){const g=h.token;sessionStorage.setItem("token",g),(await n(()=>import("./TokenLogin.941dfcc1.js"),[])).default(g,i,()=>f("/"),d)}else alert("Failed to register employee")}else alert("Email already registered!")};a.password===a.repeat_password&&a.password.length>0&&u()},children:[s("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-user fa-lg me-3 fa-fw"}),s("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"text",id:"first_name",className:"form-control",value:a.first_name,onChange:t}),e("label",{className:"form-label",htmlFor:"first_name",children:"First Name"})]})]}),s("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-user fa-lg me-3 fa-fw"}),s("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"text",id:"last_name",className:"form-control",value:a.last_name,onChange:t}),e("label",{className:"form-label",htmlFor:"last_name",children:"Last Name"})]})]}),s("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-envelope fa-lg me-3 fa-fw"}),s("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"email",id:"email",className:"form-control",value:a.email,onChange:t}),e("label",{className:"form-label",htmlFor:"email",children:"Your Email"})]})]}),s("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-envelope fa-lg me-3 fa-fw"}),s("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"password",id:"password",className:"form-control",value:a.password,onChange:t}),e("label",{className:"form-label",htmlFor:"password",children:"Password"})]})]}),s("div",{className:"d-flex flex-row align-items-center mb-4",children:[e("i",{className:"fas fa-key fa-lg me-3 fa-fw"}),s("div",{className:"form-outline flex-fill mb-0",children:[e("input",{type:"password",id:"repeat_password",className:"form-control",value:a.repeat_password,onChange:t}),e("label",{className:"form-label",htmlFor:"repeat_password",children:"Repeat your password"})]})]}),s("div",{className:"form-check d-flex justify-content-center mb-5",children:[e("input",{className:"form-check-input me-2",type:"checkbox",value:"",id:"terms"}),s("label",{className:"form-check-label",htmlFor:"terms",children:["I agree all statements in ",e("a",{href:"#!",children:"Terms of service"})]})]}),e("div",{className:"d-flex justify-content-center mx-4 mb-3 mb-lg-4",children:e("input",{type:"submit",className:"btn btn-primary btn-lg",value:"Register"})})]})]}),e("div",{className:"col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2",children:e("img",{src:"/register image.jpg",className:"img-fluid",alt:"Sample image"})})]})})})})})})})})};export{k as default};
