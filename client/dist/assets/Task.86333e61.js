import{b as e,j as t,L as a}from"./index.a3c7ef4c.js";import{U as s}from"./UserButton.0d093122.js";const n=[{name:"Join a Job",route:"/jobs",color:"btn-primary"},{name:"Ask for a Jobs",route:"/request-new-job",color:"btn-warning"},{name:"Take a Break",route:"/break",color:"btn-success"},{name:"Go to Lunch",route:"/lunch",color:"btn-danger"},{name:"Finish Shift",route:"/finish-shift",color:"btn-info"}],i=()=>e("div",{className:"tasks-page",children:[t(s,{})," ",t("br",{}),t("h1",{className:"tasks-title fw-bold fs-25 mb-1 text-center text-dark title",children:"What do you want to do?"})," ",t("br",{}),t("div",{className:"tasks",children:n.map(o=>t(a,{to:o.route,children:t("button",{type:"button",className:"btn btn-lg "+o.color,children:o.name})},o.name))})]});export{i as default};
