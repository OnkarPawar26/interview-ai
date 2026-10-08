import { createBrowserRouter } from "react-router"
import Register from './features/auth/pages/Register.jsx'
import Login from './features/auth/pages/Login.jsx'
import Protected from "./features/auth/components/Protected.jsx"
import Home from './features/interview/pages/Home.jsx'
import Interview from './features/interview/pages/Interview.jsx'

export const router = createBrowserRouter([
    {
        path: '/register',
        element: <Register />
    }, {
        path: '/login',
        element: <Login />
    },{
        path : '/',
        element : <Protected><Home /></Protected>
    },{
        path : '/interview/:interviewId',
        element : <Protected><Interview /></Protected>
    }
])
