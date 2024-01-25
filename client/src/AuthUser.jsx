import { useEffect, useState } from "react"
import { useUserInfo } from "./UserProvider"
import { useNavigate } from "react-router-dom"

const AuthUser = ({children}) => {
    const user = useUserInfo()
    const navigate = useNavigate()

    const [loggedIn, setLoggedIn] = useState(false) 

    useEffect(() => {

        /*
        if the user has a token from browsing the current webpage within the last hour
        it will skip the login process. This is only works for the current session, so
        if they exit the page they will lose the jwt.
        */
        const request = async () => {
            const token = sessionStorage.getItem('token')

            let check = false
            
            if (token !== null){
                const module = await import('./useDB')
                const tokenLogin = await import('./TokenLogin')
                const res = await tokenLogin.default(token, module.makeRequest, () => {}, user)

                check = (res.status === 1)

                if (check){
                    setLoggedIn(true)
                    res.clock_in === null && window.location.pathname !== '/' ? navigate('/') : ""
                }else{
                    sessionStorage.removeItem('token')
                }
            }

            if (!check){
                navigate('/login')
                loggedIn ? setLoggedIn(false) : ""
            }
        }

        request()

    }, [])

    return(
        <>
            {loggedIn ? 
                children : 
                <div class="spinner-border" role="status">
                    {/*spinner shows while the page loads*/}
                    <span class="visually-hidden">Loading...</span>
                </div>
            }
        </>
    )

}

export default AuthUser