import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useUser } from '../../../context/UserContext';
import "../../../styles/ProfileInput.css";
import ProfilePicture from '../avatars/ProfilePicture';
import Input from '../avatars/Input';
import userIconWhite from "../../../assets/images/user-icon-white.png";
import Button from '../../../styled-components/Button';
import { formatTime } from '../../../utilities/Helpers';
import { IoCopy } from "react-icons/io5";
import useSnack from "../../../utilities/useSnack"
const Profile = () => {

  const {showSuccess} = useSnack()
  const { user, updateUserInfo } = useUser();
  const originalFormData = useMemo(() => ({
    profilePicture: user.profile.isProfilePictureSet ? user.profile.profilePicture : userIconWhite,
    username: user.username,
    displayName: user.profile?.displayName || '',
    gender: user.profile?.gender || '',
    bio: user.profile?.bio || '',
    dob: user.profile?.dob ? formatTime(user.profile.dob) : "" 
  }), [user]);

  const [isFormDataChanged, setIsFormDataChanged] = useState(false);
  const [formData, setFormData] = useState(originalFormData);

  useEffect(() => {
    const hasFormDataChanged = () => {
      return Object.keys(formData).some(key => formData[key] !== originalFormData[key]);
    };
    setIsFormDataChanged(hasFormDataChanged());
  }, [formData, originalFormData]);

  useEffect(() => {
    setFormData(originalFormData)
  }, [user])
  
  return (
    <Container className=''>
      <Content>
        <div className='flex justify-center items-center h-[20%] w-[110%] bg-c4 text-c1 rounded-b-[60%]'>
          <h1>Profile</h1>
        </div>
        <div className='flex items-center gap-2 cursor-pointer group' onClick={()=> {navigator.clipboard.writeText(user.uniqueId); showSuccess("Unique Id copied")}}>
          <p className='text-c1 my-4'>Unique ID: <span className='text-[#cecece]'>{user.uniqueId}</span></p>
          <IoCopy className='group-hover:text-c1 '/>
        </div>

        <ProfilePicture user={user} formData={formData} setFormData={setFormData} />
        <Input user={user} formData={formData} setFormData={setFormData} />

        {isFormDataChanged && (
          <div className='flex w-[330px] sm:[500px] md:w-[500px] gap-2 my-10 px-4'>
            <Button width="50%"  primary border="2px solid var(--c1)">Cancel</Button>
            <Button onClick={()=> {updateUserInfo(formData);}} width="50%" >Save</Button>
          </div>
        )}
      </Content>
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  padding: 50px 80px;
  height: 100vh;
  min-height: 100vh;
  width: 100%;

  @media (max-width: 768px) {
    border-radius: 0;
    padding: 0;
  }
`;

const Content = styled.div`
  width: 100%;
  min-height: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--c3);
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: #fff; */

  @media (max-width: 768px) {
    border-radius: 0;
  }
`;
