import React from 'react'
import styled from 'styled-components'
import Sidebar from '../components/user/sidebar/Sidebar'
import ChatInput from '../components/user/chat/ChatInput'
import Messages from '../components/user/chat/Messages'
import Header from '../components/user/header/Header'

const UserDashboard = () => {
  return (
    <Layout>
      <aside className='md:block hidden bg-pink-600'>
        <Sidebar />
      </aside>
      <header>
        <Header/>
      </header>
      <section>
        <Messages />
        <ChatInput />
      </section>
    </Layout>
  )
}

export default UserDashboard

const Layout = styled.div`
  padding: 50px 80px;
  background-color: #383838;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 8% auto;
  grid-template-areas:
  "sidebar header"
  "sidebar section";
   
  aside {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    grid-area: sidebar;
    /* background: transparent; */
    /* background-color: #CF0A0A; */
    background-color: #DC5F00;
    /* background-color: rgb(59,59,59); */
    overflow-y: scroll;
  }
  header {
    border-top-right-radius: 5px;
    grid-area: header;
    /* background-color: #DC5F00; */
    /* background-color: #cf3f0a ; */
    /* background-color: var(--c1) ; */
    background-color: var(--c2) ;
  }
   section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* align-items: center; */
    border-bottom-right-radius: 5px;
    grid-area: section;
    background-color: #EEEEEE;
    /* background-color: yellow; */
    overflow-y: scroll;

 
  background:
    radial-gradient(orange 15%, transparent 16%) 0 0;
    /* radial-gradient(orange 15%, transparent 16%) 8px 8px; */
    /* radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,
    radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px; */
    background-color:#f3e1d2;
    background-size:19px 19px;
  }

  @media (max-width: 768px) {
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
`