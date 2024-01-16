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
        hourly_wage: 0.0,
        picture: ""
    })

    // const [sessionCheck, setSessionCheck] = useState(false)

    // const continueSession = async () => {
    //     const token = sessionStorage.getItem("token")
    
    //     if (token !== null){
    //         const module = await import('./useDB')
    //         const makeRequest = module.makeRequest
    
    //         const sessionInfo = await makeRequest(null, '/userInfo', { token })
    
    //         setSessionCheck(true)

    //         sessionInfo.length > 0 ? setUserInfo({
    //             employee_number: sessionInfo[0].employee_number,
    //             first_name: sessionInfo[0].first_name,
    //             last_name: sessionInfo[0].last_name,
    //             email: sessionInfo[0].email,
    //             password: sessionInfo[0].password,
    //             hourly_wage: sessionInfo[0].hourly_wage,
    //             picture: sessionInfo[0].picture
    //         }) : ""
    //     }
    // }

    // !sessionCheck ? continueSession() : ""

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