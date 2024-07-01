import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client'


const SocketContext = createContext();

const SocketProvider = ({ children }) => {


  const socketRef = useRef(null);
  const isUserMountedRef = useRef(false)
  const [isUserMounted, setIsUserMounted] = useState(false)


  const [messageFromSocket, setMessageFromSocket] = useState({})

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (!isUserMountedRef.current && localStorage.getItem('user')) {
      socketRef.current = io(import.meta.env.VITE_BASE_URL, {
        query: {
          data: JSON.stringify({
            _id: user._id,
            username: user.username
          })
        }
      })
      isUserMountedRef.current = true
    }
  }, [isUserMounted])
  // useEffect(() => {
  //   if (!isUserMounted && localStorage.getItem('user')) {
  //     socketRef.current = io(import.meta.env.VITE_BASE_URL, {
  //       query: {
  //         data: localStorage.getItem('user')
  //       }
  //     });
  //     setIsUserMounted(true);
  //   }
  // }, [isUserMounted]);

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
        messageFromSocket, setMessageFromSocket,
        setIsUserMounted,isUserMounted,
        isUserMountedRef
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