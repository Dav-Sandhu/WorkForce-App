import { useEffect, useState } from "react"
import { useUserInfo } from "./UserProvider"
import { useNavigate } from "react-router-dom"

const AuthUser = ({children}) => {
    const user = useUserInfo()
    const navigate = useNavigate()

    const [loggedIn, setLoggedIn] = useState(false) 

    useEffect(() => {
        const request = async () => {

            const token = sessionStorage.getItem('token')

            let check = false

            if (token !== null){
                const module = await import('./useDB')
                const tokenLogin = await import('./TokenLogin')

                check = await tokenLogin.default(token, module.makeRequest, () => {}, user)
            }

            !check ? navigate("/login") : !loggedIn ? setLoggedIn(true) : ""
        }

        request()

    }, [])

    return(
        <>
            {loggedIn ? 
                children : 
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            }
        </>
    )

}

export default AuthUser