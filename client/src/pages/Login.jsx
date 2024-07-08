import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Navigate, useLocation } from 'react-router-dom';


import styled from 'styled-components';
import AuthForm from '../custom-components/auth-form/Form';

import AnimatedGlob from '../custom-components/animated-glob/AnimatedGlob';
import ProtectedUserRoutes from '../protected-routes/ProtectedUserRoutes';

const Login = () => {

  const { user } = useUser();
  
  if (user) {
    if (user.profile?.isProfilePictureSet) {
      
      return <Navigate to='/user' />
      // return <Navigate to={<ProtectedUserRoutes/>} />
      
    } else {
      return <Navigate to='/avatars' />
    }
  }

  return (
    <Container >
      <AnimatedGlob text="Chatify" />

      <div className='w-[50%] sm:w-full flex justify-center items-center'>
        <AuthForm />
      </div>
    </Container>
  )
};

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

 
`;
export default Login;
