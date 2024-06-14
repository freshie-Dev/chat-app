import axios from 'axios'
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  //   const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState( localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

  const loginUser = async (formData)=> {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, formData);
      console.log(response.data.user.type)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user)

    } catch (error) {
        console.log(error)
      setError('Invalid username or password');
    }
  }

  const registerUser = async (formData)=> {
    try {
      console.log(import.meta.env.VITE_BASE_URL)
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user)
      console.log(response.data)
    } catch (error) {
      console.log(error.response.status, error.response.data.message)
    }
  }
  
  const verifyToken = async () => {
    console.log("im running")
    setIsLoading(true)
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/verify_token`, {
      headers: {
        token
      }
    })
    console.log(response.status)
    if (response.status === 200) {
      setUser(JSON.parse(localStorage.getItem('user')))
    }

    setIsLoading(false)
  }


  useEffect(() => {
    verifyToken()
  }, [])
  useEffect(() => {
    console.log(user)
  }, [user])


  return (
    <UserContext.Provider
      value={{
        user, setUser, loginUser, registerUser
      }}
    >
      {/* {children } */}
      {isLoading ? <h1>Loading...</h1> : children}
    </UserContext.Provider>
  );
};
// CUSTOM HOOK FOR USING USER CONTEXT
const useUser = () => {
  return useContext(UserContext);
};

export default UserProvider;
export { useUser };