import React, { useState, useRef, useEffect } from 'react';
import Picker from "emoji-picker-react";
import { RiSendPlane2Line } from "react-icons/ri";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import styled from 'styled-components';
import { useUser } from '../../../context/UserContext';
import useSnack from '../../../utilities/useSnack';
import { useChat } from '../../../context/ChatContext';
import { useSocket } from '../../../context/SocketContext';


const ChatInput = () => {

    const { showError } = useSnack()
    const {  selectedChat, user } = useUser();
    const {socketRef, socketMessageSend} = useSocket()
    const { message, setMessage, setMessages, saveMessageToDB} = useChat();


    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const inputRef = useRef(null);

    const handleEmojiClick = (emojiObject) => {
        setMessage(prevMsg => prevMsg + emojiObject.emoji);
        setOpenEmojiPicker(false);
        inputRef.current.focus(); // Focus the input field after selecting an emoji
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const date = new Date().toISOString();

        if (message.length > 0) {
            setMessage('')
            //* send message using socket
            socketMessageSend(user, selectedChat, message, date)
            // socketRef.current.emit('send_message', {
            //     to: selectedChat._id,
            //     from: user._id,
            //     message: message,
            //     date
            // })
            //* save message to database
            saveMessageToDB(user, selectedChat)

            //* update the chat with new messages
            setMessages(prevMsgs => [...prevMsgs, { message, fromSelf: true, timeStamp: date }])
            

        } else {
            showError("Message Empty")
        }
    }



    return (
        <Container className='flex flex-col    w-full'>
            {openEmojiPicker && (
                <div className='emoji'>
                    <Picker onEmojiClick={handleEmojiClick} />
                </div>
            )}
            <form autoComplete='off' onSubmit={handleSendMessage} className='flex justify-between items-start  px-4 bg-c3 p-3 rounded-md'>
                <div className='w-[50px] bg-c4 h-[40px] mr-2 flex justify-center items-center text-c1 rounded-lg button'>
                    <MdOutlineEmojiEmotions size={25} onClick={() => setOpenEmojiPicker(!openEmojiPicker)} />
                </div>
                <div className='w-full h-full flex rounded-lg bg-c4'>
                    <input
                        ref={inputRef}
                        value={message}
                        name='message'
                        onChange={e => setMessage(e.target.value)}
                        placeholder='Message...'
                        className='px-4 w-full min-h-[40px] bg-transparent placeholder:text-c1 text-c1'
                        type="text"
                    />
                </div>
                <button type='submit' className='w-[50px] bg-c4 h-[40px] ml-2 flex justify-center items-center text-c1 rounded-lg button'>
                    <RiSendPlane2Line size={20} className='m-2' />
                </button>
            </form>
        </Container>
    );
};

export default ChatInput;

const Container = styled.div`

padding: 0 5px 10px 5px;
input:focus {
    outline: none;
}
.button:hover {
    & > * {
            scale: 1.2;
        }
    }
    .emoji {
       
        position: relative;
        .epr_q53mwh {
            background-color: var(--c1);
            color: var(--c4);
            .emoji-scroll-wrapper::-webkit-scrollbar {
                background-color: #080420;
                width: 5px;
                &-thumb {
                    background-color: #9a86f3;
                }
            }
            
        }
    }
    `;

// useEffect(() => {
//     // Establish the Socket.IO connection only once, when the component mounts
//     socketRef.current = io.connect(import.meta.env.VITE_BASE_URL);
//     return () => {
//         // Clean up the connection when the component unmounts
//         socketRef.current.disconnect();
//     };
// }, []);




// useEffect(() => {
//     setCount(count + 1)
//     const id = setInterval(() => setCount((count) => count + 1), 1000);
//     socketRef.current.on("recieve_message", (data)=> {
//         console.log(count)
//         alert(data.message)
//     })
//     return () => {
//         clearInterval(id);
//     }
// }, [socketRef.current])