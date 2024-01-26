import './App.scss'

import UserProvider from './UserProvider'
import AuthUser from './AuthUser'

import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./Home/Home'))
const Login = lazy(() => import('./Login/Login'))
const Register = lazy(() => import('./Login/Register'))
const Jobs = lazy(() => import('./Jobs/Jobs'))
const Task = lazy(() => import('./Tasks/Task'))
const Working = lazy(() => import('./Jobs/Working'))

export default function App(){

    const AuthWrapper = (Component) => { return (<AuthUser><Component /></AuthUser>) }

    return(
        <Suspense fallback={
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        }>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={AuthWrapper(Home)}/>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/jobs" element={AuthWrapper(Jobs)}/>
                        <Route path="/tasks" element={AuthWrapper(Task)}/>
                        <Route path='/working' element={AuthWrapper(Working)} />
                        <Route path="*" element={<Login />}/>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </Suspense>
    )
}