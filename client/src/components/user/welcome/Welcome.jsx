import React from 'react'
import styled from 'styled-components'
import AnimatedGlob from "../../../custom-components/animated-glob/AnimatedGlob"
import { useUser } from '../../../context/UserContext'

const Welcome = () => {
    const {user} = useUser()
  return (
    <Container className=''>
        <AnimatedGlob text="Welcome!"/>
        <h2>Hello <span className='text-c3'>{user.username}</span></h2>
        <p className='my-4 text-[#afaeae]'>Select a contact to start chatting</p>
    </Container>
  )
}

export default Welcome
const Container = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: var(--c1);
`