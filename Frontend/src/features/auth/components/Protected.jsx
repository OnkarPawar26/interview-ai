import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import LoadingState from '../../../components/LoadingState.jsx'

const Protected = ({children}) => {
    const { loading,user } = useAuth()

    if(loading){
        return <LoadingState label='Checking your session...' />
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected
