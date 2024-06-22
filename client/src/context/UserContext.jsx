import axios from 'axios'
import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import userReducer from '../reducer/UserReducer';
import { useSocket } from './SocketContext';



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

  //* Creating reducer
  const [userState, dispatch] = useReducer(userReducer, initialUserState);

  //* local context variables
  const { user, isLoading, tempAvatar, contacts } = userState;
  const [selectedChat, setSelectedChat] = useState(null)
  

  
//! User login
  const loginUser = async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, formData);

      dispatch({ type: "SET_LOADING_TRUE" });
      dispatch({ type: "SAVE_USER_INFO", payload: response.data });
      dispatch({ type: "SET_LOADING_FALSE" });



    } catch (error) {
      console.log(error)
    }
  }
//! User Register
  const registerUser = async (formData) => {
    try {

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, formData);

      dispatch({ type: "SET_LOADING_TRUE" });
      dispatch({ type: "SAVE_USER_INFO", payload: response.data });
      dispatch({ type: "SET_LOADING_FALSE" });

    } catch (error) {
      console.log(error.response.status, error.response.data.message)
    }
  }
//! Verify token
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


        dispatch({ type: "SET_LOADING_FALSE" });

      }
    } catch (error) {
      dispatch({ type: "RESET_USER_STATE" });
    }

  }
//! User logout
  const logoutUser = async () => {
    dispatch({ type: "RESET_USER_STATE" });
    navigate('/')
  }
//! Upload avatar
  const uploadAvatar = async (selectedAvatar) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/upload_avatar`, { image: selectedAvatar }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })

      dispatch({ type: "UPDATE_USER_INFO", payload: { fieldName: "avatar", updatedValue: selectedAvatar } })

      navigate('user')
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    console.log(userState.user)
  }, [userState.user])
  
//! fetchContacts
  const fetchContacts = async () => {
    try {
      const token =  localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/fetch_contacts`,
        {
          headers: {
            token,
          }
        }
    )
      dispatch({ type: "SET_CONTACTS", payload: response.data.contacts })

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
      }}
    >
      {isLoading ? <h1>Loading...</h1> : children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export default UserProvider;
export { useUser, initialUserState };