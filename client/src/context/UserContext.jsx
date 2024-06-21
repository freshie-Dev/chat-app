import axios from 'axios'
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'


const UserContext = createContext();

// const initialState = {
//   isLoading: false,
//   user: null,
//   avatars: [],
//   tempAvatar: null,
//   contacts: [],
//   selectedChat: null,
//   message: '',
//   messages: [],
// };

const UserProvider = ({ children }) => {

  const navigate = useNavigate()
  //   const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [avatars, setAvatars] = useState([]);
  const [tempAvatar, setTempAvatar] = useState(null)
  const [contacts, setContacts] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const socketRef = useRef(null)
  const isMounted = useRef(false);


  const setUserStatusOnline = ()=> {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    if(userInfo) {
      socketRef.current = io(import.meta.env.VITE_BASE_URL);
    }
      const data = {
        userId: userInfo._id,
        username: userInfo.username
      }
      socketRef.current.emit('add_user',data);
      socketRef.current.emit('login_user',userInfo._id);
  }

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, formData);

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user)

      setUserStatusOnline();
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log("im changing")
  }, [socketRef.current])
  

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
    console.log("verify token running")
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      } else {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/verify_token`, {
          headers: {
            token
          }
        })
          setUser(response.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.user))
  
          setUserStatusOnline();
          setIsLoading(false)
      }

    
    } catch (error) {
      setUser(null)
      localStorage.clear()
    }

  }

  const logoutUser = async () => {
    socketRef.current.emit('set_status_to_ofline',user._id);
    localStorage.clear()
    setUser(null)
    navigate('/')
  }

  const uploadAvatar = async (selectedAvatar) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/upload_avatar`, { image: selectedAvatar }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      setTempAvatar(selectedAvatar)
      navigate('user')
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

  const saveMessageToDB = async () => {
    const data = {
      from: user._id,
      to: selectedChat._id,
      message: message
    }
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

  const fetchMessages = async () => {
    try {

      const from = user._id;
      const to = selectedChat._id;

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/message/fetch_all_messages`, {
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
        user, setUser, loginUser, registerUser, logoutUser,
        contacts, fetchContacts,
        avatars, setAvatars, uploadAvatar, tempAvatar,
        selectedChat, setSelectedChat,
        message, setMessage, saveMessageToDB,
        socketRef, isMounted,
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