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

                    const pathName = window.location.pathname
                    const is_admin = res.is_admin
                    const clock_in = res.clock_in

                    /* 
                    if the user is an admin it will redirect them to the admin page
                    otherwise it makes sure the user is clocked in before allowing them to 
                    access other pages besides the home page
                    */
                    is_admin ? 
                    (pathName !== '/admin' && pathName !== '/update' ? navigate('/admin') : "") :  
                    (clock_in === null && pathName !== '/' ? navigate('/') : 
                    (pathName === '/admin' || pathName === '/update' ? navigate('/') : ""))

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