import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import App from './App'
import Login from './Login'
import Register from './Register'
import Jobs from './Jobs/Jobs'
import Task from './Tasks/Task'
import FaceRecognition from './FaceRecognition'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route 
                path="/"
                element={<App />}
            />

            <Route 
                path="/login"
                element={<Login />}
            />

            <Route 
                path="/register"
                element={<Register />}
            />

            <Route 
                path="/face-scan"
                element={<FaceRecognition />}
            />

            <Route 
                path="/jobs"
                element={<Jobs />}
            />

            <Route 
                path="/tasks"
                element={<Task/>}
            />

        </Routes>
    </BrowserRouter>
)
