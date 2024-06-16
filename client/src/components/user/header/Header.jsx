import React from 'react'
import styled from 'styled-components'
import { IoMdPower } from "react-icons/io";
import { useUser } from '../../../context/UserContext';

const Header = () => {
    const {user} = useUser()
  return (
    <Container className='w-full h-full px-2 flex justify-between items-center'>
        <div>
            Hello, {user.username}
        </div>
        <div className='w-[50px] bg-c4 h-[60%] flex justify-center items-center rounded-md logout-button '>
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