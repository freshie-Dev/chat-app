import axios from 'axios'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useUser } from '../../../context/UserContext'
import styled from 'styled-components'
import {v4} from "uuid"

const Messages = () => {
  const { fetchMessages, messages, setMessages, selectedChat, socketRef } = useUser();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleMessageRecieve = async ()=> {
    if(socketRef.current) {
      socketRef.current.on("message_recieve", (message, date) => {
        console.log(message)
        console.log( date)
        setArrivalMessage({fromSelf: false, message, timeStamp: date})
      })
     }
  } 
  useEffect(() => {
    handleMessageRecieve()
  }, [socketRef.current])

  useEffect(() => {
    arrivalMessage && setMessages(prevMessages => {return [...prevMessages, arrivalMessage]})
  }, [arrivalMessage])
  
  useEffect(() => {
    if(selectedChat) fetchMessages()
  }, [selectedChat])
  
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  },[messages])
  



  if (messages.length === 0) {
    return (
      <div className='w-full h-full flex justify-center items-center '>
        <h2 className='bg-c3 text-c4 py-3 px-6 rounded-full'>Chat is empty</h2>
      </div>
    )
  }

  return (
    <div className='msg-container overflow-scroll border-t-4  border-[#e28e3f]'>
      <Container className=' flex flex-col pr-2 justify-end'>
        {messages.map((message, index) => {
          return (
            <div ref={scrollRef} key={v4()} className={` p-2 flex   ${message.fromSelf ? "justify-end right" : "left"}  `}>
              <div className='relative'>
                <p className={`text-c4 bg-c2 py-2 px-4 rounded-full   ${message.fromSelf ? "pr-[70px]" : "pr-[70px]"}`}>{message.message}</p>
                <span className='text-xs text-[#c4c4c4] absolute bottom-1 right-4'>{formatTime(message.timeStamp)}</span>
              </div>
            </div>
          )
        })}
      </Container>
    </div>
  )
}

export default Messages

const Container = styled.div`
  .msg-container {
   
  }
  
  .right {
    text-align: right;
  }
  .left {
    text-align: left;
  }
  .message-right {
  text-align: right;
  background-color: #d1ffd6;
  padding: 10px;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 60%;
  margin-left: auto;
}

/* Styles for messages on the left */
.message-left {
  text-align: left;
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 60%;
  margin-right: auto;
}
`