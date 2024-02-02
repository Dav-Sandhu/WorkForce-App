import{r as u,u as I,b as k,j as a,_ as s}from"./index.7f1f0c26.js";import{W as v}from"./react-webcam.8f17bc1b.js";const x=({setWebcamActive:d},n)=>{const t=I(),[r,_]=u.exports.useState(!1);return k("div",{className:"webcam-modal",children:[r&&a("button",{className:"btn btn-danger btn-rounded close-webcam-button",onClick:()=>d(!1),children:"x"}),a(v,{audio:!1,ref:n,height:"100%",width:"100%",screenshotFormat:"image/jpeg",screenshotSize:{width:500,height:500},onUserMedia:()=>_(!0)}),r&&a("button",{className:"take-picture btn btn-success btn-rounded btn-lg",onClick:()=>{const c=t.userInfo.employee_number,b=t.userInfo.first_name+"-"+t.userInfo.last_name+"-"+c+".jpg",g=n.current.getScreenshot(),o=new Image;o.src=g,o.onload=async()=>{const e=document.createElement("canvas"),p=e.getContext("2d");e.width=500,e.height=500,p.drawImage(o,0,0,500,500);const w=e.toDataURL(),h=(await s(()=>import("./useDB.4a39d696.js"),[])).makeRequest,i=await h({name:b,image:w,employee_number:c,token:sessionStorage.getItem("token")},"/upload-image",null);if(i.status===1){const l=i.token;sessionStorage.removeItem("token"),sessionStorage.setItem("token",l);const f=(await s(()=>import("./Alert.5136f4c4.js"),["assets/Alert.5136f4c4.js","assets/index.7f1f0c26.js","assets/index.c4470b89.css"])).customAlert;await f("Success!","Picture updated.","success")}else{const m=(await s(()=>import("./Alert.5136f4c4.js"),["assets/Alert.5136f4c4.js","assets/index.7f1f0c26.js","assets/index.c4470b89.css"])).customAlert;await m("Picture Failed To Upload!","Please try again later.","error")}window.location.reload()}},children:"Take Picture"})]})},E=u.exports.forwardRef(x);export{E as default};
