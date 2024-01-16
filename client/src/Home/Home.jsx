import "./Home.scss"

import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../UserProvider"

const Home = () => {

    const user = useUserInfo()
    const navigate = useNavigate()

    return(
        <div className="home">
            <img className="profile-picture" src={user.userInfo.picture} alt="Profile Picture" /> <br />
            <p>Name: {user.userInfo.first_name + ' ' + user.userInfo.last_name}</p>
            <p>Employee #: {user.userInfo.employee_number}</p>
            <p>Email: {user.userInfo.email}</p>
            <p>Wage: {'$' + user.userInfo.hourly_wage + '/hour'}</p>
            
            <button onClick={() => {navigate('/tasks')}}>Tasks</button>
        </div>
    )
}
export default Home