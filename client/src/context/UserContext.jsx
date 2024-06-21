import axios from 'axios'
import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'
import userReducer from '../reducer/UserReducer';


const UserContext = createContext();

const initialUserState = {
  isLoading: false,
  user: null,
  tempAvatar: null,
  contacts: [],
  selectedChat: null,
  message: '',
  messages: [],
};

const UserProvider = ({ children }) => {
  const navigate = useNavigate()

  const [userState, dispatch] = useReducer(userReducer, initialUserState);
  const { user, isLoading, tempAvatar, contacts } = userState;


  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const socketRef = useRef(null)
  const isMounted = useRef(false);


  const setUserStatusOnline = (userId, username) => {
    console.log("from set user status", userId, username)
    socketRef.current = io(import.meta.env.VITE_BASE_URL);

    const data = {
      userId,
      username,
    }
    socketRef.current.emit('add_user', data);
    socketRef.current.emit('login_user', userId);
  }

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, formData);

      dispatch({ type: "SET_LOADING_TRUE" });
      dispatch({ type: "SAVE_USER_INFO", payload: response.data });
      dispatch({ type: "SET_LOADING_FALSE" });


      setUserStatusOnline(response.data.user._id, response.data.user.username);

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

      dispatch({ type: "SET_LOADING_TRUE" });
      dispatch({ type: "SAVE_USER_INFO", payload: response.data });
      dispatch({ type: "SET_LOADING_FALSE" });

      setUserStatusOnline(response.data.user._id, response.data.user.username);

    } catch (error) {
      console.log(error.response.status, error.response.data.message)
    }
  }

  const verifyToken = async () => {
    console.log("verify token running")
    dispatch({ type: "SET_LOADING_TRUE" });
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        dispatch({ type: "RESET_USER_STATE" });

        dispatch({ type: "SET_LOADING_FALSE" });
        return
      } else {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/verify_token`, {
          headers: {
            token
          }
        })
        dispatch({ type: "SAVE_USER_INFO", payload: response.data });

        setUserStatusOnline(response.data.user._id, response.data.user.username);

        dispatch({ type: "SET_LOADING_FALSE" });

      }
    } catch (error) {
      dispatch({ type: "RESET_USER_STATE" });
    }

  }

  const logoutUser = async () => {
    socketRef.current.emit('set_status_to_ofline', user._id);
    dispatch({ type: "RESET_USER_STATE" });
    navigate('/')
  }

  const uploadAvatar = async (selectedAvatar) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/upload_avatar`, { image: selectedAvatar }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      dispatch({ type: "UPDATE_USER_INFO", payload: { fieldName: tempAvatar, updatedValue: selectedAvatar } })
      navigate('user')
    } catch (error) {
      console.log(error)
    }
  }

  const fetchContacts = async () => {
    try {
      const token =  localStorage.getItem('token');
      console.log("token from fetch contacts",token)
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/fetch_contacts`,
        {
          headers: {
            token,
          }
        }
    )
      const data = response.data;

      dispatch({ type: "SET_CONTACTS", payload: response.data.contacts })

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
        user,
        loginUser, registerUser, logoutUser,
        contacts, fetchContacts,
        uploadAvatar, tempAvatar,
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
export { useUser, initialUserState };