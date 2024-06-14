import React from 'react'
import { useUser } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom'
import LogoutButton from '../components/logout/LogoutButton'

const ProtectedUserRoutes = () => {
  const { user } = useUser()
  let userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : user
  console.log(userInfo)

  if (userInfo) {
    if (userInfo.type === "user") {
      return (
        <>
          <LogoutButton/>
          <Outlet />
        </>
      )
    } else if (userInfo.type === "admin") {
      return <Navigate to='/unauthorized' replace/>;
    }
  } else {
    return <><Navigate to='/' /></>
  }

  
}

export default ProtectedUserRoutes