import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from '../../../styled-components/Button';
import { Link } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

const Avatars = () => {
    const {uploadAvatar, avatars, setAvatars} = useUser()
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);

    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const avatarIds = ['Avatar1', 'Avatar2', 'Avatar3', 'Avatar4'];
                const avatarPromises = avatarIds.map(async (id) => {
                    const response = await axios.get(`https://api.multiavatar.com/${JSON.stringify(id)}`);
                    const svg = response.data;
                    const base64 = btoa(svg); // Convert SVG to base64
                    return `data:image/svg+xml;base64,${base64}`;
                });

                const avatarUrls = await Promise.all(avatarPromises);
                setAvatars(avatarUrls);
            } catch (error) {
                console.error('Error fetching avatars:', error);
            }
        };

        fetchAvatars();
    }, []);

    useEffect(() => {
        console.log(selectedAvatarIndex);
    }, [selectedAvatarIndex]);

    return (
        <Container className="bg-c3">
            <h1 className={`logo-font text-c4 my-4 md:my-8 ${selectedAvatarIndex === null && 'animate-blinkingBg'}`}>
                Select your avatar
            </h1>
            <div className="md:flex gap-6 rounded-full p-2 border-2 border-c1">
                {avatars.map((avatar, index) => (
                    <img
                        onClick={() => setSelectedAvatarIndex((prevVal) => (prevVal === index ? null : index))}
                        className={`w-[70px] md:w-[100px] m-6 avatar-shadow rounded-full ${selectedAvatarIndex === index && 'selected-avatar'
                            }`}
                        key={index}
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                    />
                ))}
            </div>
            <Link to="/user">
                <Button onClick={()=> uploadAvatar(avatars[selectedAvatarIndex])} disabled={selectedAvatarIndex === null} margin="40px auto" width="150px" height="50px" borderRadius="30px" fontSize="1.2rem">
                    Proceed
                </Button>
            </Link>
        </Container>
    );
};


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;

  /* @media (max-width: 768px) {
    flex-direction: column;
  } */
  .avatar-shadow {
    filter: drop-shadow(0 0 0rem white);
    /* transition: ease-in-out 1s; */
    box-sizing: content-box;
    transition: all 0.1s ease-in-out;
    filter: drop-shadow(-1px -2px 0px #EEEEEE) 
    drop-shadow(1px -2px 0px #EEEEEE) 
    drop-shadow(2px 2px 0px #EEEEEE)
    drop-shadow(-2px 2px 0px #EEEEEE)
    /* brightness(80%); */
    
  }
  .avatar-shadow:hover {
    filter: 
        drop-shadow(0px 0px 1rem white)
        brightness(1.3);
        /* scale: 1.2 */
  }
  .selected-avatar {
    filter: 
        drop-shadow(0 0 1rem white)
        brightness(1.3);
        scale: 1.2;
    }
  h1 {
    box-shadow: none;
  }

 
`;
export default Avatars;
