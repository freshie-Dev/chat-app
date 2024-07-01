import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import styled from 'styled-components';
import Header from '../header/Header';
import userIconWhite from "../../../assets/images/user-icon-white.png"
import userIconBlack from "../../../assets/images/user-icon-black.png"
import { useNavigate } from 'react-router-dom';

import { RiSettingsLine } from "react-icons/ri";
import { RiProfileLine } from "react-icons/ri";
import { GrShieldSecurity } from "react-icons/gr";
import { IoColorPaletteSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";

const Sidebar = () => {
    const navigate = useNavigate()

    const { fetchContacts, contacts, user, setSelectedChat } = useUser();

    const [selectedChatIndex, setSelectedChatIndex] = useState(null);
    const [openSettings, setOpenSettings] = useState(false)

    let sortedContacts = contacts && [ ...contacts]; // Create a copy of contacts array


    const handleChatClick = (contact) => {
        setSelectedChatIndex(prevValue => {
            if (prevValue === contact._id) {
                return null
            } else {
                return contact._id
            }
        });
        setSelectedChat(prevValue => {
            if (prevValue && prevValue._id === contact._id) {
                return null;
            } else {
                return contact;
            }
        });
    }

    useEffect(() => {
            fetchContacts();

            return () => {
                const user = localStorage.getItem("user")
                console.log(user)
                if (!user) {
                    setSelectedChat(null)
                    setSelectedChatIndex(null)
                    console.info("killing sidebar")
                } 
            }
    }, []);
    
    if (!contacts) {
        return <h1>Loading...</h1>;
    }


    return (
        <Container className='flex flex-col h-full min-w-max '>

            <p className='md:text-[2rem] text-[1.5rem] ml-4 mt-2'>Contacts</p>
            <div className='py-2 pr-3 pl-3  min-w-max relative h-full overflow-scroll'>
                {sortedContacts.map((contact, index) => {
                    return (
                        <div
                            key={index}
                            onClick={(e) => { handleChatClick(contact) }}
                            className={` customer-card flex gap-2 min-w-[170px]  bg-c4 my-2  px-2 py-3  shadow-2xl hover:scale-[1.04]  cursor-pointer 
                                ${selectedChatIndex === contact._id ? "customer-card-selected" : "customer-card"}`}
                        //  ${selectedChatIndex === contact._id && "sticky w-[305px] rounded-l-full"}`}
                        >
                            <img className='w-[50px] h-[50px] object-cover rounded-[50%] '  src={contact.profile.isProfilePictureSet ? contact.profile.profilePicture : userIconBlack} alt="" />
                            <div className='relative flex-1'>
                                <span className=' absolute notif  flex justify-center items-center rounded-full bg-c1 '>1</span>
                                <p className=' font-medium text-c1'>{contact.username}</p>
                                <p className='text-[#585858] font-light'>Hey, how are you?</p>
                            </div>
                            <span hidden> <Header selectedUser={contact} /></span>
                        </div>
                    );
                })}
            </div>

                <div className='flex justify-center items-center gap-3 bg-c2  py-4 relative'>
                    {!openSettings ? (
                        <>
                            <img className='w-[60px] h-[60px] object-cover rounded-[50%]' src={user.profile?.profilePicture || userIconWhite} alt="" />
                            <p className='font-bold text-[1.6rem]'>{user.username}</p>
                            <RiSettingsLine onClick={() => setOpenSettings(!openSettings)} className='hover:rotate-90 hover:scale-125 bg-c4 text-c1 p-2 w-[40px] h-[40px] rounded-full' size={25} />
                        </>
                    ) : (
                        <div className='w-full px-4'>
                            <span onClick={() => setOpenSettings(false)} className='absolute right-1 top-1 p-2 rounded-tr-md group'><MdCancel className='group-hover:scale-125 ' size={20} /></span>
                            <ul className='py-[4px]'>
                                <li onClick={() => navigate('/profile')} className=''><RiProfileLine color='#d4d4d4' size={25} />Profile</li>
                                <li className=''><GrShieldSecurity color='#d4d4d4' size={25} />Settings</li>
                                <li className=''><IoColorPaletteSharp color='#d4d4d4' size={25} />Preferences</li>
                            </ul>
                        </div>
                    )}
                </div>




        </Container>
    );
};


export default Sidebar;

const Container = styled.div`
    ul > * {
        display: flex;
        gap: .5rem;
        align-items: center;
        padding: 5px;
        font-size: 13px;
        /* font-weight: 500; */
        color: var(--c4);
        border-radius: 4px;
        &:hover {
            background-color: #b9b9b9;
        }
    }
    .customer-card {
        border-radius: 7px;
    }
    .customer-card-selected {
        border-radius: 50px;
    }
    .notif {
        right: .25rem;
        top: .25rem;
        height: 1.25rem;
        width: 1.25rem;
    }
    @media (max-width: 975px) {
        .notif {
            right: -5px;
            top: -5px;
            height: .85rem;
            width: .85rem;
        }
    }
    `


