import React from 'react'
import { useUser } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedUserRoutes = () => {
  const { user } = useUser()
    if (user) {
      console.log("going to outlet")
      return  <Outlet />
    } else {
      console.log("going to login page")
      return <><Navigate to='/' /></>
    }


  }

  export default ProtectedUserRoutes