import { useEffect } from "react"
import { useUserInfo } from "./UserProvider"

import { useNavigate } from "react-router-dom"

const AuthUser = ({children}) => {
    const user = useUserInfo()
    const navigate = useNavigate()

    const loggedIn = user.userInfo.employee_number.length !== 0 || user.userInfo.password.length !== 0

    useEffect(() => {
        !loggedIn ? navigate("/login") : ""
    }, [])

    return(
        <>
            {loggedIn ? children : ""}
        </>
    )

}

export default AuthUser