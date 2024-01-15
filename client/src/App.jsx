import Login from './Login'
import Register from './Register'
import DailyReport from './DailyReport'
import Jobs from './Jobs/Jobs'
import Task from './Tasks/Task'
import Home from './Home'
import UserProvider from './UserProvider'

import { Routes, Route, BrowserRouter } from 'react-router-dom'

export default function App(){
    return(
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/report" element={<DailyReport/>}/>
                    <Route path="/jobs" element={<Jobs/>}/>
                    <Route path="/tasks" element={<Task/>}/>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    )
}