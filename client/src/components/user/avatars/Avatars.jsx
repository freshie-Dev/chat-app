import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from '../../../styled-components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { TbPlayerTrackNextFilled } from "react-icons/tb";

import "../../../styles/ProfileInput.css"
import { compressImage } from '../../../utilities/Helpers';

const Avatars = () => {
    const navigate = useNavigate();
    const {uploadProfilePicture} = useUser();


    const [avatars, setAvatars] = useState([])
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null)
    const [profilePicture, setProfilePicture] = useState(null)

    const [selectedImage, setSelectedImage] = useState(null)

    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const [uploadedPictureSelected, setUploadedPictureSelected] = useState(false)
    const [avatarFileObj, setAvatarFileObj] = useState([])
    const [imageFileObj, setImageFileObj] = useState([])

    
    const imageRef = useRef();

    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const avatarIds = ['Avatar1', 'Avatar2', 'Avatar3', 'Avatar4'];
                const avatarPromises = avatarIds.map(async (id) => {
                    const rand = Math.floor(100000 + Math.random() * 900000)
                    const response = await axios.get(`https://api.multiavatar.com/${rand}`);
                    const svg = response.data;

                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                    const file = new File([blob], "user_avatar", { type: blob.type });

                    const reader = new FileReader()

                    const base64Promise = new Promise((resolve, reject) => {
                        reader.onloadend = () => {
                            
                            resolve(reader.result);
                        };
                        reader.onerror = reject;
                    });
                    reader.readAsDataURL(file);
                    const base64Url = await base64Promise;
                    // Return the base64 URL or file object
                    setAvatarFileObj(prevVal => {
                        return [...prevVal, file]
                    })
                    return base64Url;
                });

                const avatarUrls = await Promise.all(avatarPromises);
                
                setAvatars(avatarUrls);
            } catch (error) {
                console.error('Error fetching avatars:', error);
            }
        };
        // fetchAvatars();
    }, []);
    
    const handleImageChange = async(e)=> {
        const image = e.target.files[0]
        try {
            const compressedImage = await  compressImage(image)
            
            //! setting local profile image src
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfilePicture(reader.result)
            }
            reader.readAsDataURL(compressedImage)

            setImageFileObj(image)
            setSelectedAvatarIndex(null)
            setUploadedPictureSelected(true)
            setSelectedImage(compressedImage)

        } catch (error) {
            console.error('Error compressing image:', error)
        }
    }
    const handleAvatarClick = (index) => {
        setSelectedAvatarIndex(prevVal => {
            return (prevVal === index ? null : index) 
        });
        setSelectedImage(prevValue => {
            return prevValue === avatarFileObj[index] ? null : avatarFileObj[index]
        })
        setUploadedPictureSelected(false);
    }
    const handleProfilePictureClick = () => {
        setUploadedPictureSelected(!uploadedPictureSelected);
        setSelectedAvatarIndex(null)
        setSelectedImage (prevVal => {
            return prevVal === imageFileObj ? null : imageFileObj
        })
    }
    
    
    return (
        <Container className="bg-c3">
            {/* //! SKIP button */}
            <div className='w-full flex justify-end md:pr-4  absolute md:top-10 md:right-12 top-1 right-1 text-c4 hover:text-c1'>
                <div onClick={() => navigate("/user")} className='flex items-center md:border-2 border-c4 md:py-2 md:px-4 p-[6px] rounded-full'>
                    <p className='float-right px-2'>Skip</p>
                    <TbPlayerTrackNextFilled size={18} className={` animate-moveLeftRight `} />
                </div>
            </div>
            <h1 className={`font-bold text-c4 my-4 md:my-8 ${selectedAvatarIndex === null && 'animate-blinkingBg '}`}>
                Select your avatar
            </h1>
            <div className="md:flex gap-6 rounded-full p-2 border-2 border-c1">
                {avatars.map((avatar, index) => {
                    return (
                        
                        <img
                        onClick={() => handleAvatarClick(index)}
                        className={`w-[70px] md:w-[100px] m-6 avatar-shadow rounded-full ${selectedAvatarIndex === index && 'selected-avatar'
                        }`}
                        key={index}
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        />
                    )
                })}
            </div>
            <h1 className={`font-bold text-c4 my-4 md:my-8 ${selectedAvatarIndex === null && 'animate-blinkingBg '}`}>
                OR
            </h1>


            {profilePicture &&  <img onClick={()=> {handleProfilePictureClick();} }  className= {` ${uploadedPictureSelected && 'selected-avatar'} avatar-shadow w-[70px] md:w-[100px] h-[70px] md:h-[100px] mb-4 object-cover rounded-[50%]`} src={profilePicture} alt="" />}
            {/* //! image viewer */}
            {isViewerOpen && <div className='absolute p-[50px] z-10 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
                <img className='w-[260px] h-[260px] md:w-[500px] md:h-[500px] object-cover rounded-[50%]' src={profilePicture} alt="" />
                <span onClick={()=> setIsViewerOpen(false)} className='absolute right-10 top-10'>X</span>
            </div>}


            <input ref={imageRef} type="file" className='hidden' onChange={handleImageChange} />
            <Button border = "2px solid var(--c4)" primary onClick={() => imageRef.current.click()}>Choose From Computer</Button>

            {selectedImage && <Button onClick={() => uploadProfilePicture(selectedImage)} border="2px solid var(--c4)" borderRadius = "50px" margin="30px">Proceed</Button>}
           

        </Container>
    );
};

const InputContainer = styled.form`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  height: max-content;
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
