import React, { useEffect, useRef, useState } from 'react';
import { BiSolidMessageSquareEdit } from 'react-icons/bi';
import styled from 'styled-components';
import Button from '../../../styled-components/Button';
import { formatTime } from '../../../utilities/Helpers';
import { RxReset } from "react-icons/rx";
const Input = ({ user, formData, setFormData }) => {

  const usernameRef = useRef(null)
  const displayNameRef = useRef(null)
  const genderRef = useRef(null)
  const bioRef = useRef(null)
  const dobRef = useRef(null)
  
  const [lastEditedField, setLastEditedField] = useState(null);
  const [editting, setEditting] = useState({
    username: false,
    displayName: false,
    gender: false,
    dob: false,
    bio: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetFieldValue = (field) => {
    focusInput(field)
    if (field === 'username') {
      setFormData(prevValues => {
        return {
          ...prevValues,
          [field]: user[field]
        }
      })
    } else if (field === "dob") {
      setFormData(prevValues => {
        return {
          ...prevValues,
          [field]: user.profile && user.profile.dob ? formatTime(user.profile.dob) : "dd/mm/yyyy"   
         }
      })
    } else {
      setFormData(prevValues => {
        return {
          ...prevValues,
          [field]: user.profile && user.profile[field] ? user.profile[field] : "",
        }
      })
    }
  }

  const handleEditToggle = (field) => {
    setEditting(prevValue => {
      let newEditting = {};
      // Set all fields to false except the toggled field
      Object.keys(prevValue).forEach(key => {
        newEditting[key] = key === field ? !prevValue[field] : false;
      });
      return newEditting;
    });

 
    setLastEditedField(field)
    // Optionally, you can save formData to the server or user state when editing is toggled off.
  };

  const removeFocus = (field) => {
    switch (field) {
      case 'username':
        usernameRef.current.blur();
        break;
      case 'displayName':
        displayNameRef.current.blur();
        break;
      case 'gender':
        genderRef.current.blur();
        break;
      case 'dob':
        dobRef.current.blur();
        break;
      case 'bio':
        bioRef.current.blur();
        break;
      default:

    }
  };
  const focusInput = (field) => {
    switch (field) {
      case 'username':
        usernameRef.current.focus();
        break;
      case 'displayName':
        displayNameRef.current.focus();
        break;
      case 'gender':
        genderRef.current.focus();
        break;
      case 'dob':
        dobRef.current.focus();
        break;
      case 'bio':
        bioRef.current.focus();
        break;
      default:
    }
  };
  useEffect(() => {
    if (lastEditedField) {
      if (editting[lastEditedField]) {
        focusInput(lastEditedField); 
      } else {
        removeFocus(lastEditedField); 
      }
    }
  }, [editting, lastEditedField]);


  return (
      <InputContainer>
{/* //! username */}
        <div className="form__group field group">
          <input
            ref={usernameRef}
            disabled={!editting.username}
            name='username'
            value={formData.username}
            onChange={handleChange}
            type="input"
            className="form__field"
          />
          <div htmlFor="username"/>
          <label htmlFor="username" className="form__label">Username</label>
          {formData.username !== user.username && < RxReset onClick={()=> {resetFieldValue('username')}} size={22}  className='absolute my-2 bottom-[2px] right-10  hover:text-c1'/>}
          <BiSolidMessageSquareEdit
            onClick={() => { handleEditToggle('username')}}
            size={25}
            className='absolute my-2 bottom-0 right-0 group-hover:block md:hidden hover:text-c1'
          />
        </div>
{/* //! email */}
        <div className="form__group field group">
          <input
            disabled
            name='email'
            value={user.email}
            type="input"
            className="form__field"
          />
          <div htmlFor="email"/>
          <label htmlFor="email" className="form__label">Email</label>
          {/* No edit button for email */}
        </div>
{/* //! displayName */}
        <div className="form__group field group">
          <input
          ref={displayNameRef}
            disabled={!editting.displayName}
            name='displayName'
            // value={formData.displayName}
            value={formData.displayName}
            onChange={handleChange}
            type="input"
            className="form__field w-[60%]"
          />
          <div htmlFor="displayName"/>
          <label htmlFor="display-name" className="form__label">Display Name</label>
          {formData.displayName !== user.profile?.displayName && < RxReset onClick={()=> {resetFieldValue('displayName')}} size={22}  className='absolute my-2 bottom-[2px] right-10  hover:text-c1'/>}
          <BiSolidMessageSquareEdit
            onClick={() => handleEditToggle('displayName')}
            size={25}
            className='absolute my-2 bottom-0 right-0 group-hover:block md:hidden hover:text-c1'
          />
        </div>
{/* //! gender */}
        <div className="form__group field group ">
          <select
            ref={genderRef}
            disabled={!editting.gender}
            name='gender'
            value={formData.gender}
            onChange={handleChange}
            className="form__field  py-[9px]"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div htmlFor="gender"/>
          <label htmlFor="gender" className="form__label">Gender</label>
          {formData.gender !== user.profile?.gender && < RxReset onClick={()=> {resetFieldValue('gender')}} size={22}  className='absolute my-2 bottom-[2px] right-10  hover:text-c1'/>}
          <BiSolidMessageSquareEdit
            onClick={() => handleEditToggle('gender')}
            size={25}
            className='absolute my-2 bottom-0 right-0 group-hover:block md:hidden hover:text-c1'
          />
        </div>
{/* //! bio */}
        <div className='form__group field group md:col-span-2'>
          
          <textarea onChange={handleChange} disabled={!editting.bio} value={formData.bio} ref={bioRef} className='form__field' name="bio" id="bio" rows={1} maxLength={80}/>
          <div htmlFor="bio"/>
          <label htmlFor="bio" className="form__label">Bio</label>
          {user.profile?.bio !== formData.bio  && < RxReset onClick={()=> {resetFieldValue('bio')}} size={22}  className='absolute my-2 bottom-[2px] right-10  hover:text-c1'/>}
          <BiSolidMessageSquareEdit
            onClick={() => handleEditToggle('bio')}
            size={25}
            className='absolute my-2 bottom-0 right-0 group-hover:block md:hidden hover:text-c1'
          />
        </div>


{/* //! dob */}
        <div className="form__group field group">
          <input
            ref={dobRef}
            disabled={!editting.dob}
            name='dob'
            value={formData.dob}
            onChange={handleChange}
            type="date"
            className="form__field"
          />
          <div htmlFor="dob"/>
          <label htmlFor="dob" className="form__label">Date of Birth</label>
          {/* {formData.dob !== user.profile?.dob && formData.dob !== "dd/mm/yyyy" && < RxReset onClick={()=> {resetFieldValue('dob')}} size={22}  className='absolute my-2 bottom-[2px] right-10  hover:text-c1'/>} */}
          {formData.dob !== (user.profile?.DOB ? formatTime(user.profile.DOB) : '') && formData.dob !== 'dd/mm/yyyy' && <RxReset onClick={() => resetFieldValue('dob')} size={22} className='absolute my-2 bottom-[2px] right-10 hover:text-c1' />}

          <BiSolidMessageSquareEdit
            onClick={() => handleEditToggle('dob')}
            size={25}
            className='absolute my-2 bottom-0 right-0 group-hover:block md:hidden hover:text-c1'
          />
        </div>
{/* //! createdAt */}
        <div className="form__group field group">
          <input
            disabled
            value={formatTime(user.createdAt)}
            type="input"
            className="form__field"
          />
          <div htmlFor="createdAt"/>
          <label htmlFor="createdAt" className="form__label">Created At</label>
          {/* No edit button for created at */}
        </div>
      </InputContainer>
  );
};

export default Input;

const InputContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  position: relative;
  width: 700px;

  @media (max-width: 900px) {
    width: 500px;
  }
  @media (max-width: 550px) {
    width: 330px;
  }

  select {
    background-color: var(--c3);
    & > * {
      background-color: var(--c3);
      border-bottom: 1px solid black;
      margin: 5px 0;
      &:hover {
        background-color: var(--c2);
      }
    }
  } 

  .select selected {
    background-color: yellow;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

`;

