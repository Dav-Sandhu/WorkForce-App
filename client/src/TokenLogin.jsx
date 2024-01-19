const TokenLogin = async (token, makeRequest, navigate, user) => {

    try{
        const res = await makeRequest(null, '/userinfo', { token })
        const token_decoded = res.output

        if (res.status === 1){
            user.setUserInfo({
                employee_number: token_decoded[0].employee_number,
                first_name: token_decoded[0].first_name,
                last_name: token_decoded[0].last_name,
                email: token_decoded[0].email,
                password: token_decoded[0].password,
                hourly_wage: token_decoded[0].hourly_wage,
                picture: token_decoded[0].picture
            })
    
            navigate()

            return { status: 1 }
        }

    }catch(e){
        sessionStorage.removeItem("token")
        return { error: e, status: -1 }
    }

    return { status: -1 }
}

export default TokenLogin