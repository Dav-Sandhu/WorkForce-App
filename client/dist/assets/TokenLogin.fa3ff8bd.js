const n=async(s,r,a,o)=>{try{const t=await r(null,"/userinfo",s),e=t.output;if(t.status===1)return o.setUserInfo({employee_number:e[0].employee_number,first_name:e[0].first_name,last_name:e[0].last_name,email:e[0].email,password:e[0].password,hourly_wage:e[0].hourly_wage,picture:e[0].picture}),a(),{status:1}}catch(t){return sessionStorage.removeItem("token"),{error:t,status:-1}}return{status:-1}};export{n as default};
