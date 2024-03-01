import{r as n,j as e,F as g,a as o,_ as i,u as N,b as k}from"./index.0471dc01.js";const R=({dispatch:s,reset_password:c})=>{const[r,d]=n.exports.useState("");return e(g,{children:c?o("div",{className:"card text-center reset-password",children:[e("button",{type:"button",className:"close-button btn-close",onClick:()=>s({type:"reset_password",payload:""})}),e("div",{className:"card-header h5 text-white bg-primary",children:"Lost Password"}),o("div",{className:"card-body px-5",children:[e("p",{className:"card-text py-2",children:"Enter your email address and we'll send you your password."}),o("div",{className:"form-outline",children:[e("input",{type:"email",id:"typeEmail",className:"form-control my-3",value:r,onChange:m=>d(m.target.value)}),e("label",{className:"form-label",htmlFor:"typeEmail",children:"Email input"})]}),e("a",{className:"btn btn-primary w-100",onClick:()=>{(async()=>{const u=(await i(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest;i(()=>import("./Alert.bf7159b3.js"),["assets/Alert.bf7159b3.js","assets/index.0471dc01.js","assets/index.c4470b89.css"]).then(async h=>{await h.customAlert("Notice","Your password will be sent to your email if it is in our system.","info")}),s({type:"reset_password",payload:""}),await u({sendInfo:"Reset",subject:"Password Reset",email:r,name:"Password Reset"},"/sendemail",null,"")})()},children:"Reset password"}),o("div",{className:"d-flex justify-content-between mt-4",children:[e("a",{className:"",href:"/login",children:"Login"}),e("a",{className:"",href:"/register",children:"Register"})]})]})]}):""})},E=(s,{type:c,payload:r})=>{switch(c){case"employee_number":return{...s,employee_number:r};case"email":return{...s,email:r};case"adp_number":return{...s,adp_number:r};case"password":return{...s,password:r};case"image":return{...s,image:r};case"alert":return{...s,alert:!s.alert};case"valid":return{...s,valid:Boolean(r)};case"empty_email":return{...s,empty_email:Boolean(r)};case"empty_password":return{...s,empty_password:Boolean(r)};case"checked":return{...s,checked:Boolean(r)};case"reset_password":return{...s,reset_password:!s.reset_password};default:return s}},x=n.exports.lazy(()=>i(()=>import("./FaceScanner.a294b712.js"),["assets/FaceScanner.a294b712.js","assets/index.0471dc01.js","assets/index.c4470b89.css","assets/FaceScanner.04d20e16.css"])),I=()=>{const s=n.exports.useRef(null),c=n.exports.useRef(null),r=N(),d=k(),[m,f]=n.exports.useState(!1),[u,h]=n.exports.useState(!0);n.exports.useEffect(()=>{const t=sessionStorage.getItem("token");t!==null&&((async()=>{const y=await i(()=>import("./useDB.d7bc65b2.js"),[]);(await(await i(()=>import("./TokenLogin.5150e2e9.js"),[])).default(t,y.makeRequest,()=>d("/"),r)).status===-1&&(sessionStorage.removeItem("token"),window.location.reload())})(),f(!0))},[]);const[a,l]=n.exports.useReducer(E,{employee_number:"",adp_number:"",email:"",password:localStorage.getItem("password")||"",image:null,alert:!1,valid:!0,empty_email:!0,empty_password:!0,reset_password:!1}),v=t=>{l({type:t.target.id,payload:t.target.value})};return n.exports.useEffect(()=>{u||(c.current.className.includes("is-invalid")||s.current.className.includes("is-invalid")?l({type:"valid",payload:!1}):l({type:"valid",payload:!0}))},[a.employee_number,a.password]),e(g,{children:m?e("div",{class:"spinner-border",role:"status",children:e("span",{class:"visually-hidden",children:"Loading..."})}):u?o("div",{className:"face-recognition-section",children:[e(x,{state:a,dispatch:l,navigate:d,user:r}),e("div",{className:"d-grid gap-2",children:e("button",{className:"btn btn-primary",type:"button",onClick:t=>{h(!1)},children:"Email Login"})})]}):o("div",{className:"login container",children:[e("h1",{className:"fw-bold fs-25 mb-1 text-center text-info title",children:"WorkForce Login"}),a.alert?o("div",{className:"alert alert-danger alert-dismissible",role:"alert",children:["Warning: Missing Fields",e("button",{className:"btn-close","aria-label":"close",onClick:()=>{l({type:"alert"})}})]}):"",o("form",{className:a.valid?"":"was-validated",noValidate:!0,onSubmit:t=>{t.preventDefault(),(async()=>{const w=(await i(()=>import("./useDB.d7bc65b2.js"),[])).makeRequest,p=await w({email:a.email,password:a.password},"/login",null,"");if(console.log(a.email,a.password),console.log(p),p.status===1){const _=p.token;sessionStorage.setItem("token",_),a.checked&&localStorage.setItem("password",a.password),await(await i(()=>import("./TokenLogin.5150e2e9.js"),[])).default(_,w,()=>d("/"),r)}else a.valid?i(()=>import("./Alert.bf7159b3.js"),["assets/Alert.bf7159b3.js","assets/index.0471dc01.js","assets/index.c4470b89.css"]).then(async _=>{await _.customAlert("Login attempt failed!","Please make sure your information is correct.","error")}):l({type:"alert"})})()},children:[e("div",{className:"input-group mb-4",children:o("div",{className:"form-floating",children:[e("input",{id:"email",className:a.empty_email?"form-control":a.email.length>0?"form-control is-valid":"form-control is-invalid",type:"text",ref:c,placeholder:"Email",value:a.email,onChange:t=>{v(t),l({type:"empty_email",payload:!1})},required:!0}),e("label",{htmlFor:"employee_number",children:"Email: "}),e("div",{className:"invalid-feedback user-invalid",children:"Invalid input"})]})}),o("div",{className:"form-floating mb-4",children:[e("input",{id:"password",className:a.empty_password?"form-control":a.password.length>0?"form-control is-valid":"form-control is-invalid",type:"password",ref:s,placeholder:"Password",value:a.password,onChange:t=>{v(t),l({type:"empty_password",payload:!1})},required:!0}),e("label",{htmlFor:"password",children:"Password: "}),e("div",{className:"invalid-feedback",children:"Invalid input"})]}),e("div",{className:"mb-4",children:o("div",{className:"form-check",children:[e("input",{className:"form-check-input",type:"checkbox",value:"",id:"savePassword",onChange:t=>{l({type:"checked",payload:t.target.checked})}}),e("label",{className:"form-check-label",htmlFor:"savePassword",children:"Remember Password"})]})}),e("input",{className:"btn btn-outline-primary",type:"submit",value:"Login"})]}),e("a",{className:"mb-4 password-reset",onClick:()=>{l({type:"reset_password",payload:""})},children:"Forgot password?"}),o("p",{children:["Not a member? ",e("a",{href:"/register",children:"Register"})]}),e(R,{dispatch:l,reset_password:a.reset_password})]})})};export{I as default};
