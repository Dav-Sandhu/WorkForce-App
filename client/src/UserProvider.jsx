import {
    createContext,
    useContext,
    useState,
} from "react"

const UserContext = createContext()

export const useUserInfo = () => {
    return useContext(UserContext)
}

//wraps the context of the currently logged in user to all the child components
const UserProvider = ({children}) => {    

    //holds all the relevant information about the user
    const [userInfo, setUserInfo] = useState({
        first_name: "",
        last_name: "",
        email: "",
        employee_number: "",
        password: "",
        hourly_wage: 0.0,
        picture: "",
        is_admin: 0,
        is_supervisor: 0,
        break_time: 0,
        lunch_time: 0,
        clock_in: null,
        clock_out: null
    })

    return(
        <UserContext.Provider value={{
            userInfo: userInfo, 
            setUserInfo: setUserInfo
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider