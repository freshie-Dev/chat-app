import React from 'react'
import styled from 'styled-components'
import Sidebar from '../components/user/sidebar/Sidebar'

const UserDashboard = () => {
  return (
    <Layout>
      <aside className='md:block hidden'>
        <Sidebar />
      </aside>
      <header></header>
      <section></section>
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
  grid-template-rows: 8% 92%;
  grid-template-areas:
  "sidebar header"
  "sidebar section";
   
  aside {
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    grid-area: sidebar;
    /* background-color: #CF0A0A; */
    background-color: #DC5F00;
    /* background-color: rgb(59,59,59); */
    overflow-y: scroll;
  }
  header {
    border-top-right-radius: 7px;
    grid-area: header;
    /* background-color: #DC5F00; */
    background-color: #CF0A0A;
  }
   section {
    border-bottom-right-radius: 7px;
    grid-area: section;
    /* background-color: #EEEEEE; */
    background-color: yellow;
    overflow-y: scroll;
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