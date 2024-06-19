import axios from 'axios'
import { createContext, useContext, useEffect, useRef, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  //   const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
  const [avatars, setAvatars] = useState([]);
  const [contacts, setContacts] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const socketRef = useRef(null)

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, formData);
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user)

    } catch (error) {
      console.log(error)
    }
  }

  const registerUser = async (formData) => {
    try {
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user)
      
    } catch (error) {
      console.log(error.response.status, error.response.data.message)
    }
  }

  const verifyToken = async () => {
    console.log("setting loading TRUE from verify token")
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
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/upload_avatar`,{image: selectedAvatar} ,{
        headers: {
          token: localStorage.getItem('token')
        }
      })
      
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
      setContacts(data.contacts)
    } catch (error) {
      console.log(error)
    }
  }

  const saveMessageToDB = async ()=> {
    const data = {
      from: user._id,
      to: selectedChat._id,
      message: message
    }
    console.log(data)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/message/send_message`, data, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      return response.status
    } catch (error) {
      console.log(error)
      return response.status
    }
  }

  const fetchMessages = async ()=> {
    try {
      
        const from= user._id;
        const to = selectedChat._id;
      
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/message/fetch_all_messages`,{
        headers: {
          token: localStorage.getItem('token')
        }, params: {
          from,
          to
        }
      });
      console.log(response.data)
      setMessages(response.data.projectedMessages)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    verifyToken()
  }, [])
 


  return (
    <UserContext.Provider
      value={{
        user, setUser, loginUser, registerUser,
        contacts, fetchContacts, 
        avatars, setAvatars, uploadAvatar, 
        selectedChat, setSelectedChat, 
        message, setMessage, saveMessageToDB,
        socketRef,
        fetchMessages, messages, setMessages,
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