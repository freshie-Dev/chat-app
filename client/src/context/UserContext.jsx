import axios from 'axios'
import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import userReducer from '../reducer/UserReducer';
import { useSocket } from './SocketContext';



const UserContext = createContext();

const initialUserState = {
  isLoading: false,
  user: null,
  contacts: [],
  message: '',
  messages: [],
};

const UserProvider = ({ children }) => {

  const navigate = useNavigate()

  //* Creating reducer
  const [userState, dispatch] = useReducer(userReducer, initialUserState);

  //* local context variables
  const { user, isLoading, contacts } = userState;
  const [selectedChat, setSelectedChat] = useState(null)



  //! User login
  const loginUser = async (formData, callback) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, formData);

      dispatch({ type: "SET_LOADING_TRUE" });
      dispatch({ type: "SAVE_USER_INFO", payload: response.data });
      dispatch({ type: "SET_LOADING_FALSE" });

      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (callback) callback()

    } catch (error) {
      console.log(error)
    }
  }
  //! User Register
  const registerUser = async (formData, callback) => {
    try {

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, formData);

      dispatch({ type: "SET_LOADING_TRUE" });
      dispatch({ type: "SAVE_USER_INFO", payload: response.data });
      dispatch({ type: "SET_LOADING_FALSE" });

      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (callback) callback()

    } catch (error) {
      console.log(error.response.status, error.response.data.message)
    }
  }
  //! User logout
  const logoutUser = async (callback) => {
    dispatch({ type: "RESET_USER_STATE" });
    console.info("logging OUT")
    navigate('/')
    if (callback) callback()
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
        localStorage.setItem('user', JSON.stringify(response.data.user));

        dispatch({ type: "SET_LOADING_FALSE" });

      }
    } catch (error) {
      dispatch({ type: "RESET_USER_STATE" });
    }

  }
  //! Update user profile
  const updateUserInfo = async (formData) => {
    // console.log(formData)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/update_user_info`, formData, {
        headers: {
          "token": localStorage.getItem('token')
        }
      })
      dispatch({ type: "UPDATE_USER_INFO", payload: response.data.user })

      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error) {
      console.log(error)
    }
  }
  //! Upload profile picture 
  const uploadProfilePicture = async (profilePicture) => {
    const data = {
      profilePicture
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/upload_profile_picture`, data, {
        headers: {
          token: localStorage.getItem('token')
        }
      })

      dispatch({ type: "UPDATE_PROFILE_PICTURE", payload: profilePicture })

      let user = JSON.parse(localStorage.getItem('user'))
      user = {
        ...user,
        profile: {
          ...user.profile,
          profilePicture,
          isProfilePictureSet: true,
        }
      }
      localStorage.setItem('user', JSON.stringify(user))

      navigate('/user')
    } catch (error) {
      console.log(error)
    }
  }
  //! Upload user details
  const uploadUserDetails = async (formData) => {

    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value
    }
    )
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/upload_user_details`, obj, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      dispatch({ type: "UPDATE_USER_INFO", payload: response.data.user })



      localStorage.setItem('user', JSON.stringify(response.data.user))

      navigate('user')
    } catch (error) {
      console.log(error)
    }
  }


  //! fetchContacts
  const fetchContacts = async () => {
    try {
      console.log("fetching contacts")
      const token = localStorage.getItem('token');
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
        uploadUserDetails,
        selectedChat, setSelectedChat,
        updateUserInfo, uploadProfilePicture
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