

import React, { useEffect, useState } from 'react';
import { useStyle } from '../../../context/StylesContext';
import styled from 'styled-components';
import axios from 'axios';
import { AiOutlineUserDelete } from "react-icons/ai";
import BeatLoader from "react-spinners/BeatLoader"
import { useUser } from '../../../context/UserContext';

const ContactProfile = ({ contactId }) => {
    const { contactProfileId, setShowContactProfile, setcontactProfileId } = useStyle();
    const { deleteContact } = useUser()

    const [contactProfile, setContactProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleDeleteContact = async (contactId) => {
        const status = await deleteContact(contactId)
        if (status) {
            setContactProfile(null)
            setShowContactProfile(false)
            setcontactProfileId(null)
        }

    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/fetch_contact_data/${contactProfileId}`, {
                headers: {
                    "token": localStorage.getItem('token')
                }
            });
            console.log(response.data);
            setContactProfile(response.data);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [contactId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date) ? 'N/A' : date.toLocaleDateString();
    }

    if (isLoading) {
        return <Container>
            <BeatLoader color='orange' />
        </Container>
    }
    if (!contactProfile) {
        return <h1>Couldn't fetch user data</h1>;
    }
    return (
        <Container>
            <img src={contactProfile.profile.profilePicture || ""} alt="Profile" className='w-[100px] h-[100px] object-cover rounded-full' />
            <ProfileTable>
                <tbody className='body'>
                    <tr>
                        <th>Username:</th>
                        <td>{contactProfile.username}</td>
                    </tr>
                    <tr>
                        <th>Unique ID:</th>
                        <td>{contactProfile.uniqueId}</td>
                    </tr>
                    <tr>
                        <th>Email:</th>
                        <td>{contactProfile.email}</td>
                    </tr>
                    <tr>
                        <th>DOB:</th>
                        <td>{formatDate(contactProfile.profile.dob)}</td>
                    </tr>
                    <tr>
                        <th>Bio:</th>
                        <td>{contactProfile.profile.bio}</td>
                    </tr>
                    <tr>
                        <th>Friends Since:</th>
                        <td>{contactProfile.friends.length > 0 ? formatDate(contactProfile.friends[0].createdAt) : 'N/A'}</td>
                    </tr>
                    <tr>
                        <th>Online Status:</th>
                        <td>{contactProfile.onlineStatus ? 'Online' : 'Offline'}</td>
                    </tr>
                </tbody>
            </ProfileTable>
            <div className=' delete-button flex gap-2 items-center rounded-md p-3 my-4 cursor-pointer'
                onClick={() => { handleDeleteContact(contactProfile._id) }}>
                <p >Delete Friend</p>
                <AiOutlineUserDelete size={25} />
            </div>
        </Container>
    );
}

export default ContactProfile;

const Container = styled.div`
    width: 100%;
    height: 100%;
    background: var(--c1);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
        margin: 20px;
    }

    .delete-button, .delete-button p {
    background-color: #fff;
    color: red;
}

.delete-button:hover {
    background-color: red;
    
    color: #fff;
    & > p {
        color: white;
        background-color: red;
    }
} 
`;

const ProfileTable = styled.table`
    width: 80%;
    max-width: 500px;
    border-collapse: collapse;
    background: var(--c2);
    border-radius: 1rem;
    overflow: hidden;

    th, td {
        padding: 10px;
        text-align: left;
    }

    th {
        background: var(--c4);
        color: var(--c3)
    }

    tbody tr:not(:last-child) th, tbody tr:not(:last-child) td {
        border-bottom: 1px solid var(--c3);
    }
`;


