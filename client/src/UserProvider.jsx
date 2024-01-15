import {
    createContext,
    useContext,
    useState,
} from "react"

const UserContext = createContext()

export const useUserInfo = () => {
    return useContext(UserContext)
}

const UserProvider = ({children}) => {

    const [userInfo, setUserInfo] = useState({
        first_name: "",
        last_name: "",
        email: "",
        employee_number: "",
        password: "",
        hourly_wage: 0.0
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