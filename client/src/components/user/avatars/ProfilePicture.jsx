import React, { useRef, useState, useEffect, useCallback } from 'react'
import ImageViewer from 'react-simple-image-viewer'
import userIconWhite from "../../../assets/images/user-icon-white.png";


import { BiSolidMessageSquareEdit } from 'react-icons/bi'
import { FaRegEye, FaUpload } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import { RxReset } from 'react-icons/rx';
import { compressImage, imageToBase64 } from '../../../utilities/Helpers';


const ProfilePicture = ({ user, formData, setFormData }) => {
    const fileInputRef = useRef(null);

    const [isViewerOpen, setIsViewerOpen] = useState(false);


    //! open image viewer
    const openImageViewer = useCallback((index) => {
        setIsViewerOpen(true);
    }, []);
    //! close image viewer
    const closeImageViewer = () => {
        setIsViewerOpen(false);
    };

    const handleChange = async (e) => {
        const file = e.target.files[0];
        try {
            const compressedImage = await compressImage(file);
            const base64Image = await imageToBase64(compressedImage);
            setFormData(prevValues => {
                return {
                    ...prevValues,
                    profilePicture: base64Image
                }
            })
        } catch (error) {
            console.error('Error compressing image:', error);
        }
    };
    //! reset profile picture
    const resetProfilePicture = () => {
        
       if(user.profile.isProfilePictureSet) {
        setFormData(prevValues => {
            return {
                ...prevValues,
                profilePicture: user.profile.profilePicture
            }
        })
       } else {
        setFormData(prevValues => {
            return {
                ...prevValues,
                profilePicture: userIconWhite
            }
        })
       }
    }

    return (
        <>
            <div className='group relative mt-2 mb-4 '>
                <label
                    style={{ backgroundImage: `url(${formData.profilePicture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    className='w-[70px] h-[70px] rounded-full group-hover:brightness-50 duration-100'
                    htmlFor="profile-picture"
                ></label>
                <BiSolidMessageSquareEdit
                    onClick={() => fileInputRef.current.click()}
                    size={25}
                    className='absolute top-[50%] right-[50%] translate-x-[12px] translate-y-[-13px] cursor-pointer group-hover:block hidden'
                />
                <input
                    name='profilePicture'
                    onChange={handleChange}
                    accept='image/*'
                    ref={fileInputRef}
                    className='hidden'
                    type="file"
                />
            </div>
            <div className='flex gap-4 mb-6'>
                <FaRegEye className='hover:scale-125' size={20} onClick={e => openImageViewer()} />
                <MdFileUpload className='hover:scale-125' size={22} onClick={() => fileInputRef.current.click()} />
                <RxReset onClick={resetProfilePicture} className='hover:scale-125' size={20} />
            </div>
            {isViewerOpen && <div className='absolute p-[50px] z-10 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
                <img className='w-[260px] h-[260px] md:w-[500px] md:h-[500px] object-cover rounded-full' src={formData.profilePicture} alt="" />
                <span onClick={closeImageViewer} className='absolute right-10 top-10'>X</span>
            </div>}
        </>
    )
}

export default ProfilePicture

