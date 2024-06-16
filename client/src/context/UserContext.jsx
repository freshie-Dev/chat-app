import axios from 'axios'
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  //   const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
  const [avatars, setAvatars] = useState([]);
  const [contacts, setContacts] = useState(null)

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, formData);
      console.log(response.data.user.type)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user)

    } catch (error) {
      console.log(error)
    }
  }

  const registerUser = async (formData) => {
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
    try {
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
    } catch (error) {
      setUser(null)
      localStorage.clear()
    }

  }

  const uploadAvatar = async (selectedAvatar) => {
    console.log(selectedAvatar)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/upload_avatar`,{image: selectedAvatar} ,{
        headers: {
          token: localStorage.getItem('token')
        }
      })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/fetch_contacts`, {
        headers: {
          token: localStorage.getItem('token'),
        }
      })
      const data = response.data;
      console.log(data)
      setContacts(data.contacts)
    } catch (error) {
      console.log(error)
    }
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
        user, setUser, loginUser, registerUser, fetchContacts, contacts, uploadAvatar, avatars, setAvatars
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