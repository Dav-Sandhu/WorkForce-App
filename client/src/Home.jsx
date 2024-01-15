import { useNavigate } from "react-router-dom"
import { useUserInfo } from "./UserProvider"
import { useEffect } from "react"

const Home = () => {

    const user = useUserInfo()
    const navigate = useNavigate()

    useEffect(() => {
        if (user.userInfo.employee_number.length === 0 || user.userInfo.password.length === 0){navigate("/login")}
    }, [])

    return(
        <div className="home">
            Name: {user.userInfo.first_name + ' ' + user.userInfo.last_name} <br />
            Employee #: {user.userInfo.employee_number} <br />
            Email: {user.userInfo.email} <br />
            Wage: {'$' + user.userInfo.hourly_wage + '/hour'}
        </div>
    )
}
export default Home