import { createContext, useContext, useEffect, useRef, useState } from "react";



const StyleContext = createContext();

const StyleProvider = ({ children }) => {

    const [showSlider, setShowSlider] = useState(false)

    const [showContactProfile, setShowContactProfile] = useState(false)

    const [contactProfileId, setcontactProfileId] = useState(null)

    const handleShowContactProfile = (contactId)=> {
      if(contactProfileId) {
        if(contactProfileId === contactId) {
          setShowContactProfile(false)
          setcontactProfileId(null)
        } else {
          setcontactProfileId(contactId)
        }
      } else {
        setShowContactProfile(true)
        setcontactProfileId(contactId)
      }
    }

  return (
    <StyleContext.Provider
      value={{
        showSlider, setShowSlider,
        showContactProfile, setShowContactProfile,
        contactProfileId, setcontactProfileId,
        handleShowContactProfile
      }}
    >
      {children}
    </StyleContext.Provider>
  );
};
// CUSTOM HOOK FOR USING USER CONTEXT
const useStyle = () => {
  return useContext(StyleContext);
};

export default StyleProvider;
export { useStyle };