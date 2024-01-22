import{r as n,j as e,F as f,b as l,_ as d,u as b,a as g}from"./index.f2880c19.js";const N=({dispatch:a,reset_password:i})=>{const[r,c]=n.exports.useState("");return e(f,{children:i?l("div",{className:"card text-center reset-password",children:[e("button",{className:"close-button",onClick:()=>a({type:"reset_password",payload:""}),children:"X"}),e("div",{className:"card-header h5 text-white bg-primary",children:"Password Reset"}),l("div",{className:"card-body px-5",children:[e("p",{className:"card-text py-2",children:"Enter your email address and we'll send you an email with instructions to reset your password."}),l("div",{className:"form-outline",children:[e("input",{type:"email",id:"typeEmail",className:"form-control my-3",value:r,onChange:m=>c(m.target.value)}),e("label",{className:"form-label",htmlFor:"typeEmail",children:"Email input"})]}),e("a",{className:"btn btn-primary w-100",onClick:()=>{(async()=>{const s=(await d(()=>import("./useDB.4a39d696.js"),[])).makeRequest;alert("Your password will be sent to your email if it is registered."),a({type:"reset_password",payload:""}),await s({sendInfo:"Reset",subject:"Password Reset",email:r,name:"Password Reset"},"/sendemail",null)})()},children:"Reset password"}),l("div",{className:"d-flex justify-content-between mt-4",children:[e("a",{className:"",href:"/login",children:"Login"}),e("a",{className:"",href:"/register",children:"Register"})]})]})]}):""})},k=(a,{type:i,payload:r})=>{switch(i){case"employee_number":return{...a,employee_number:r};case"password":return{...a,password:r};case"image":return{...a,image:r};case"alert":return{...a,alert:!a.alert};case"valid":return{...a,valid:Boolean(r)};case"empty_employee_number":return{...a,empty_employee_number:Boolean(r)};case"empty_password":return{...a,empty_password:Boolean(r)};case"checked":return{...a,checked:Boolean(r)};case"reset_password":return{...a,reset_password:!a.reset_password};default:return a}},R=n.exports.lazy(()=>d(()=>import("./FaceScanner.401ef860.js"),["assets/FaceScanner.401ef860.js","assets/index.f2880c19.js","assets/index.aed92d30.css","assets/FaceScanner.729f141a.css"])),L=()=>{const a=n.exports.useRef(null),i=n.exports.useRef(null),r=b(),c=g(),[m,_]=n.exports.useState(!1);n.exports.useEffect(()=>{const t=sessionStorage.getItem("token");t!==null&&((async()=>{const y=await d(()=>import("./useDB.4a39d696.js"),[]);(await(await d(()=>import("./TokenLogin.fa3ff8bd.js"),[])).default(t,y.makeRequest,()=>c("/"),r)).status===-1&&(sessionStorage.removeItem("token"),window.location.reload())})(),_(!0))},[]);const[s,o]=n.exports.useReducer(k,{employee_number:"",password:localStorage.getItem("password")||"",image:null,alert:!1,valid:!0,empty_employee_number:!0,empty_password:!0,reset_password:!1}),h=t=>{o({type:t.target.id,payload:t.target.value})};return n.exports.useEffect(()=>{i.current.className.includes("is-invalid")||a.current.className.includes("is-invalid")?o({type:"valid",payload:!1}):o({type:"valid",payload:!0})},[s.employee_number,s.password]),e(f,{children:m?e("div",{class:"spinner-border",role:"status",children:e("span",{class:"visually-hidden",children:"Loading..."})}):l("div",{className:"login container",children:[e("h1",{className:"fw-bold fs-25 mb-1 text-center text-info title",children:"WorkForce Login"}),s.alert?l("div",{className:"alert alert-danger alert-dismissible",role:"alert",children:["Warning: Missing Fields",e("button",{className:"btn-close","aria-label":"close",onClick:()=>{o({type:"alert"})}})]}):"",l("form",{className:s.valid?"":"was-validated",noValidate:!0,onSubmit:t=>{t.preventDefault(),(async()=>{const u=(await d(()=>import("./useDB.4a39d696.js"),[])).makeRequest,p=await u({type:"find-employee",values:[s.employee_number,s.password]},"/authenticate",null);if(p.status===1){const w=p.token;sessionStorage.setItem("token",w),s.checked&&localStorage.setItem("password",s.password),(await d(()=>import("./TokenLogin.fa3ff8bd.js"),[])).default(w,u,()=>c("/"),r)}else s.valid?alert("Login attempt failed, please make sure your information is correct!"):o({type:"alert"})})()},children:[e("div",{className:"input-group mb-4",children:l("div",{className:"form-floating",children:[e("input",{id:"employee_number",className:s.empty_employee_number?"form-control":s.employee_number.length>0?"form-control is-valid":"form-control is-invalid",type:"text",ref:i,placeholder:"Employee Number",value:s.employee_number,onChange:t=>{h(t),o({type:"empty_employee_number",payload:!1})},required:!0}),e("label",{htmlFor:"employee_number",children:"Employee Number: "}),e("div",{className:"invalid-feedback user-invalid",children:"Invalid input"})]})}),l("div",{className:"form-floating mb-4",children:[e("input",{id:"password",className:s.empty_password?"form-control":s.password.length>0?"form-control is-valid":"form-control is-invalid",type:"password",ref:a,placeholder:"Password",value:s.password,onChange:t=>{h(t),o({type:"empty_password",payload:!1})},required:!0}),e("label",{htmlFor:"password",children:"Password: "}),e("div",{className:"invalid-feedback",children:"Invalid input"})]}),e("div",{className:"mb-4",children:l("div",{className:"form-check",children:[e("input",{className:"form-check-input",type:"checkbox",value:"",id:"savePassword",onChange:t=>{o({type:"checked",payload:t.target.checked})}}),e("label",{className:"form-check-label",htmlFor:"savePassword",children:"Remember Password"})]})}),e("input",{className:"btn btn-outline-primary",type:"submit",value:"Login"})]}),e("a",{className:"mb-4 password-reset",onClick:()=>{o({type:"reset_password",payload:""})},children:"Forgot password?"}),l("p",{children:["Not a member? ",e("a",{href:"/register",children:"Register"})]}),e(R,{state:s,dispatch:o,navigate:c,user:r}),e(N,{dispatch:o,reset_password:s.reset_password})]})})};export{L as default};
