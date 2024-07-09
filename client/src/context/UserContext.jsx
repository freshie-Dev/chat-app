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
    const formDataObj = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataObj.append(key, formData[key]);
      }
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/update_user_info`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': localStorage.getItem('token')
        }
      })
      dispatch({ type: "UPDATE_USER_INFO", payload: response.data.user })

      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error) {
      console.log(error)
    }
  }
  //! Update User Friend Requests
  const updateFriendRequests = async (requestObj) => {
    console.log("imrunning")
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/fetch_friend_request`, {
        params: requestObj, // Use params to send the request object
        headers: {
          token
        }
      });

      dispatch({ type: "UPDATE_FRIEND_REQUESTS", payload: response.data.friendRequest })
    } catch (error) {
      console.log(error)
    }
  }
  //! Update User Notifications
  const updateNotifications = (notificationObj) => {
    try {
      dispatch({ type: "UPDATE_NOTIFICATIONS", payload: notificationObj })
    } catch (error) {
      console.log(error)
    }
  }
  //! Upload profile picture 
  const uploadProfilePicture = async (profilePicture) => {
    const formData = new FormData()
    formData.append('profilePicture', profilePicture)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/upload_profile_picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': localStorage.getItem('token')
        }
      });

      dispatch({ type: "UPDATE_PROFILE_PICTURE", payload: response.data.profilePictureUrl })

      let user = JSON.parse(localStorage.getItem('user'))
      user = {
        ...user,
        profile: {
          ...user.profile,
          profilePicture: response.data.profilePictureUrl,
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
  //! Update contacts
  const fetchLatestContact = async () => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/fetch_latest_contact`, {
        headers: {
          "token": localStorage.getItem('token')
        }
      })
      console.log(response.data)
      dispatch({ type: "UPDATE_CONTACTS", payload: response.data.latestFriend })
    } catch (error) {
      console.log(error)
    }
  }
  //! Update the status of a single friend request
  const updateFriendRequestStatus = (status, friendRequestId) => {
    try {
      dispatch({ type: "UPDATE_FRIEND_REQUEST_STATUS", payload: { status, friendRequestId } })
    } catch (error) {
      console.log(error)
    }
  }

  //! Update notification status
  const updateNotification = (data) => {
    console.log("running 4")
    try {
      dispatch({ type: "UPDATE_NOTIFICATION_STATUS", payload: { status: data.status, friendRequestObj: data.friendRequestObj } })
    } catch (error) {
      console.log(error)
    }
  }

  //! Delete a contact
  const deleteContact = async (contactId) => {
    console.log(contactId)
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/auth/delete_contact/${contactId}`, {
        headers: {
          "token": localStorage.getItem('token')
        }
      });
      const {deletedFriendId} = response.data;

      dispatch({type: "DELETE_SINGLE_CONTACT", payload: deletedFriendId})
      setSelectedChat(null)

      return true


      // Optionally, you can perform additional actions after successful deletion
    } catch (error) {
      console.error(error); // Handle error
      // Optionally, handle specific errors or show error messages to the user
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
        updateUserInfo, uploadProfilePicture,
        updateFriendRequests,
        updateNotifications,
        fetchLatestContact,
        updateFriendRequestStatus,
        updateNotification,
        deleteContact,
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