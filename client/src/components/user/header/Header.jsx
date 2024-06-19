import React, { useEffect } from 'react'
import styled from 'styled-components'
import { IoMdPower } from "react-icons/io";
import { useUser } from '../../../context/UserContext';

const Header = () => {
    const {user, selectedChat} = useUser()
    
  return (
    <Container className='w-full h-full px-2 py-2 flex justify-between items-center'>
       {selectedChat &&  <div className='flex items-center gap-2 bg-c4 rounded-md px-2 h-full min-w-[220px]'>
           <img width={45} src={selectedChat && selectedChat.avatar} alt="" />
           <p className='font-base text-c1 text-medium'>{selectedChat && selectedChat.username}</p>
        </div>}
        <div></div>
        <div className='w-[40px] h-[40px] bg-c4 flex justify-center items-center rounded-full logout-button '>
            <IoMdPower size={20} className='logout-logo text-c1' />
        </div>
    </Container>
  )
}

export default Header
const Container =  styled.div`
.logout-button:hover {
    & > * {
        color: red;
        scale: 1.4;
    }
}
    /* color: var(--c1); */
`