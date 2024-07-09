import React, { useEffect } from 'react'
import styled from 'styled-components'
import { IoMdPower } from "react-icons/io";
import { useUser } from '../../../context/UserContext';
import { PiChatTeardropDotsBold } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";
import { useStyle } from '../../../context/StylesContext';
import { useSocket } from '../../../context/SocketContext';

import userBlackIcon from "../../../assets/images/user-icon-black.png"

const Header = () => {
    const { user, selectedChat, logoutUser } = useUser()
    const { setUserStatusOfline, isUserMountedRef  } = useSocket();
    const {showSlider, setShowSlider, handleShowContactProfile} = useStyle();

    return (
        <Container className='w-full h-full px-2 py-2 flex justify-between items-center'>
            <div className={`md:hidden flex items-center ${showSlider ? "ml-[250px]": ""}`}>

                <div onClick={e => setShowSlider(!showSlider)} className='chats-button w-[40px] h-[40px] bg-c4 flex justify-center items-center rounded-full  '>
                    <PiChatTeardropDotsBold className='text-c1' size={26} />
                </div>
                <IoMdArrowDropright size={25} className={`m-0 p-0 ${showSlider ? "show" : "hide"}`} />
            </div>

            {selectedChat && <div className=' flex items-center gap-2 bg-c4 rounded-md px-2 h-full min-w-[220px]'>
                <img onClick={()=> handleShowContactProfile(selectedChat._id)} className='w-[40px] h-[40px] object-cover rounded-[50%]'  src={selectedChat.profile.isProfilePictureSet ? selectedChat.profile.profilePicture : userBlackIcon} alt="" />
                <p className='font-base text-c1 text-medium'>{selectedChat && selectedChat.username}</p>
            </div>}
            <div className='md:block hidden'></div>
            <div onClick={() => {logoutUser(()=> {isUserMountedRef.current=false; setUserStatusOfline(user._id)})  }} className='w-[40px] h-[40px] bg-c4 flex justify-center items-center rounded-full logout-button '>
                <IoMdPower size={20} className='logout-logo text-c1' />
            </div>
        </Container>
    )
}

export default Header
const Container = styled.div`
.logout-button:hover {
    & > * {
        color: red;
        scale: 1.4;
    }
}
.chats-button:hover{
    & > * {
        color: var(--c3);
        scale: 1.2;
        /* scale */
    }
}

.show {
    transform: rotate(180deg);
}
.hide {
    transform: rotate(0);
}
    /* color: var(--c1); */
`