import React from 'react'
import { useUser } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedAdminRoutes = () => {
    const {user} = useUser()

    const userInfo = user;
    if (userInfo) {
        if (userInfo.type === "admin") {
          return (
            <>
              <Outlet />
            </>
          )
        } else if (userInfo.type === "user") {
          return <Navigate to='/unauthorized' replace />;
        }
      } else {
        return <><Navigate to='/' /></>
      }
   
  
}

export default ProtectedAdminRoutes