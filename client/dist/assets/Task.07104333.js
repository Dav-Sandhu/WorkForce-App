import{a as b,u as c,b as r,j as t,_ as l}from"./index.b46182e2.js";import i from"./UserButton.33410c9d.js";const k=()=>{const n=b(),o=c(),a=async s=>{const e=(await l(()=>import("./useDB.4a39d696.js"),[])).makeRequest;await e({employee_number:o.userInfo.employee_number,break_type:s},"/startbreak",null),n("/working")};return r("div",{className:"tasks-page",children:[t(i,{})," ",t("br",{}),t("h1",{className:"tasks-title fw-bold fs-25 mb-4 text-center text-dark title",children:"What do you want to do?"})," ",t("br",{}),r("div",{className:"tasks",children:[t("button",{type:"button",className:"btn btn-lg btn-primary",onClick:()=>n("/jobs"),children:"Join a Job"}),t("button",{type:"button",className:"btn btn-lg btn-warning",children:"Ask for a Job"}),t("button",{type:"button",className:"btn btn-lg btn-success",onClick:()=>{a("break")},children:"Take a Break"}),t("button",{type:"button",className:"btn btn-lg btn-danger",onClick:()=>{a("lunch")},children:"Go To Lunch"}),t("button",{type:"button",className:"btn btn-lg btn-info",onClick:()=>{(async()=>{const e=(await l(()=>import("./useDB.4a39d696.js"),[])).makeRequest;await e({employee_number:o.userInfo.employee_number},"/clockout",null)})(),sessionStorage.removeItem("token"),window.location.reload()},children:"Finish Shift"})]})]})};export{k as default};
