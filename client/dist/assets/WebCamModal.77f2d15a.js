import{r as i,u as h,b as I,j as s,_ as r}from"./index.c817b9de.js";import{W as x}from"./react-webcam.d0556f11.js";const M=({setWebcamActive:d},n)=>{const e=h(),[c,m]=i.exports.useState(!1);return I("div",{className:"webcam-modal",children:[c&&s("button",{className:"btn btn-danger btn-rounded close-webcam-button",onClick:()=>d(!1),children:"x"}),s(x,{audio:!1,ref:n,height:"100%",width:"100%",screenshotFormat:"image/jpeg",screenshotSize:{width:500,height:500},onUserMedia:()=>m(!0)}),c&&s("button",{className:"take-picture btn btn-success btn-rounded btn-lg",onClick:()=>{const u=e.userInfo.employee_number,_=e.userInfo.first_name+"-"+e.userInfo.last_name+"-"+u+".jpg",b=n.current.getScreenshot(),a=new Image;a.src=b,a.onload=async()=>{const t=document.createElement("canvas"),p=t.getContext("2d");t.width=500,t.height=500,p.drawImage(a,0,0,500,500);const g=t.toDataURL(),w=(await r(()=>import("./useDB.4a39d696.js"),[])).makeRequest,l=await w({name:_,image:g,employee_number:u},"/upload-image",null);if(l.status===1){e.setUserInfo({...e.userInfo,picture:l.picture});const o=(await r(()=>import("./Alert.637a54ae.js"),["assets/Alert.637a54ae.js","assets/index.c817b9de.js","assets/index.c4470b89.css"])).customAlert;await o("Success!","Picture updated.","success")}else{const o=(await r(()=>import("./Alert.637a54ae.js"),["assets/Alert.637a54ae.js","assets/index.c817b9de.js","assets/index.c4470b89.css"])).customAlert;await o("Picture Failed To Upload!","Please try again later.","error")}window.location.reload()}},children:"Take Picture"})]})},E=i.exports.forwardRef(M);export{E as default};