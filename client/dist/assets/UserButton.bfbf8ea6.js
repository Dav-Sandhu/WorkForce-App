import{u as n,a as r,b as o,j as s}from"./index.fb6a51fc.js";const a=()=>{const e=n(),t=r();return o("button",{className:"user-button btn btn-outline-secondary rounded-pill",onClick:()=>t("/"),children:[s("div",{className:"left-section",children:s("img",{src:e.userInfo.picture.length>0?e.userInfo.picture:"/default profile picture.jpg",roundedCircle:!0})}),e.userInfo.first_name+" "+e.userInfo.last_name]})};export{a as U};
