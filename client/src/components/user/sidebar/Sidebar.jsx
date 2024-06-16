import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';

const Sidebar = () => {
    const { fetchContacts, contacts, user } = useUser();

    const [selectedChatIndex, setSelectedChatIndex] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    if (!contacts) {
        return <h1>Loading...</h1>;
    }


    let sortedContacts = [...contacts]; // Create a copy of contacts array

    // Rearrange the sortedContacts array based on selectedChatIndex
    if (selectedChatIndex !== null) {
        const selectedContact = sortedContacts.find(contact => contact._id === selectedChatIndex);
        if (selectedContact) {
            sortedContacts = sortedContacts.filter(contact => contact._id !== selectedChatIndex);
            sortedContacts.unshift(selectedContact);
        }
    }

    return (
        <div className='flex flex-col  h-full'>
                <div className='py-2 pr-3 pl-4 relative h-full '>
                <p className='text-[2rem]'>Contacts</p>
                    {sortedContacts.map((contact, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedChatIndex(prevValue => {
                                        if (prevValue === contact._id) {
                                            return null
                                        } else {
                                            return contact._id
                                        }
                                    });
                                }}
                                className={` flex gap-4 min-w-max  bg-c4 my-2 rounded-md p-2  shadow-2xl hover:scale-[1.04]  cursor-pointer 
                                 ${selectedChatIndex === contact._id && "sticky w-[305px] rounded-l-full"}`}
                            >
                                <img width={50} src={contact.avatar} alt="" />
                                <div className='relative w-full'>
                                    <span className=' absolute right-1 top-1 h-5 w-5 flex justify-center items-center rounded-full bg-c1 '>1</span>
                                    {/* <p className=' font-semibold text-[#333333]'>Ali Azhar</p> */}
                                    <p className=' font-medium text-c1'>{contact.username}</p>
                                    <p className='text-[#585858] font-light'>Hey, how are you?</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            <div className='flex justify-center items-center gap-3 bg-c2  py-4'>
                <img width={65} src={user.avatar} alt="" />
                <p className='font-bold text-[1.6rem]'>Ahmad</p>
                {/* {user.username} */}
            </div>
        </div>
    );
};

export default Sidebar;


