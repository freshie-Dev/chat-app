import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Sidebar from '../components/user/sidebar/Sidebar'
import ChatInput from '../components/user/chat/ChatInput'
import Messages from '../components/user/chat/Messages'
import Header from '../components/user/header/Header'
import { useUser } from '../context/UserContext'
import { io } from 'socket.io-client'
import Welcome from '../components/user/welcome/Welcome'
import { useStyle } from '../context/StylesContext'
import ContactProfile from '../components/user/contact-profile/ContactProfile'

const UserDashboard = () => {
  const {selectedChat } = useUser()
  const {showSlider, setShowSlider, showContactProfile, contactProfileId} = useStyle()

  useEffect(() => {
    return () => {
      setShowSlider(false)
    }
  }, [])
  

  return (
    <Layout>
      <div className={`md:hidden w-[250px] bg-c3 h-full absolute top-0 ${showSlider ? "left-0" : "left-[-250px]"} z-[100] `}>
        <Sidebar />
      </div>
        <aside className='md:block hidden bg-pink-600'>
          <Sidebar />
        </aside>

        <header>
          <Header />
        </header>
        
        <section>
          {showContactProfile ? <ContactProfile contactId={contactProfileId} /> 
          : !selectedChat ?  <Welcome /> : 
          <>
            <Messages />
            <ChatInput />
          </>
          }
          {
          
          }

        </section>
    </Layout>
  )
}

export default UserDashboard

const Layout = styled.div`
padding: 50px 80px;;
height: 100vh;
width: 100%;
overflow: hidden;
position: relative;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 10% 90%;
  grid-template-areas:
  "sidebar header"
  "sidebar section";
   
  @media (max-width: 768px) {
    height: 100vh;
    border-radius: 0;
    padding: 0;
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "section";
    header, section {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }

  aside {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    overflow: hidden;
    grid-area: sidebar;
    /* background: transparent; */
    /* background-color: #CF0A0A; */
    background-color: #DC5F00;
    /* background-color: rgb(59,59,59); */
  }
  header {
    /* border-bottom: var(--c1) 3px solid; */
    border-top-right-radius: 5px;
    grid-area: header;
    /* background-color: #DC5F00; */
    /* background-color: #cf3f0a ; */
    /* background-color: var(--c1) ; */
    background-color: var(--c2) ;
  }
   section {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
    /* align-items: center; */
    border-bottom-right-radius: 5px;
    overflow: hidden;
    grid-area: section;
    background-color: #EEEEEE;


  background:
    radial-gradient(orange 15%, transparent 16%) 0 0;
    /* radial-gradient(orange 15%, transparent 16%) 8px 8px; */
    /* radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,
    radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px; */
    background-color:#f3e1d2;
    background-size:19px 19px;
  }

 
`