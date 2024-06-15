import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { easeIn, easeInOut, motion } from "framer-motion"

import StyledButton from '../styled-components/Button';

import { lightTheme, darkTheme } from '../styled-components/Themes';
import styled from 'styled-components';
import AuthForm from '../custom-components/auth-form/Form';

import "../styles/blobStyles.css"

const Login = () => {
  const { user, loginUser } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser(formData)
  };

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };



  // if (user) {
  //   if (user.type === 'user') {
  //     console.log("user running")
  //     return <Navigate to="avatars" />;
  //     // return <Navigate to="user" />;
  //   } else if (user.type === 'admin') {
  //     console.log("admin running")
  //     return <Navigate to="avatars" />;
  //     // return <Navigate to="admin" />;
  //   }
  // }
  if(user) {
    
    return <><Navigate to='avatars'/></>
  }
  console.log(user)

  return (
    <Container className='md:my-0 my-[50px]'>
      <div className='w-[50%] sm:w-full flex justify-center items-center relative min-w-max'>
        <h1 className=" logo-font absolute z-50  bg-[#3B3B3B] border-[2px] border-[white] text-[#DC5F00] sm:px-10 px-4 py-2 rounded-full bg-opacity-85 shadow-inner  ">Secret Chat</h1>
        <div id='blob' class="bm-pl">
          <div class="bm-pl__blob bm-pl__blob--r"></div>
          <div class="bm-pl__blob bm-pl__blob--g"></div>
          <div class="bm-pl__blob bm-pl__blob--b"></div>
        </div>
      </div>
      <div className='w-[50%] sm:w-full flex justify-center items-center'>
        <AuthForm />

      </div>
    </Container>
  )
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }

 
`;
export default Login;
