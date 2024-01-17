const TokenLogin = async (token, makeRequest, navigate, user) => {

    try{
        const token_decoded = await makeRequest(null, '/userinfo', { token })

        user.setUserInfo({
            employee_number: token_decoded[0].employee_number,
            first_name: token_decoded[0].first_name,
            last_name: token_decoded[0].last_name,
            email: token_decoded[0].email,
            password: token_decoded[0].password,
            hourly_wage: token_decoded[0].hourly_wage,
            picture: token_decoded[0].picture
        })

        navigate('/')
    }catch(e){
        sessionStorage.removeItem("token")
        return e
    }
}

export default TokenLogin