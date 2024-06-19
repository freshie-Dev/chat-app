import React from 'react'
import { useUser } from '../../context/UserContext'

const LogoutButton = () => {
    const {setUser} = useUser()

    const handleClick = ()=> {
        localStorage.clear()
        setUser(null)
    }
    
  return (
    <div onClick={handleClick}>Logout</div>
  )
}

export default LogoutButton