import React from 'react'
import { useUser } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom'
import Button from '../styled-components/Button'

const ProtectedUserRoutes = () => {
  const { user, setUser } = useUser()
  let userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : user

    if (user) {
      return (
        <>
          <Button onClick={ () => {
            localStorage.clear()
            setUser(null)
          }} width="100px" primary>Logout</Button>
          <Outlet />
        </>
      )
    } else {
      return <><Navigate to='/' /></>
    }


  }

  export default ProtectedUserRoutes