import { createContext, useContext, useEffect, useRef, useState } from "react";

import axios from "axios";
import useSnack from "../utilities/useSnack";


const FriendListContext = createContext();

const FriendListProvider = ({ children }) => {

    //* imported contexts

    //* local context variables
    const [friendRequests, setFriendRequests] = useState([])

    //! Send friend requess
    const sendFriendRequest = async (receiverUniqueId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/send_friend_request`, {receiverUniqueId}, {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })
            const {message, receiverObj, notificationObj} = response.data;
            return {success: true, message, receiverObj, notificationObj}
            //! send notification using socket.
        } catch (error) {
            console.log(error)
            return {success: false, message: error.response.data.message}
        }
    }
    //! Response to friend request
    const respondFriendRequest = async (status, friendRequestId) => {
        const data = {
            status,
            friendRequestId
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/response_friend_request`, data , {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })
            
            return {status: response.data.status, friendRequestId}
        } catch (error) {
            console.log(error)
            return {status: false}
        }
    }
    //! Update Friend request when another user sends request
    const updateFriendRequests = (receiverObj) => {
        setFriendRequests(prevValue => [...prevValue, receiverObj])
    }


   
    return (
        <FriendListContext.Provider
            value={{
                sendFriendRequest,
                respondFriendRequest,
                updateFriendRequests,
                friendRequests,
            }}
        >
            {children}
        </FriendListContext.Provider>
    );
};
const useFriendList = () => {
    return useContext(FriendListContext);
};

export default FriendListProvider;
export { useFriendList };