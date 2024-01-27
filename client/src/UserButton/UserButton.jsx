import "./UserButton.scss"

import { useUserInfo } from "../UserProvider"
import { useNavigate } from "react-router-dom"

const UserButton = () => {

    const user = useUserInfo()
    const navigate = useNavigate()

    const picture = user.userInfo.picture.length > 0 ? user.userInfo.picture : "/default profile picture.jpg"

    return(
        <button
            className="user-button btn btn-outline-secondary rounded-pill" 
            onClick={() => navigate('/')}>
                <div className="left-section mr-2">
                    <img src={ picture } roundedCircle loading="lazy" />
                </div>
                <div className="right-section text-center ml-2">
                    {user.userInfo.first_name + ' ' + user.userInfo.last_name}
                </div>
        </button>
    )
}

export default UserButton