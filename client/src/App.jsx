import UserProvider from './UserProvider'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./Home/Home'))
const Login = lazy(() => import('./Login/Login'))
const Register = lazy(() => import('./Register'))
const DailyReport = lazy(() => import('./DailyReport'))
const Jobs = lazy(() => import('./Jobs/Jobs'))
const Task = lazy(() => import('./Tasks/Task'))

export default function App(){
    return(
        <Suspense fallback={"Loading..."}>
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
        </Suspense>
    )
}