import{u as n,a,r as t,j as s,b as r}from"./index.248ad459.js";const u=()=>{const e=n(),o=a();return t.exports.useEffect(()=>{(e.userInfo.employee_number.length===0||e.userInfo.password.length===0)&&o("/login")},[]),s("div",{className:"home",children:[r("img",{className:"profile-picture",src:e.userInfo.picture,alt:"Profile Picture"})," ",r("br",{}),s("p",{children:["Name: ",e.userInfo.first_name+" "+e.userInfo.last_name]}),s("p",{children:["Employee #: ",e.userInfo.employee_number]}),s("p",{children:["Email: ",e.userInfo.email]}),s("p",{children:["Wage: ","$"+e.userInfo.hourly_wage+"/hour"]}),r("button",{onClick:()=>{o("/tasks")},children:"Tasks"})]})};export{u as default};
