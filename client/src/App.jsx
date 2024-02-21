import './App.scss'

import UserProvider from './UserProvider'
import AuthUser from './AuthUser'

import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

//lazy loads the components so that they are only loaded when needed
const Home = lazy(() => import('./Home/Home'))
const Login = lazy(() => import('./Login/Login'))
const Register = lazy(() => import('./Login/Register'))
const Jobs = lazy(() => import('./Jobs/Jobs'))
const Task = lazy(() => import('./Tasks/Task'))
const Working = lazy(() => import('./Jobs/Working'))
const Spinner = lazy(() => import('./Spinner'))
const Admin = lazy(() => import('./Admin/Admin'))
const Assign = lazy(() => import('./Admin/Assign'))
const Employees = lazy(() => import('./Admin/Employees'))
const Customers = lazy(() => import('./Admin/UpdateCustomers'))
const Processes = lazy(() => import('./Admin/UpdateProcesses'))

export default function App(){

    //wraps the pages in an authentication component which verifies if the user is logged in and what type of user they are
    const AuthWrapper = (Component) => { return (<AuthUser><Component /></AuthUser>) }

    return(
        <Suspense fallback={<Spinner />}>
        {/*will show a spinner while the pages load*/}
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={AuthWrapper(Home)}/>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/jobs" element={AuthWrapper(Jobs)}/>
                        <Route path="/tasks" element={AuthWrapper(Task)}/>
                        <Route path='/working' element={AuthWrapper(Working)} />
                        <Route path='/admin' element={AuthWrapper(Admin)} />
                        <Route path='/employees' element={AuthWrapper(Employees)} />
                        <Route path='/customers' element={AuthWrapper(Customers)} />
                        <Route path='/processes' element={AuthWrapper(Processes)} />
                        <Route path='/assign' element={AuthWrapper(Assign)} />
                        <Route path="*" element={<Login />}/>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </Suspense>
    )
}