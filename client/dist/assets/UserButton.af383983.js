import{u as o,b as a,a as u,j as t}from"./index.e4031f32.js";const c=()=>{const e=o(),s=a(),n=e.userInfo.picture.length>0?e.userInfo.picture:"/default profile picture.jpg";return u("button",{className:"user-button btn btn-outline-secondary rounded-pill",onClick:()=>s("/"),children:[t("div",{className:"left-section mr-2",children:t("img",{src:n,onError:r=>{r.target.onerror=null,r.target.src="/default profile picture.jpg"},roundedCircle:!0,loading:"lazy"})}),t("div",{className:"right-section text-center ml-2",children:e.userInfo.first_name+" "+e.userInfo.last_name})]})};export{c as default};