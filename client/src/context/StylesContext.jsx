import { createContext, useContext, useEffect, useRef, useState } from "react";



const StyleContext = createContext();

const StyleProvider = ({ children }) => {

    const [showSlider, setShowSlider] = useState(false)
  return (
    <StyleContext.Provider
      value={{
        showSlider, setShowSlider
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