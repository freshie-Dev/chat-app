import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import styled from 'styled-components';
import Header from '../header/Header';
import userIconWhite from "../../../assets/images/user-icon-white.png"
import userIconBlack from "../../../assets/images/user-icon-black.png"
import { Tooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom';

import useSnack from "../../../utilities/useSnack"

import { RiSettingsLine } from "react-icons/ri";
import { RiProfileLine } from "react-icons/ri";
import { GrShieldSecurity } from "react-icons/gr";
import { IoColorPaletteSharp } from "react-icons/io5";
import { IoIosNotifications, IoMdPersonAdd } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useFriendList } from '../../../context/FriendListContext';
import { useSocket } from '../../../context/SocketContext';

const Sidebar = () => {
    const navigate = useNavigate()
    const { socketSendFriendRequest, requestFromSocket, reqRef, socketUpdateSenderNotification, notificationFromSocket, notRef } = useSocket()
    const { fetchContacts, contacts, user, setSelectedChat, updateFriendRequests, updateNotifications, fetchLatestContact, updateFriendRequestStatus, updateNotification } = useUser();
    const { sendFriendRequest, respondFriendRequest } = useFriendList()
    const { showError, showSuccess } = useSnack()


    const [selectedChatIndex, setSelectedChatIndex] = useState(null);
    const [openSettings, setOpenSettings] = useState(false)

    const [addId, setAddId] = useState('')
    const [showNotifications, setShowNotifications] = useState(false)
    const [showFriendRequests, setShowFriendRequests] = useState(false)

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

    const handleFriendRequest = async (e) => {
        e.preventDefault();
        const status = await sendFriendRequest(addId)
        if (status.success) {
            showSuccess(status.message)
            updateNotifications(status.notificationObj)
            socketSendFriendRequest(status.receiverObj)
        } else {
            showError(status.message)
        }
    }

    const handleRespondFriendRequest = async (choice, friendRequestObj) => {
        const status = await respondFriendRequest(choice, friendRequestObj._id)
        console.log(status)
        if (status.status === "accepted") {
            await updateFriendRequestStatus(status.status, status.friendRequestId)
            await fetchLatestContact()
            await socketUpdateSenderNotification(status.status, friendRequestObj)

        }
    }

    useEffect(() => {
        fetchContacts();
        return () => {
            const user = localStorage.getItem("user")
            if (!user) {
                setSelectedChat(null)
                setSelectedChatIndex(null)
                console.info("killing sidebar")
            }
        }
    }, []);

    useEffect(() => {
        if (requestFromSocket && reqRef.current) {
            updateFriendRequests(requestFromSocket)
            reqRef.current = false;
        }
    }, [reqRef, requestFromSocket])

    useEffect(() => {
        if (notificationFromSocket && notRef.current) {
            console.log("running 3")
            updateNotification(notificationFromSocket)
            notRef.current = false;
            fetchLatestContact()
        }
    }, [notRef, notificationFromSocket])
    

    if (!contacts) {
        return <h1>Loading...</h1>;
    }


    return (
        <Container className='flex flex-col justify-between h-full min-w-max '>
            <p className='md:text-[2rem] text-[1.5rem] ml-4 mt-2'>Contacts</p>


            {/* //! add a new contact */}
            <form onSubmit={handleFriendRequest} className='flex items-center relative px-1'>
                <input value={addId} onChange={(e) => setAddId(e.target.value)} type="text" placeholder='Add New Contact' className='py-2 px-3 m-2 rounded-md w-full text-c1' />
                <button className='absolute right-6'><FaPlus size={22} className='text-black hover:text-c3' /></button>
            </form>

            <div className=' mx-3 my-2 flex items-center px-3 gap-1 border-2 border-t-c4 border-b-c4 border-r-0 border-l-0'>
                {/* //! show notifications BUTTON */}
                <div className=' p-2 flex-1  group' onClick={() => { setShowNotifications(false); setShowFriendRequests(!showFriendRequests) }}>
                    <IoMdPersonAdd size={28} className='my- mx-auto text-[#f09b55] group-hover:text-c4' />
                </div>
                <div className='w-[1px] bg-c4 h-[80%]' />
                {/* //! show friend requests BUTTON */}
                <div className=' p-2 flex-1 group' onClick={() => { setShowFriendRequests(false); setShowNotifications(!showNotifications) }}>
                    <IoIosNotifications size={28} className='my- mx-auto text-[#f09b55] group-hover:text-c4' />
                </div>
            </div>


            {/* //& Showing friend Requests */}
            <div className={` overflow-hidden h-0 ${showFriendRequests && "h-[600px] p-2"} flex flex-col-reverse`}>
                {user.friendRequests && user.friendRequests.map(req => {
                    console.log(user.friendRequests.length)
                    if (req) {
                        return (
                            <div>
                                <div className='flex items-center gap-2'>
                                    <img className='w-[40px] h-[40px] object-cover rounded-full' src={req.profilePicture || userIconBlack} alt="" />
                                    <div>
                                        <b>{req.username}</b>
                                        <p> sent you a Friend request</p>
                                    </div>

                                </div>
                                <div className='flex my-2'>

                                    {req.status === "pending" ? <> 
                                        <button onClick={() => { handleRespondFriendRequest("accept", req); }} className='flex-1 bg-c1 rounded-l-full py-[2px] border-r-[1px] border-c4 '><p>Accept</p></button>
                                        <button onClick={() => { handleRespondFriendRequest("reject", req); }} className='flex-1 bg-c1 rounded-r-full py-[2px]'><p>Reject</p></button></>
                                        : 
                                        <>
                                            <button  className='flex-1 bg-c1 rounded-full py-[2px]'><p>{req.status}</p></button>
                                        </>

                                    }
                                </div>
                                <hr className='my-2 border-[#d39f5c]' />
                            </div>
                        )
                    }
                })}
            </div>

            {/* //& Showing notifications */}
            <div className={` overflow-hidden h-0 ${showNotifications && "h-[500px] p-2"}`}>
                {user.notifications.length > 0 && user.notifications.map(notif => {
                    return (
                        <>
                            <div className='flex items-center gap-2'>
                                <img className='w-[40px] h-[40px] object-cover rounded-full' src={notif.profilePicture || userIconBlack} alt="" />
                                <div>
                                    <p>{notif.message}</p>
                                </div>
                            </div>
                            <p className='flex-1 my-2 bg-c1 rounded-full py-[2px] text-center'>{notif.status}</p>
                            <hr className='my-2 border-[#d39f5c]' />
                        </>
                    )
                })}
            </div>

            {/* //! search existing contacts */}
            <div className='flex items-center relative px-1'>
                <input type="text" placeholder='Seach Contacts' className='py-2 px-3 m-2 rounded-md w-full text-c1' />
                <FaSearch size={21} className='absolute right-6 text-black hover:text-c3' />
            </div>

            <div className='py-2 pr-3 pl-3  min-w-max relative h-full overflow-scroll'>
                {contacts.map((contact, index) => {
                    console.log(contact)
                    return (
                        <div
                            key={index}
                            onClick={(e) => { handleChatClick(contact) }}
                            className={` customer-card flex gap-2 min-w-[170px]  bg-c4 my-2  px-2 py-3  shadow-2xl hover:scale-[1.04]  cursor-pointer 
                                ${selectedChatIndex === contact._id ? "customer-card-selected" : "customer-card"}`}
                        >
                            <img
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Hello world!"
                                className='w-[50px] h-[50px] object-cover rounded-[50%] '
                                src={contact.profile.isProfilePictureSet ? contact.profile.profilePicture : userIconBlack}
                                alt="DP"
                            />

                            <Tooltip id="my-tooltip" />
                            <div className='relative flex-1'>
                                <span className=' absolute notif  flex justify-center items-center rounded-full bg-c1 '>1</span>
                                <p className=' font-medium text-c1'>{contact.username}</p>
                                <p className='text-[#585858] font-light'>Hey, how are you?</p>
                            </div>
                            <span hidden> <Header selectedUser={contact.friend} /></span>
                        </div>
                    );
                })}
            </div>


            <div className='flex justify-center items-center gap-3 bg-c2  py-4 relative'>
                {!openSettings ? (
                    <>
                        <img className='w-[60px] h-[60px] object-cover rounded-[50%]' src={user.profile.isProfilePictureSet ? user.profile.profilePicture : userIconWhite} alt="" />
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


