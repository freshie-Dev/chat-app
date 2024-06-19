import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { easeIn, easeInOut, motion } from "framer-motion"


import { lightTheme, darkTheme } from '../styled-components/Themes';
import styled from 'styled-components';
import AuthForm from '../custom-components/auth-form/Form';

import AnimatedGlob from '../custom-components/animated-glob/AnimatedGlob';

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
  //     return <Navigate to="avatars" />;
  //     // return <Navigate to="user" />;
  //   } else if (user.type === 'admin') {
  //     return <Navigate to="avatars" />;
  //     // return <Navigate to="admin" />;
  //   }
  // }
  if(user) return <><Navigate to='avatars'/></>
 

  return (
    <Container className='md:my-0 my-[50px]'>
      <AnimatedGlob text="Secret Chat"/>
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
