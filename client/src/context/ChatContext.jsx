import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client'
import { useUser } from "./UserContext";
import axios from "axios";


const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    //* imported contexts

    //* local context variables
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const saveMessageToDB = async (user, selectedChat) => {
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

    const fetchMessages = async (user, selectedChat) => {
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

    return (
        <ChatContext.Provider
            value={{
                fetchMessages,
                message, setMessage,
                messages, setMessages,
                saveMessageToDB,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
const useChat = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
export { useChat };