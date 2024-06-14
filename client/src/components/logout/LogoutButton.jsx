import React from 'react'
import { useUser } from '../../context/UserContext'

const LogoutButton = () => {
    const {setUser} = useUser()

    const handleClick = ()=> {
      console.log("i am running")
        localStorage.clear()
        setUser(null)
    }
    
  return (
    <div onClick={handleClick}>Logout</div>
  )
}

export default LogoutButton