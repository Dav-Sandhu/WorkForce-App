import "./UserButton.scss"

import { useUserInfo } from "../UserProvider"
import { useNavigate } from "react-router-dom"

const UserButton = () => {

    const user = useUserInfo()
    const navigate = useNavigate()

    return(
        <button
            className="user-button btn btn-outline-secondary rounded-pill" 
            onClick={() => navigate('/')}>
                <div className="left-section">
                    <img src={ user.userInfo.picture.length > 0 ? user.userInfo.picture : "/default profile picture.jpg" } roundedCircle />
                </div>
            {user.userInfo.first_name + ' ' + user.userInfo.last_name}
        </button>
    )
}

export default UserButton