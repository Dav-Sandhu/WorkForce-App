import{r as t,_ as o,a as x,j as e,F as i,b as f}from"./index.598a30c5.js";const v=t.exports.lazy(()=>o(()=>import("./UserButton.f4a3c48a.js"),["assets/UserButton.f4a3c48a.js","assets/index.598a30c5.js","assets/index.c4470b89.css","assets/UserButton.d52919d1.css"])),y=t.exports.lazy(()=>o(()=>import("./Customers.1753690c.js"),["assets/Customers.1753690c.js","assets/index.598a30c5.js","assets/index.c4470b89.css"])),j=t.exports.lazy(()=>o(()=>import("./Spinner.b4096bf6.js"),["assets/Spinner.b4096bf6.js","assets/index.598a30c5.js","assets/index.c4470b89.css"])),k=()=>{const a=x(),[u,d]=t.exports.useState(!0),[r,_]=t.exports.useState([]),[n,p]=t.exports.useState(!0),[b,m]=t.exports.useState(""),h=s=>{d(!1),_(s)};return t.exports.useEffect(()=>{(async()=>{const c=sessionStorage.getItem("token");if(c!==null){const g=(await o(()=>import("./useDB.4a39d696.js"),[])).makeRequest,l=await g(null,"/getjobs",c);l.status===1?h(l.output):a("/")}else a("/login")})()},[]),e(i,{children:u?e(j,{}):e(i,{children:f("div",{className:"jobs-page",children:[e(v,{})," ",e("br",{}),e("h1",{className:"jobs-title fw-bold fs-25 mb-4 text-center text-dark title",children:n?"What job are you working on?":"What customer are you doing the job for?"}),e("div",{className:"jobs",children:n?r.length===0?e("h5",{className:"text-center text-muted",children:"There are no jobs available right now..."}):r.map(s=>e("button",{className:"btn btn-lg btn-secondary",onClick:()=>{m(s.process_type),p(!1)},children:s.process_type},s.process_type)):e(y,{selectedJob:b})})]})})})};export{k as default};
