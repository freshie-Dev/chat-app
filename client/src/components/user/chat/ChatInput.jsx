// import React, { useState, useRef } from 'react';
// import Picker from "emoji-picker-react"
// import { IoSend, IoSendOutline } from "react-icons/io5";
// import { LuSendHorizonal } from "react-icons/lu";
// import { RiSendPlane2Line } from "react-icons/ri";
// import { MdEmojiEmotions, MdOutlineEmojiEmotions } from "react-icons/md";
// import styled from 'styled-components';

// const ChatInput = () => {
//     const [msg, setMsg] = useState('');
//     const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
//     const inputRef = useRef(null);

//     const handleEmojiClick = (emojiObject) => {
//         console.log(emojiObject.emoji)
//         setMsg(prevMsg => prevMsg + emojiObject.emoji);
//         setOpenEmojiPicker(false);
//         inputRef.current.focus(); // Focus the input field after selecting an emoji
//     };


//     return (
//         <Container className='flex flex-col m-2'>
//             {openEmojiPicker && (
//                 <div className='emoji'>
//                     {/* <Picker style={{ width: "100%", marginBottom: ".5rem", backgroundColor: "#3B3B3B" }} onEmojiClick={handleEmojiClick} /> */}
//                     <Picker  onEmojiClick={handleEmojiClick} />
//                 </div>
//             )}
//             <div className='flex justify-between items-start   overflow-hidden px-4 bg-c3 p-3  rounded-md'>

//                 <div className='w-[50px] bg-c4 h-[40px] mr-2 flex justify-center items-center text-c1 rounded-lg button '>
//                     <MdOutlineEmojiEmotions size={25} onClick={() => setOpenEmojiPicker(!openEmojiPicker)} />
//                 </div>

//                 <div className='w-full h-full flex rounded-lg bg-c4'>
//                     <input
//                         ref={inputRef}
//                         value={msg}
//                         name='message'
//                         onChange={e => setMsg(e.target.value)}
//                         placeholder='Message...'
//                         className='px-4 w-full min-h-[40px] bg-transparent placeholder:text-c1 text-c1 '
//                         type="text"
//                     />
//                 </div>
//                 <div className='w-[50px] bg-c4 h-[40px] ml-2 flex justify-center items-center text-c1 rounded-lg button'>
//                     <RiSendPlane2Line size={20} className='m-2' />
//                 </div>
//             </div>
//         </Container>
//     );
// };

// export default ChatInput;
// const Container = styled.div`
//     input:focus {
//         outline: none;
//     }
//     .button:hover {
//     & > * {
//         /* color: red; */
//         scale: 1.2;
//     }
// }
// `


import React, { useState, useRef } from 'react';
import Picker from "emoji-picker-react";
import { IoSend, IoSendOutline } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { RiSendPlane2Line } from "react-icons/ri";
import { MdEmojiEmotions, MdOutlineEmojiEmotions } from "react-icons/md";
import styled from 'styled-components';

const ChatInput = () => {
    const [msg, setMsg] = useState('');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const inputRef = useRef(null);

    const handleEmojiClick = (event, emojiObject) => {
        setMsg(prevMsg => prevMsg + emojiObject.emoji);
        setOpenEmojiPicker(false);
        inputRef.current.focus(); // Focus the input field after selecting an emoji
    };

    return (
        <Container className='flex flex-col m-2'>
            {openEmojiPicker && (
                <div className='emoji'>
                    <Picker onEmojiClick={handleEmojiClick} />
                </div>
            )}
            <div className='flex justify-between items-start overflow-hidden px-4 bg-c3 p-3 rounded-md'>
                <div className='w-[50px] bg-c4 h-[40px] mr-2 flex justify-center items-center text-c1 rounded-lg button'>
                    <MdOutlineEmojiEmotions size={25} onClick={() => setOpenEmojiPicker(!openEmojiPicker)} />
                </div>
                <div className='w-full h-full flex rounded-lg bg-c4'>
                    <input
                        ref={inputRef}
                        value={msg}
                        name='message'
                        onChange={e => setMsg(e.target.value)}
                        placeholder='Message...'
                        className='px-4 w-full min-h-[40px] bg-transparent placeholder:text-c1 text-c1'
                        type="text"
                    />
                </div>
                <div className='w-[50px] bg-c4 h-[40px] ml-2 flex justify-center items-center text-c1 rounded-lg button'>
                    <RiSendPlane2Line size={20} className='m-2' />
                </div>
            </div>
        </Container>
    );
};

export default ChatInput;

const Container = styled.div`
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
