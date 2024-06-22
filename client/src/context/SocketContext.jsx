import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client'


const SocketContext = createContext();

const SocketProvider = ({ children }) => {


  const socketRef = useRef(null);
  const isMounted = useRef(false)
  // socketRef.current = io(import.meta.env.VITE_BASE_URL);


  const [messageFromSocket, setMessageFromSocket] = useState({})

  useEffect(() => {
    if (!isMounted.current && localStorage.getItem('user')) {
      socketRef.current = io(import.meta.env.VITE_BASE_URL, {
        query: {
          data: localStorage.getItem('user')
        }
      })
    }
  }, [isMounted])


  //! set user status ofline
  const setUserStatusOfline = (userId) => {
    socketRef.current.emit('set_status_to_ofline', userId);
  }
  //! sending message through socket
  const socketMessageSend = (user, selectedChat, message, date) => {
    socketRef.current.emit('send_message', {
      to: selectedChat._id,
      from: user._id,
      message: message,
      date
    })
  }

  //! On recieving message from a user
  const socketMessageRecieve = (message, date) => {
    const newMessage = {
      fromSelf: false,
      message,
      timeStamp: date
    }
    setMessageFromSocket(newMessage)
  }


  // socketRef.current.on("message_recieve", (message, date) => socketMessageRecieve(message, date))
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("message_recieve", (message, date) => {
        socketMessageRecieve(message, date)
      });
    }
  }, [socketRef.current])

  return (
    <SocketContext.Provider
      value={{
        setUserStatusOfline,
        socketMessageSend,
        messageFromSocket, setMessageFromSocket
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
const useSocket = () => {
  return useContext(SocketContext);
};

export default SocketProvider;
export { useSocket };