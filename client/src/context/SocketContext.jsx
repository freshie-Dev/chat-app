import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client'


const SocketContext = createContext();

const SocketProvider = ({ children }) => {


  const socketRef = useRef(null);
  const isUserMountedRef = useRef(false)
  const [isUserMounted, setIsUserMounted] = useState(false)


  const [messageFromSocket, setMessageFromSocket] = useState({})
  const [requestFromSocket, setRequestFromSocket] = useState(null)
  const [notificationFromSocket, setNotificationFromSocket] = useState(null)

  const reqRef = useRef(false)
  const notRef = useRef(false)

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
  //! Sending notification of friend request
  const socketSendFriendRequest = (receiverObj) => {
    socketRef.current.emit('send_friend_request', receiverObj)
  }
  //! On recieving request from a user
  const socketNotificationRecieve = (receiverObj) => {
    setRequestFromSocket(receiverObj)
  }
  //! invoke update friend request notification
  const socketUpdateSenderNotification = (status, friendRequestObj) => {
    socketRef.current.emit('update_friend_request_notification', {status, friendRequestObj})
  }

  //! update friend request notification for receiver
  const socketUpdateNotification = (data) => {
    console.log("running 2")
    setNotificationFromSocket(data)
  }

  // socketRef.current.on("message_recieve", (message, date) => socketMessageRecieve(message, date))
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("message_recieve", (message, date) => {
        socketMessageRecieve(message, date)
      });
      socketRef.current.on("request_receive", (receiverObj) => {
        socketNotificationRecieve(receiverObj)
        reqRef.current = true;
        console.log(reqRef.current)
      });
      socketRef.current.on("update_friend_request_notification_receive", (data) => {
        console.log("running 1")
        notRef.current = true;
        socketUpdateNotification(data)
      });
      
    }
  }, [socketRef.current])

  return (
    <SocketContext.Provider
      value={{
        setUserStatusOfline,
        socketMessageSend,
        socketSendFriendRequest,
        messageFromSocket, setMessageFromSocket,
        requestFromSocket,
        setRequestFromSocket,
        reqRef,
        socketUpdateSenderNotification,
        notificationFromSocket,
        notRef,

        setIsUserMounted, isUserMounted,
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