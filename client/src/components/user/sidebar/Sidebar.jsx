import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import styled from 'styled-components';
import Header from '../header/Header';

const Sidebar = () => {
    const { fetchContacts, contacts, user, selectedChat, setSelectedChat, fetchMessages, tempAvatar } = useUser();

    const [selectedChatIndex, setSelectedChatIndex] = useState(null);
    const [] = useState(null);

    let sortedContacts = [...contacts]; // Create a copy of contacts array


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
        if (selectedChat) console.log({ name: selectedChat.username, email: selectedChat.email })
        if (selectedChat) console.log("selectee chat is null")

    }, [selectedChat])

    useEffect(() => {
        console.log("fetching contacts")
        fetchContacts();
    }, []);

    if (!contacts) {
        return <h1>Loading...</h1>;
    }

    return (
        <Container className='flex flex-col h-full min-w-max '>

            <div className='py-2 pr-3 pl-3 min-w-max relative h-full '>
                <p className='text-[2rem]'>Contacts</p>
                {sortedContacts.map((contact, index) => {
                    return (
                        <div
                            key={index}
                            onClick={(e) => { handleChatClick(contact) }}
                            className={`customer-card flex gap-2 min-w-[170px]  bg-c4 my-2  px-2 py-3  shadow-2xl hover:scale-[1.04]  cursor-pointer 
                                ${selectedChatIndex === contact._id ? "customer-card-selected" : "customer-card"}`}
                        //  ${selectedChatIndex === contact._id && "sticky w-[305px] rounded-l-full"}`}
                        >
                            <img className='logo' src={contact.avatar} alt="" />
                            <div className='relative w-full'>
                                <span className=' absolute notif  flex justify-center items-center rounded-full bg-c1 '>1</span>
                                <p className=' font-medium text-c1'>{contact.username}</p>
                                <p className='text-[#585858] font-light'>Hey, how are you?</p>
                            </div>
                            <span hidden> <Header selectedUser={contact} /></span>
                        </div>
                    );
                })}
            </div>
            <div className='flex justify-center items-center gap-3 bg-c2  py-4'>
                <img width={65} src={user.isAvatarSet ? user.avatar : tempAvatar} alt="" />
                <p className='font-bold text-[1.6rem]'>{user.username}</p>
                {/* {user.username} */}
            </div>

        </Container>
    );
};

export default Sidebar;

const Container = styled.div`
    .customer-card {
        border-radius: 7px;
    }
    .customer-card-selected {
        border-radius: 50px;
    }
    .logo {
        width: 50px;
    }
    .notif {
        right: .25rem;
        top: .25rem;
        height: 1.25rem;
        width: 1.25rem;
    }
    @media (max-width: 975px) {
        .logo {
            width: 35px;
        }
        .notif {
            right: -5px;
            top: -5px;
            height: .85rem;
            width: .85rem;
        }
    }
    `



// Rearrange the sortedContacts array based on selectedChatIndex
// if (selectedChatIndex !== null) {
//     const selectedContact = sortedContacts.find(contact => contact._id === selectedChatIndex);
//     if (selectedContact) {
//         sortedContacts = sortedContacts.filter(contact => contact._id !== selectedChatIndex);
//         sortedContacts.unshift(selectedContact);
//     }
// }