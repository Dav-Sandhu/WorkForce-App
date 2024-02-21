/*
method is for front-end components to verify that the user is registered before proceeding
with potentially sensitive information.
*/
const TokenLogin = async (token, makeRequest, navigate, user) => {

    try{
        /*
        backend method is used to authenticate the token and will return an object with
        a status property that is set to either 1 for success or -1 for failure.
        */
        const res = await makeRequest(null, '/userinfo', token, 'get')
        const token_decoded = res.output

        //if the user is verified it will set the user context to the given information
        if (res.status === 1){
            user.setUserInfo({
                employee_number: token_decoded[0].employee_number,
                first_name: token_decoded[0].first_name,
                last_name: token_decoded[0].last_name,
                email: token_decoded[0].email,
                password: token_decoded[0].password,
                hourly_wage: token_decoded[0].hourly_wage,
                picture: token_decoded[0].picture,
                is_admin: token_decoded[0].is_admin,
                is_supervisor: token_decoded[0].is_supervisor,
                clock_in: token_decoded[0].clock_in,
                clock_out: token_decoded[0].clock_out
            })
    
            //calls the given callback function to navigate to a given page
            navigate()

            return { status: 1, clock_in: token_decoded[0].clock_in, is_admin: token_decoded[0].is_admin, is_supervisor: token_decoded[0].is_supervisor }
        }

    }catch(e){
        //if there is an issue with authentication it will clear the token in storage and return a failure object
        sessionStorage.removeItem("token")
        return { error: e, status: -1 }
    }

    return { status: -1 }
}

export default TokenLogin